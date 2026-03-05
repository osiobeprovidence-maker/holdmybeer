import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

const SIGNUP_REWARD_AMOUNT = 2;

async function getSessionUserId(ctx: any, sessionToken?: string): Promise<Id<"users"> | null> {
    if (!sessionToken) return null;
    try {
        const session = await ctx.db
            .query("sessions")
            .withIndex("by_token", (q: any) => q.eq("sessionToken", sessionToken))
            .unique();

        if (!session) return null;
        if (Date.now() > session.expiresAt) return null;

        return session.userId;
    } catch (e) {
        return null;
    }
}

export const current = query({
    args: { sessionToken: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionToken);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user) return null;

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        return {
            ...user,
            profile: profile || null,
        };
    },
});

export const searchProfiles = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("profiles").collect();
    },
});

export const updateProfile = mutation({
    args: {
        name: v.optional(v.string()),
        bio: v.optional(v.string()),
        location: v.optional(v.string()),
        panic_mode_opt_in: v.optional(v.boolean()),
        panic_mode_price: v.optional(v.number()),
        has_purchased_sign_up_pack: v.optional(v.boolean()),
        business_name: v.optional(v.string()),
        category: v.optional(v.string()),
        is_creator: v.optional(v.boolean()),
        availability_status: v.optional(v.string()),
        phone: v.optional(v.string()),
        avatar: v.optional(v.string()),
        avatarStorageId: v.optional(v.string()),
        portfolio: v.optional(v.array(v.string())),
        preferred_location: v.optional(v.string()),
        available_today: v.optional(v.boolean()),
        top_skills: v.optional(v.array(v.string())),
        social_links: v.optional(v.any()),
        sessionToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionToken);
        if (!userId) throw new Error("Not authenticated");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        const { sessionToken, avatarStorageId, ...patchArgs } = args;

        if (avatarStorageId) {
            const url = await ctx.storage.getUrl(avatarStorageId);
            if (url) (patchArgs as any).avatar = url;
        }

        if (!profile) {
            // Upsert: Create profile if missing
            await ctx.db.insert("profiles", {
                userId: userId,
                email: "", // Will be filled if needed or fetched from user
                has_purchased_sign_up_pack: false,
                panic_mode_opt_in: false,
                panic_mode_price: 0,
                coins: 0,
                kyc_status: "unverified",
                kyc_verified: false,
                is_creator: patchArgs.is_creator || false,
                is_suspended: false,
                ...patchArgs,
            } as any);
        } else {
            await ctx.db.patch(profile._id, patchArgs);
        }
    },
});

export const adminUpdateProfile = mutation({
    args: {
        userId: v.string(), // target user ID
        kyc_verified: v.optional(v.boolean()),
        kyc_status: v.optional(v.string()),
        is_suspended: v.optional(v.boolean()),
        coins: v.optional(v.number()),
        reliability_score: v.optional(v.number()),
        panic_mode_opt_in: v.optional(v.boolean()),
        panic_mode_price: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        const { userId, ...patchArgs } = args;
        await ctx.db.patch(profile._id, patchArgs);

        // Also update the user record if coins are changed
        if (args.coins !== undefined) {
            const user = await ctx.db.get(args.userId as Id<"users">);
            if (user) {
                await ctx.db.patch(user._id, { coins: args.coins });
            }
        }
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const getStorageUrl = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const getUnlocks = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("unlocks").collect();
    },
});

// --- User Testing System Server Functions ---
export const createTestSession = mutation({
    args: { sessionToken: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionToken);
        const doc = await ctx.db.insert("test_sessions", {
            userId: userId || null,
            startedAt: Date.now(),
        } as any);
        return doc._id;
    },
});

export const getTasks = query({
    args: {},
    handler: async (ctx) => {
        const tasks = await ctx.db.query("tasks").collect();
        // sort by order on server to keep client simple
        tasks.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        return tasks;
    },
});

export const submitTaskFeedback = mutation({
    args: {
        sessionId: v.id("test_sessions"),
        taskId: v.id("tasks"),
        difficultyRating: v.number(),
        confusionText: v.optional(v.string()),
        improvementText: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("task_feedback", {
            sessionId: args.sessionId,
            taskId: args.taskId,
            difficultyRating: args.difficultyRating,
            confusionText: args.confusionText || null,
            improvementText: args.improvementText || null,
        } as any);
        return { success: true };
    },
});

export const submitFinalFeedback = mutation({
    args: {
        sessionId: v.id("test_sessions"),
        overallRating: v.number(),
        confusingPart: v.optional(v.string()),
        featureImprovement: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("final_feedback", {
            sessionId: args.sessionId,
            overallRating: args.overallRating,
            confusingPart: args.confusingPart || null,
            featureImprovement: args.featureImprovement || null,
        } as any);

        // mark session completed
        const session = await ctx.db.get(args.sessionId as any);
        if (session) {
            await ctx.db.patch(session._id, { completedAt: Date.now() });
        }

        return { success: true };
    },
});

export const adminGetTestResponses = query({
    args: {},
    handler: async (ctx) => {
        const sessions = await ctx.db.query("test_sessions").collect();
        const tasks = await ctx.db.query("tasks").collect();
        const feedback = await ctx.db.query("task_feedback").collect();
        const finals = await ctx.db.query("final_feedback").collect();

        return { sessions, tasks, feedback, finals };
    },
});

