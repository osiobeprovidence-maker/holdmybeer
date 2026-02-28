import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Resend({
        apiKey: process.env.AUTH_RESEND_KEY,
        from: "login@holdmybeer.sbs" // Update this to your verified Resend domain if going to real production later
    })],
    callbacks: {
        async afterUserCreatedOrUpdated(ctx, args) {
            const userIdString = args.userId as string; // or wait, generic id might be a string in type
            // Check if profile exists
            const db = (ctx as any).db;
            const existingProfile = await db
                .query("profiles")
                .withIndex("by_userId", (q: any) => q.eq("userId", userIdString))
                .unique();

            if (!existingProfile) {
                await ctx.db.insert("profiles", {
                    userId: userIdString,
                    email: args.profile?.email as string | undefined,
                    name: args.profile?.name as string | undefined,
                    is_creator: false,
                    kyc_verified: false,
                    kyc_status: "unverified",
                    has_purchased_sign_up_pack: false,
                    panic_mode_opt_in: false,
                    panic_mode_price: 0,
                    coins: 2, // Sign up bonus
                    is_suspended: false,
                    reliability_score: 70,
                });
            }
        }
    }
});
