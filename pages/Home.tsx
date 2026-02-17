
import React from 'react';
import { Category, Vendor } from '../types';
import SearchAssistant from '../components/SearchAssistant';
import VendorCard from '../components/VendorCard';

interface HomeProps {
  vendors: Vendor[];
  filteredVendors: Vendor[];
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  isUrgent: boolean;
  setIsUrgent: (val: boolean) => void;
  assistantMessage: string | null;
  setAssistantMessage: (msg: string | null) => void;
  setFilteredVendors: (vendors: Vendor[]) => void;
  onVendorSelect: (vendor: Vendor) => void;
  unlockedVendorIds: string[];
}

const Home: React.FC<HomeProps> = ({
  vendors,
  filteredVendors,
  selectedCategory,
  setSelectedCategory,
  isUrgent,
  setIsUrgent,
  assistantMessage,
  setAssistantMessage,
  setFilteredVendors,
  onVendorSelect,
  unlockedVendorIds
}) => {
  return (
    <div className="animate-in fade-in duration-700">
      <section className="text-center pt-8 md:pt-20 mb-16 md:mb-40 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-9xl font-extrabold mb-6 md:mb-10 tracking-tight text-black max-w-5xl mx-auto leading-[0.95]">
          Find. Unlock. <br />
          <span className="text-[#86868b]">Connect.</span>
        </h1>
        <p className="text-base md:text-2xl max-w-2xl mx-auto mb-10 md:mb-20 font-medium leading-relaxed px-2 text-black">
          The fastest way to access verified event experts in Nigeria. <br className="hidden md:block" />
          <span className="opacity-40">Direct contact. Zero middleman. Instant relief.</span>
        </p>

        <SearchAssistant vendors={vendors} onMatchesFound={(msg, ids) => {
          setAssistantMessage(msg);
          if (ids.length > 0) {
            setFilteredVendors(vendors.filter(v => ids.includes(v.id)));
          }
        }} />
      </section>

      {/* The Core Logic Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-20 md:mb-40 max-w-6xl mx-auto px-4">
        <div className="group">
          <p className="text-[10px] md:text-[11px] font-bold text-black/30 uppercase tracking-[0.3em] mb-3 md:mb-4">Phase 01</p>
          <h3 className="text-xl md:text-2xl font-extrabold mb-3 md:mb-4 tracking-tight">Discovery</h3>
          <p className="text-[#86868b] text-sm md:text-base font-medium leading-relaxed">
            Search our city-based pool of verified DJs, Caterers, and Photographers. Describe your emergency and find the right fit instantly.
          </p>
        </div>
        <div className="group">
          <p className="text-[10px] md:text-[11px] font-bold text-black/30 uppercase tracking-[0.3em] mb-3 md:mb-4">Phase 02</p>
          <h3 className="text-xl md:text-2xl font-extrabold mb-3 md:mb-4 tracking-tight">Access</h3>
          <p className="text-[#86868b] text-sm md:text-base font-medium leading-relaxed">
            Pay a single, direct fee to unlock verified phone and WhatsApp details. No subscriptions. No wallet mess. Just access.
          </p>
        </div>
        <div className="group">
          <p className="text-[10px] md:text-[11px] font-bold text-black/30 uppercase tracking-[0.3em] mb-3 md:mb-4">Phase 03</p>
          <h3 className="text-xl md:text-2xl font-extrabold mb-3 md:mb-4 tracking-tight">Handover</h3>
          <p className="text-[#86868b] text-sm md:text-base font-medium leading-relaxed">
            We exit. You speak directly to the professional to negotiate and book. Decisive, fast, and confident planning at your fingertips.
          </p>
        </div>
      </section>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 border-b border-black/5 pb-16">
        <div className="flex flex-wrap gap-3 justify-center">
          {['All', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category | 'All')}
              className={`px-6 py-3 text-[14px] font-bold rounded-full transition-all ${selectedCategory === cat
                ? 'bg-black text-white shadow-xl'
                : 'bg-[#f5f5f7] text-black hover:bg-[#ebebe7]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsUrgent(!isUrgent)}
          className={`px-8 py-3 rounded-full font-extrabold text-[14px] uppercase tracking-widest transition-all border-2 ${isUrgent
            ? 'bg-red-500 border-red-500 text-white shadow-2xl animate-pulse'
            : 'bg-white text-black border-black/10 hover:border-black'
            }`}
        >
          {isUrgent ? 'Showing Active Today' : 'Show Available Now'}
        </button>
      </div>

      {assistantMessage && (
        <div className="bg-[#f5f5f7] rounded-[32px] md:rounded-[48px] p-8 md:p-16 mb-20 md:mb-32 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 animate-in slide-in-from-top-6 duration-700 apple-shadow mx-4">
          <div className="text-4xl md:text-5xl">⚡️</div>
          <div className="flex-grow text-center md:text-left">
            <p className="text-[9px] md:text-[11px] font-bold text-[#86868b] mb-2 md:mb-3 uppercase tracking-[0.4em]">Expert Retrieval Agent</p>
            <p className="text-black text-xl md:text-3xl font-extrabold leading-tight tracking-tight">"{assistantMessage}"</p>
          </div>
          <button
            onClick={() => { setAssistantMessage(null); setFilteredVendors(vendors); }}
            className="p-3 md:p-4 bg-white rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 px-4">
        {filteredVendors.map(v => (
          <VendorCard
            key={v.id}
            vendor={v}
            onSelect={onVendorSelect}
            isUnlocked={unlockedVendorIds.includes(v.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
