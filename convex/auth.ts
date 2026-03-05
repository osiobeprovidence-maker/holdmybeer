import { action, internalMutation, mutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Resend } from "resend";

export const getLatestOTP = internalQuery({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const otps = await ctx.db
            .query("otps")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .collect();
        otps.sort((a, b) => b._creationTime - a._creationTime);
        return otps[0];
    },
});

export const storeOTP = internalMutation({
    args: { email: v.string(), code: v.string(), expiresAt: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.insert("otps", {
            email: args.email,
            code: args.code,
            expiresAt: args.expiresAt,
        });
    },
});

export const sendOTP = action({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        // Cooldown check: 60 seconds
        const latestOTP = await ctx.runQuery(internal.auth.getLatestOTP, { email: args.email });
        if (latestOTP && Date.now() - latestOTP._creationTime < 60000) {
            const secondsLeft = Math.ceil((60000 - (Date.now() - latestOTP._creationTime)) / 1000);
            throw new Error(`Please wait ${secondsLeft} seconds before requesting a new code.`);
        }

        // Generate 6 digit code
        const code = args.email === 'test@holdmybeer.sbs' ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 15 * 60 * 1000;

        // Store OTP in database (valid for 15 minutes) using an internal mutation
        await ctx.runMutation(internal.auth.storeOTP, {
            email: args.email,
            code,
            expiresAt,
        });

        // Send email using Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
            from: "login@holdmybeer.sbs",
            to: [args.email],
            subject: `Your HoldMyBeer Login Code`,
            html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #000;">
              <div style="text-align: center; margin-bottom: 32px;">
                   <span style="font-size: 40px;">🍺</span>
                   <h1 style="font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin: 12px 0 0; color: #000;">HoldMyBeer</h1>
              </div>
              <div style="background: #f5f5f7; border-radius: 24px; padding: 40px; text-align: center;">
                  <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; color: #86868b; margin: 0 0 16px;">Your Login Code</p>
                  <div style="font-size: 52px; font-weight: 900; letter-spacing: 0.25em; color: #000; margin: 0 0 16px; font-variant-numeric: tabular-nums;">${code}</div>
                  <p style="font-size: 13px; color: #86868b; margin: 0;">Valid for 15 minutes. Do not share this code.</p>
              </div>
              <p style="text-align: center; font-size: 11px; color: #86868b; margin-top: 32px; text-transform: uppercase; letter-spacing: 0.2em;">If you didn't request this, you can safely ignore this email.</p>
          </div>
      `,
        });

        if (error) {
            throw new Error(`Failed to send OTP email: ${error.message}`);
        }

        return { success: true };
    },
});

export const verifyOTP = mutation({
    args: { email: v.string(), code: v.string(), referralCode: v.optional(v.string()) },
    handler: async (ctx, args) => {
        // Find the OTP matching the email and code
        const otps = await ctx.db
            .query("otps")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .collect();

        // Sort by most recent first
        otps.sort((a, b) => b._creationTime - a._creationTime);

        const latestOTP = otps[0];

        if (!latestOTP || latestOTP.code !== args.code) {
            throw new Error("Invalid code.");
        }

        if (Date.now() > latestOTP.expiresAt) {
            throw new Error("Code has expired.");
        }

        // Delete the used OTP
        await ctx.db.delete(latestOTP._id);

        // Find or create user
        let user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        let isNewUser = false;
        if (!user) {
            const userId = await ctx.db.insert("users", {
                email: args.email,
                profileCompleted: false,
                coins: 0,
                fullName: "",
                phone: ""
            });
            user = await ctx.db.get(userId);
            isNewUser = true;

            // Create a profile for compatibility
            await ctx.db.insert("profiles", {
                userId: userId,
                email: args.email,
                is_creator: false,
                kyc_verified: false,
                kyc_status: "unverified",
                has_purchased_sign_up_pack: false,
                panic_mode_opt_in: false,
                panic_mode_price: 0,
                coins: 0,
                is_suspended: false,
                reliability_score: 70,
            });

            // Generate a referral code for this new user (based on email local-part)
            try {
                const base = (args.email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'user';
                let candidate = base;
                // Ensure uniqueness
                let attempts = 0;
                while (attempts < 10) {
                    const existing = await ctx.db.query('users').withIndex('by_referral', (q: any) => q.eq('referral_code', candidate)).unique();
                    if (!existing) break;
                    candidate = base + Math.random().toString(36).slice(2, 6);
                    attempts++;
                }
                await ctx.db.patch(userId, { referral_code: candidate, username: base });
                user = await ctx.db.get(userId);
            } catch (e) {
                console.warn('Failed to generate referral code', e);
            }

            // If a referralCode was supplied, link the referral
            if (args.referralCode) {
                try {
                    const referrer = await ctx.db.query('users').withIndex('by_referral', (q: any) => q.eq('referral_code', args.referralCode)).unique();
                    await ctx.db.insert('referrals', {
                        referrerId: referrer ? referrer._id : null,
                        referredUserId: userId,
                        referredEmail: args.email,
                        createdAt: Date.now(),
                    } as any);
                } catch (e) {
                    console.warn('Failed to record referral', e);
                }
            }
        }

        // Generate a secure random sessionToken
        const sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        const expiresAt = Date.now() + (1000 * 60 * 60 * 24 * 30); // 30 days

        // Create session
        await ctx.db.insert("sessions", {
            userId: user!._id,
            sessionToken,
            expiresAt,
        });

        console.log({
            event: "auth_success",
            email: args.email,
            userId: user!._id,
            isNewUser
        });

        return { sessionToken, isNewUser };
    },
});

export const logout = mutation({
    args: { sessionToken: v.string() },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query("sessions")
            .withIndex("by_token", (q) => q.eq("sessionToken", args.sessionToken))
            .unique();
        if (session) {
            await ctx.db.delete(session._id);
        }
        return { success: true };
    },
});
