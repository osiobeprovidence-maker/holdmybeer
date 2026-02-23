
import React from 'react';
import { Category, Vendor, Location } from '../types';
import SearchAssistant from '../components/SearchAssistant';
import VendorCard from '../components/VendorCard';

interface HomeProps {
  vendors: Vendor[];
  filteredVendors: Vendor[];
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  selectedLocation: Location | 'All';
  setSelectedLocation: (loc: Location | 'All') => void;
  isUrgent: boolean;
  setIsUrgent: (val: boolean) => void;
  assistantMessage: string | null;
  setAssistantMessage: (msg: string | null) => void;
  setFilteredVendors: (vendors: Vendor[]) => void;
  onVendorSelect: (vendor: Vendor) => void;
  unlockedVendorIds: string[];
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({
  vendors,
  filteredVendors,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  isUrgent,
  setIsUrgent,
  assistantMessage,
  setAssistantMessage,
  setFilteredVendors,
  onVendorSelect,
  unlockedVendorIds,
  isLoggedIn
}) => {
  return (
    <div className="animate-in fade-in duration-1000">
      {!isLoggedIn ? (
        <>
          <section className="text-center pt-20 mb-40">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-10 tracking-tight text-black max-w-5xl mx-auto leading-[0.95]">
              Find. Connect. <span className="text-[#86868b]">Book.</span>
            </h1>
            <p className="text-black text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              The fastest way to reach verified event experts across Nigeria.
            </p>

            <SearchAssistant vendors={vendors} onMatchesFound={(msg, ids) => {
              setAssistantMessage(msg);
              if (ids.length > 0) {
                setFilteredVendors(vendors.filter(v => ids.includes(v.id)));
              }
            }} />

            <div className="mt-12 opacity-40 text-black text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em]">
              Direct messaging. Zero friction. Real results.
            </div>
          </section>

          {/* The Core Logic Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-40 max-w-6xl mx-auto">
            <div className="group">
              <p className="text-[11px] font-bold text-black/30 uppercase tracking-[0.3em] mb-4">Phase 01</p>
              <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Discovery</h3>
              <p className="text-[#86868b] font-medium leading-relaxed">
                Search our city-based pool of verified DJs, Caterers, and Photographers. Describe your emergency and find the right fit instantly.
              </p>
            </div>
            <div className="group">
              <p className="text-[11px] font-bold text-black/30 uppercase tracking-[0.3em] mb-4">Phase 02</p>
              <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Access</h3>
              <p className="text-[#86868b] font-medium leading-relaxed">
                Pay a single, direct fee to unlock verified phone and WhatsApp details. No subscriptions. No wallet mess. Just access.
              </p>
            </div>
            <div className="group">
              <p className="text-[11px] font-bold text-black/30 uppercase tracking-[0.3em] mb-4">Phase 03</p>
              <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Handover</h3>
              <p className="text-[#86868b] font-medium leading-relaxed">
                We exit. You speak directly to the professional to negotiate and book. Decisive, fast, and confident planning at your fingertips.
              </p>
            </div>
          </section>
        </>
      ) : (
        <section className="pt-8 md:pt-16 mb-24">
          <div className="flex justify-center mb-16">
            <button
              onClick={() => setIsUrgent(!isUrgent)}
              className={`px-12 py-5 rounded-full font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] transition-all border-2 ${isUrgent
                ? 'bg-red-500 border-red-500 text-white shadow-2xl animate-pulse'
                : 'bg-white text-black border-black/[0.05] hover:border-black hover:shadow-2xl'
                }`}
            >
              {isUrgent ? 'Panic Mode Active' : 'Available Now'}
            </button>
          </div>

          <div className="mb-24">
            <SearchAssistant vendors={vendors} isLoggedIn={isLoggedIn} onMatchesFound={(msg, ids) => {
              setAssistantMessage(msg);
              if (ids.length > 0) {
                setFilteredVendors(vendors.filter(v => ids.includes(v.id)));
              }
            }} />
          </div>

          <div className="bg-[#f5f5f7]/40 backdrop-blur-md rounded-[48px] p-10 md:p-16 border border-black/[0.02] mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              <div className="space-y-6">
                <label className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.4em] ml-6">Service Category</label>
                <div className="relative group">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
                    className="w-full bg-white text-black font-bold text-[16px] px-10 py-6 rounded-[32px] outline-none appearance-none cursor-pointer shadow-sm hover:shadow-xl transition-all border border-black/[0.03] focus:ring-8 focus:ring-black/[0.01]"
                  >
                    <option value="All">All Services</option>
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-black/20 group-hover:text-black transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.4em] ml-6">Lagos Area</label>
                <div className="relative group">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value as Location | 'All')}
                    className="w-full bg-white text-black font-bold text-[16px] px-10 py-6 rounded-[32px] outline-none appearance-none cursor-pointer shadow-sm hover:shadow-xl transition-all border border-black/[0.03] focus:ring-8 focus:ring-black/[0.01]"
                  >
                    <option value="All">All Lagos Areas</option>
                    {Object.values(Location).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-black/20 group-hover:text-black transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {assistantMessage && (
        <div className="bg-[#f5f5f7] rounded-[32px] md:rounded-[48px] p-8 md:p-16 mb-20 md:mb-32 flex flex-col md:flex-row items-start gap-6 md:gap-12 animate-in slide-in-from-top-6 duration-700 apple-shadow relative">
          <div className="text-4xl md:text-5xl">⚡️</div>
          <div className="flex-grow">
            <p className="text-[10px] md:text-[11px] font-bold text-[#86868b] mb-2 md:mb-3 uppercase tracking-[0.3em] md:tracking-[0.4em]">Expert Retrieval Agent</p>
            <p className="text-black text-xl md:text-3xl font-extrabold leading-tight tracking-tight">"{assistantMessage}"</p>
          </div>
          <button
            onClick={() => { setAssistantMessage(null); setFilteredVendors(vendors); }}
            className="absolute top-6 right-6 md:relative md:top-0 md:right-0 p-3 md:p-4 bg-white rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
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
