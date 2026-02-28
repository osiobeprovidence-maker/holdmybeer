import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function getSessionUserId(ctx: any, sessionId?: string) {
    if (!sessionId) return null;
    const session = await ctx.db.get(sessionId as any);
    if (!session) return null;
    return session.userId;
}

export const current = query({
    args: { sessionId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionId);
        if (!userId) {
            return null;
        }
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();
        return profile;
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
        portfolio: v.optional(v.array(v.string())),
        preferred_location: v.optional(v.string()),
        available_today: v.optional(v.boolean()),
        top_skills: v.optional(v.array(v.string())),
        social_links: v.optional(v.any()),
        sessionId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionId);
        if (!userId) throw new Error("Not authenticated");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        await ctx.db.patch(profile._id, args);
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

        const { userId, sessionId, ...patchArgs } = args as any;
        await ctx.db.patch(profile._id, patchArgs);
    },
});


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const getUnlocks = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("unlocks").collect();
    },
});

export const insertUnlock = mutation({
    args: {
        vendorProfileId: v.id("profiles"),
        tier: v.union(v.literal("standard"), v.literal("urgent")),
        amount: v.number(),
        status: v.string(),
        sessionId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionId);
        if (!userId) throw new Error("Not authenticated");

        await ctx.db.insert("unlocks", {
            ...args,
            organiserId: userId,
        });
    },
});

export const creditCoins = mutation({
    args: {
        amount: v.number(),
        description: v.string(),
        sessionId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionId);
        if (!userId) throw new Error("Not authenticated");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        await ctx.db.patch(profile._id, {
            coins: (profile.coins || 0) + args.amount,
        });

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
        sessionId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionId);
        if (!userId) throw new Error("Not authenticated");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        if ((profile.coins || 0) < args.amount) {
            throw new Error("Insufficient coins");
        }

        await ctx.db.patch(profile._id, {
            coins: (profile.coins || 0) - args.amount,
        });

        await ctx.db.insert("transactions", {
            userId,
            amount: args.amount,
            type: "debit",
            description: args.description,
        });
    },
});

// Called by CompleteProfile page after first-time user fills in name + phone
export const completeProfile = mutation({
    args: {
        full_name: v.string(),
        phone: v.string(),
        sessionId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionId);
        if (!userId) throw new Error("Not authenticated");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        // Patch profile with real name + phone
        await ctx.db.patch(profile._id, {
            full_name: args.full_name,
            phone: args.phone,
            name: args.full_name,
            coins: 2, // Signup bonus
        });

        // Create wallet if it doesn't exist
        const existingWallet = await ctx.db
            .query("wallets")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (!existingWallet) {
            await ctx.db.insert("wallets", {
                userId,
                balance: 0,
            });
        }

        // Log the 2-coin signup bonus transaction
        await ctx.db.insert("transactions", {
            userId,
            amount: 2,
            type: "credit",
            description: "Signup bonus – 2 free coins",
        });
    },
});

// Check if current user has a completed profile (name + phone filled)
export const getProfileStatus = query({
    args: { sessionId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const userId = await getSessionUserId(ctx, args.sessionId);
        if (!userId) return null;

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (!profile) return null;

        return {
            isComplete: !!(profile.full_name && profile.phone),
            profile,
        };
    },
});

