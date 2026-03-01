import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("OTP verification and profile completion flow", async () => {
    const t = convexTest(schema);
    const email = "test@holdmybeer.sbs";

    // 1. Send OTP (Simulated in test environment)
    // In actual tests we can't easily run the action unless we mock Resend.
    // So we'll directly insert an OTP to bypass email sending.
    await t.run(async (ctx) => {
        await ctx.db.insert("otps", {
            email,
            code: "123456",
            expiresAt: Date.now() + 60000,
        });
    });

    // 2. Verify OTP
    const result = await t.mutation(api.auth.verifyOTP, { email, code: "123456" });
    expect(result.sessionToken).toBeDefined();
    expect(result.isNewUser).toBe(true);

    // 3. Complete Profile (Initial coins: 0)
    const completeRes = await t.mutation(api.api.completeProfile, {
        fullName: "Test User",
        phone: "+2348000000000",
        sessionToken: result.sessionToken,
    });
    expect(completeRes.success).toBe(true);

    // 4. Verify user is complete, reward is credited
    const status = await t.query(api.api.getProfileStatus, { sessionToken: result.sessionToken });
    expect(status.isComplete).toBe(true);
    expect(status.user.coins).toBe(2);

    // 5. Verify duplicate completion doesn't re-reward
    const secondRes = await t.mutation(api.api.completeProfile, {
        fullName: "Test User",
        phone: "+2348000000000",
        sessionToken: result.sessionToken,
    });
    expect(secondRes.alreadyCompleted).toBe(true);

    const finalStatus = await t.query(api.api.getProfileStatus, { sessionToken: result.sessionToken });
    expect(finalStatus.user.coins).toBe(2); // Still 2
});
