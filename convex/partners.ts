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
