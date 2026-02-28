import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Resend({
        apiKey: process.env.AUTH_RESEND_KEY,
        from: "login@holdmybeer.com" // Update this to your verified Resend domain if going to real production later
    })],
});
