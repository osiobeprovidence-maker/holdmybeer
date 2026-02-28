import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
    }).index("by_email", ["email"]),

    sessions: defineTable({
        userId: v.id("users"),
    }).index("by_userId", ["userId"]),

    otps: defineTable({
        email: v.string(),
        code: v.string(),
        expiresAt: v.number(),
    }).index("by_email", ["email"]),

    profiles: defineTable({
        userId: v.string(), // Links to the authenticated user ID
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        full_name: v.optional(v.string()),
        business_name: v.optional(v.string()),
        category: v.optional(v.string()),
        bio: v.optional(v.string()),
        phone: v.optional(v.string()),
        has_purchased_sign_up_pack: v.boolean(),
        panic_mode_opt_in: v.boolean(),
        panic_mode_price: v.number(),
        coins: v.number(),
        kyc_status: v.string(),
        kyc_verified: v.boolean(),
        is_creator: v.boolean(),
        is_suspended: v.boolean(),
        reliability_score: v.optional(v.number()),
        avatar: v.optional(v.string()),
        portfolio: v.optional(v.array(v.string())),
        infrastructural_rank: v.optional(v.number()),
        available_today: v.optional(v.boolean()),
        total_unlocks: v.optional(v.number()),
        rating_avg: v.optional(v.number()),
        trial_start_date: v.optional(v.number()),
        completed_jobs: v.optional(v.number()),
        avg_delivery_time: v.optional(v.string()),
        top_skills: v.optional(v.array(v.string())),
        social_links: v.optional(v.any()), // Can represent nested object
        is_paid: v.optional(v.boolean()),
        is_pre_launch: v.optional(v.boolean()),
        preferred_location: v.optional(v.string()),
        availability_status: v.optional(v.string()),
        blocked_dates: v.optional(v.array(v.string())),
        last_availability_update: v.optional(v.number()),
    }).index("by_userId", ["userId"]),

    wallets: defineTable({
        userId: v.string(),
        balance: v.number(),
    }).index("by_userId", ["userId"]),

    transactions: defineTable({
        userId: v.string(),
        amount: v.number(),
        type: v.union(v.literal("credit"), v.literal("debit")),
        description: v.string(),
        reference: v.optional(v.string()),
    }).index("by_userId", ["userId"]),

    unlocks: defineTable({
        organiserId: v.string(),
        vendorProfileId: v.id("profiles"), // Links to the vendor's profile document
        tier: v.union(v.literal("standard"), v.literal("urgent")),
        amount: v.number(),
        status: v.string(),
        paymentReference: v.optional(v.string()),
    }).index("by_organiser", ["organiserId"])
        .index("by_vendor", ["vendorProfileId"]),
});
