import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface PartnershipBannerProps {
  placement: string;
}

export const PartnershipBanner: React.FC<PartnershipBannerProps> = ({ placement }) => {
  const partners = useQuery(api.partners.listPartners, { placement }) ?? [];
  const trackReferral = useMutation(api.partners.trackReferral);

  if (!partners || partners.length === 0) return null;

  const handlePartnerClick = async (partner: any) => {
    try {
      await trackReferral({
        partnerSlug: partner._id || partner.name,
        action: "click",
        metadata: { placement }
      });
      window.open(partner.website_url || partner.websiteUrl || '#', '_blank');
    } catch (error) {
      console.error("Failed to track referral", error);
      window.open(partner.website_url || partner.websiteUrl || '#', '_blank');
    }
  };

  return (
    <div className="w-full bg-black/5 backdrop-blur-sm py-4 px-6 md:px-8 rounded-[32px] mb-12 overflow-hidden border border-black/[0.03]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b]">Partners & Ecosystem</h4>
          <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest bg-white/50 px-2.5 py-1 rounded-full border border-black/5">Featured</span>
        </div>

        <div className="flex gap-8 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
          {partners.map((partner: any) => (
            <button
              key={partner._id || partner.name}
              onClick={() => handlePartnerClick(partner)}
              className="flex items-center gap-4 group shrink-0 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2 overflow-hidden group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-black/5">
                <img
                  src={partner.logo_url || partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">{partner.name}</p>
                <p className="text-[10px] font-bold text-[#86868b] uppercase truncate max-w-[150px] tracking-tight">{partner.referral_link || partner.description || ''}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
