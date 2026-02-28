import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";

// 48 hours in milliseconds
const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Resend({
        apiKey: process.env.AUTH_RESEND_KEY,
        from: "login@holdmybeer.sbs"
    })],
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
                    // profile_complete flag lets App.tsx know to show the onboarding page
                    is_creator: false,
                    kyc_verified: false,
                    kyc_status: "unverified",
                    has_purchased_sign_up_pack: false,
                    panic_mode_opt_in: false,
                    panic_mode_price: 0,
                    coins: 0, // coins credited AFTER CompleteProfile is submitted
                    is_suspended: false,
                    reliability_score: 70,
                });
            }
        }
    }
});