export const createDefaultTasks = mutation({
    args: {},
    handler: async (ctx) => {
        const defaults = [
            { title: 'Create an account', instruction: 'Create an account on HoldMyBeer using the signup flow.', order: 1 },
            { title: 'Fund your wallet with ₦2000', instruction: 'Add ₦2000 to your wallet using any available payment option.', order: 2 },
            { title: 'Browse the platform', instruction: 'Browse the platform and find an experience you like.', order: 3 },
            { title: 'Attempt to join or book an activity', instruction: 'Try to join or book an activity you found.', order: 4 },
            { title: 'Edit your profile username', instruction: 'Go to your profile and edit your username.', order: 5 },
        ];
        for (const t of defaults) {
            await ctx.db.insert('tasks', t as any);
        }
        return { success: true };
    },
});

export const insertUnlock = mutation({
    args: {
        vendorProfileId: v.id("profiles"),
        tier: v.union(v.literal("standard"), v.literal("urgent")),
        amount: v.number(),
        status: v.string(),
        sessionToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionToken);
        if (!userId) throw new Error("Not authenticated");

        await ctx.db.insert("unlocks", {
            organiserId: userId,
            vendorProfileId: args.vendorProfileId,
            tier: args.tier,
            amount: args.amount,
            status: args.status,
        });
    },
});

export const creditCoins = mutation({
    args: {
        amount: v.number(),
        description: v.string(),
        sessionToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionToken);
        if (!userId) throw new Error("Not authenticated");

        const user = await ctx.db.get(userId) as Doc<"users">;
        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            coins: (user.coins || 0) + args.amount,
        });

        // Sync with profile as well if it exists
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();
        if (profile) {
            await ctx.db.patch(profile._id, { coins: (profile.coins || 0) + args.amount });
        }

        await ctx.db.insert("transactions", {
            userId,
            amount: args.amount,
            type: "credit",
            description: args.description,
        });
    },
});

export const deductCoins = mutation({
    args: {
        amount: v.number(),
        description: v.string(),
        sessionToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionToken);
        if (!userId) throw new Error("Not authenticated");

        const user = await ctx.db.get(userId) as Doc<"users">;
        if (!user) throw new Error("User not found");

        if ((user.coins || 0) < args.amount) {
            throw new Error("Insufficient coins");
        }

        await ctx.db.patch(user._id, {
            coins: (user.coins || 0) - args.amount,
        });

        // Sync with profile
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();
        if (profile) {
            await ctx.db.patch(profile._id, { coins: (profile.coins || 0) - args.amount });
        }

        await ctx.db.insert("transactions", {
            userId,
            amount: args.amount,
            type: "debit",
            description: args.description,
        });
    },
});

/**
 * MVP Simple Onboarding Reward Mutation
 * Accepts: sessionToken, fullName, phone
 */
export const completeProfile = mutation({
    args: {
        fullName: v.string(),
        phone: v.string(),
        sessionToken: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Validation
        if (args.fullName.trim().length < 2) {
            console.error({ event: "profile_completion_failed", reason: "invalid_fullname", fullName: args.fullName });
            throw new Error("Full name must be at least 2 characters.");
        }
        if (!/^\+?[\d\s-]{10,}$/.test(args.phone)) {
            console.error({ event: "profile_completion_failed", reason: "invalid_phone", phone: args.phone });
            throw new Error("Please enter a valid phone number (at least 10 digits).");
        }

        // 2. Query session by sessionToken
        const session = await ctx.db
            .query("sessions")
            .withIndex("by_token", (q) => q.eq("sessionToken", args.sessionToken))
            .unique();

        if (!session || Date.now() > session.expiresAt) {
            console.error({ event: "profile_completion_failed", reason: "invalid_session", sessionToken: args.sessionToken });
            throw new Error("Not authenticated");
        }

        // 3. Get user using session.userId
        const user = await ctx.db.get(session.userId) as Doc<"users">;
        if (!user) {
            throw new Error("User not found");
        }

        // 4. If user.profileCompleted is true → return early (prevent duplicate reward)
        if (user.profileCompleted) {
            return { success: true, alreadyCompleted: true };
        }

        // 5. Patch user: fullName, phone, profileCompleted = true, coins = user.coins + SIGNUP_REWARD_AMOUNT
        const newCoins = (user.coins || 0) + SIGNUP_REWARD_AMOUNT;

        await ctx.db.patch(user._id, {
            fullName: args.fullName,
            phone: args.phone,
            profileCompleted: true,
            coins: newCoins,
        });

        // Sync with profile record for vendors/creators compatibility
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", (session.userId as unknown as string)))
            .unique();

        if (profile) {
            await ctx.db.patch(profile._id, {
                full_name: args.fullName,
                name: args.fullName,
                phone: args.phone,
                coins: newCoins,
            });
        }

        // 6. Log transaction
        await ctx.db.insert("transactions", {
            userId: (session.userId as unknown as string),
            amount: SIGNUP_REWARD_AMOUNT,
            type: "credit",
            description: "Signup Reward – 2 Coins",
        });

        console.log({
            event: "profile_completion_success",
            userId: session.userId,
            fullName: args.fullName,
            reward: SIGNUP_REWARD_AMOUNT
        });

        return { success: true };
    },
});

export const getProfileStatus = query({
    args: { sessionToken: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionToken);
        if (!userId) return null;

        const user = await ctx.db.get(userId) as Doc<"users">;
        if (!user) return null;

        return {
            isComplete: user.profileCompleted,
            user,
        };
    },
});

export const wipeEverything = mutation({
    args: { secret: v.string() },
    handler: async (ctx, args) => {
        if (args.secret !== "CLEAN_SLATE_2026") throw new Error("Unauthorized");

        const tables = ["users", "sessions", "profiles", "wallets", "transactions", "unlocks", "otps"] as const;
        for (const table of tables) {
            const docs = await ctx.db.query(table).collect();
            for (const doc of docs) {
                await ctx.db.delete(doc._id);
            }
        }
        return { success: true };
    },
});
