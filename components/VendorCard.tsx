
import React from 'react';
import { Vendor } from '../types';

interface VendorCardProps {
  vendor: Vendor;
  onSelect: (vendor: Vendor) => void;
  isUnlocked: boolean;
  isUrgent?: boolean;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onSelect, isUnlocked, isUrgent }) => {
  const activePackages = vendor.packages?.filter(p => p.isActive) || [];
  const computedMin = activePackages.length > 0 ? Math.min(...activePackages.map(p => p.price)) : (vendor.priceRange?.[0] || 0);
  const computedMax = activePackages.length > 0 ? Math.max(...activePackages.map(p => p.price)) : (vendor.priceRange?.[1] || 0);
  const rating = vendor.ratingAvg || 'NEW';

  return (
    <div
      className="apple-card group cursor-pointer flex flex-col relative overflow-hidden bg-white"
      onClick={() => onSelect(vendor)}
    >
      <div className="relative h-64 overflow-hidden bg-[#f5f5f7]">
        <img
          src={vendor.portfolio?.[0] || vendor.avatar}
          alt={vendor.businessName}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4">
          {vendor.isVerified && (
            <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
              Verified Pro
            </span>
          )}
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-black font-bold text-xl tracking-tight leading-tight">{vendor.businessName}</h3>
          <div className="flex items-center gap-1.5 bg-[#f5f5f7] px-2.5 py-1 rounded-full">
            <span className="text-black font-bold text-[11px]">★ {rating}</span>
          </div>
        </div>
        <p className="text-[#86868b] text-sm font-medium leading-relaxed mb-4 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
          {vendor.bio}
        </p>
        <div className="mb-6">
          <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest block mb-1">
            {isUrgent ? 'Panic Mode Rate' : 'Price Range'}
          </span>
          <span className={`font-bold text-sm ${isUrgent ? 'text-red-500' : 'text-black'}`}>
            {isUrgent
              ? `₦${(vendor.panicModePrice || computedMin).toLocaleString()}`
              : computedMin === computedMax && computedMin === 0
                ? 'Price on Request'
                : computedMin === computedMax
                  ? `₦${computedMin.toLocaleString()}`
                  : `₦${computedMin.toLocaleString()} – ₦${computedMax.toLocaleString()}`
            }
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(vendor); // Using the parent handler for calendar access
            }}
            className="text-[10px] font-black justify-center items-center py-3 px-6 bg-[#f5f5f7] rounded-full uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Check Calendar
          </button>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Location</span>
            <span className="text-black font-bold text-[14px]">{vendor.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
