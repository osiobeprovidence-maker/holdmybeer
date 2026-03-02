import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listPartners = query({
  args: { placement: v.optional(v.string()) },
  handler: async (ctx, args) => {
    try {
      let q = ctx.db.query("partners");
      // Only active partners
      q = q.filter((qq: any) => qq.eq(qq.field("is_active"), true));
      // If placement provided, filter by placement_type
      if (args.placement) {
        q = q.filter((qq: any) => qq.eq(qq.field("placement_type"), args.placement));
      }
      const partners = await q.collect();
      return partners || [];
    } catch (error) {
      console.error("Partners query failed:", error);
      return [];
    }
  },
});

export const trackReferral = mutation({
  args: {
    partnerSlug: v.string(),
    action: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    try {
      // Minimal tracking: record to logs. Could insert into a referrals table later.
      console.log("Referral tracked:", args);
      return { success: true };
    } catch (error) {
      console.error("trackReferral failed:", error);
      return { success: false };
    }
  },
});

export const adminListPartners = query({
  args: {},
  handler: async (ctx) => {
    try {
      console.log("adminListPartners called");
      const partners = await ctx.db.query("partners").collect();
      console.log("adminListPartners returning count:", (partners && partners.length) || 0);
      return partners || [];
    } catch (error) {
      console.error("adminListPartners failed:", error);
      return [];
    }
  },
});

export const createPartner = mutation({
  args: {
    name: v.string(),
    logo_url: v.optional(v.string()),
    website_url: v.string(),
    referral_link: v.optional(v.string()),
    placement_type: v.optional(v.string()),
    priority_level: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
    start_date: v.optional(v.number()),
    end_date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      console.log("createPartner called with:", args);
      const docData: any = {
        name: String(args.name),
        logo_url: args.logo_url ?? null,
        website_url: String(args.website_url),
        referral_link: args.referral_link ?? null,
        placement_type: args.placement_type ?? null,
        priority_level: typeof args.priority_level === 'number' ? args.priority_level : (args.priority_level ? Number(args.priority_level) : 0),
        is_active: args.is_active === undefined ? true : Boolean(args.is_active),
        start_date: typeof args.start_date === 'number' ? args.start_date : (args.start_date ? Number(args.start_date) : null),
        end_date: typeof args.end_date === 'number' ? args.end_date : (args.end_date ? Number(args.end_date) : null),
      };
      const doc = await ctx.db.insert("partners", docData as any);
      console.log("createPartner inserted:", doc);
      return { success: true, id: doc._id, doc };
    } catch (error) {
      console.error("createPartner failed:", error);
      return { success: false, error: String(error) };
    }
  },
});

export const updatePartner = mutation({
  args: {
    id: v.string(),
    patch: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("updatePartner called for id:", args.id, "patch:", args.patch);
      const patch: any = { ...args.patch };
      if (patch.is_active !== undefined) patch.is_active = Boolean(patch.is_active);
      await ctx.db.patch(args.id, patch as any);
      console.log("updatePartner success for id:", args.id);
      return { success: true };
    } catch (error) {
      console.error("updatePartner failed:", error);
      return { success: false, error: String(error) };
    }
  },
});

export const deletePartner = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      console.log("deletePartner called for id:", args.id);
      await ctx.db.delete(args.id);
      console.log("deletePartner success for id:", args.id);
      return { success: true };
    } catch (error) {
      console.error("deletePartner failed:", error);
      return { success: false, error: String(error) };
    }
  },
});
