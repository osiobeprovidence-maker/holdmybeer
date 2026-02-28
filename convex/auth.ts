import { convexAuth } from "@convex-dev/auth/server";
import { Email } from "@convex-dev/auth/providers/Email";
import { Resend } from "resend";

// 48 hours in milliseconds
const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

// Custom OTP provider using Resend — sends a 6-digit code, no magic link redirect needed
const ResendOTPProvider = Email({
    maxAge: 60 * 15, // code is valid for 15 minutes
    // Generate a clean 6-digit numeric code (e.g. 482910)
    generateVerificationToken: async () => {
        return String(Math.floor(100000 + Math.random() * 900000));
    },
    async sendVerificationRequest({ identifier: email, token }) {
        const resend = new Resend(process.env.AUTH_RESEND_KEY);
        const { error } = await resend.emails.send({
            from: "login@holdmybeer.sbs",
            to: [email],
            subject: `Your HoldMyBeer Login Code`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #000;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 40px;">🍺</span>
                        <h1 style="font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin: 12px 0 0; color: #000;">HoldMyBeer</h1>
                    </div>
                    <div style="background: #f5f5f7; border-radius: 24px; padding: 40px; text-align: center;">
                        <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; color: #86868b; margin: 0 0 16px;">Your Login Code</p>
                        <div style="font-size: 52px; font-weight: 900; letter-spacing: 0.25em; color: #000; margin: 0 0 16px; font-variant-numeric: tabular-nums;">${token}</div>
                        <p style="font-size: 13px; color: #86868b; margin: 0;">Valid for 15 minutes. Do not share this code.</p>
                    </div>
                    <p style="text-align: center; font-size: 11px; color: #86868b; margin-top: 32px; text-transform: uppercase; letter-spacing: 0.2em;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });
        if (error) {
            throw new Error(`Failed to send OTP email: ${error.message}`);
        }
    },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [ResendOTPProvider],
    session: {
        totalDurationMs: FORTY_EIGHT_HOURS,
        inactiveDurationMs: FORTY_EIGHT_HOURS,
    },
    callbacks: {
        async afterUserCreatedOrUpdated(ctx, args) {
            // Only runs on brand-new users (existingUserId will be null)
            if (args.existingUserId !== null) return;

            const userIdString = args.userId as string;
            const db = (ctx as any).db;

            // Create a slim skeleton — CompleteProfile page fills the rest
            const existing = await db
                .query("profiles")
                .withIndex("by_userId", (q: any) => q.eq("userId", userIdString))
                .unique();

            if (!existing) {
                await db.insert("profiles", {
                    userId: userIdString,
                    email: args.profile?.email as string | undefined,
                    is_creator: false,
                    kyc_verified: false,
                    kyc_status: "unverified",
                    has_purchased_sign_up_pack: false,
                    panic_mode_opt_in: false,
                    panic_mode_price: 0,
                    coins: 0, // credited AFTER CompleteProfile is submitted
                    is_suspended: false,
                    reliability_score: 70,
                });
            }
        }
    }
});
