
import React, { useState, useMemo } from 'react';
import { User, Category, Location } from '../types';
import VendorCard from '../components/VendorCard';

interface DiscoveryProps {
  users: User[];
  onSelect: (user: User) => void;
  unlockedIds: string[];
}

const Discovery: React.FC<DiscoveryProps> = ({ users, onSelect, unlockedIds }) => {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<Location | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [isUrgent, setIsUrgent] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const experts = useMemo(() => users.filter(u => u.isCreator), [users]);

  const filtered = useMemo(() => {
    return experts.filter(u => {
      const matchesCategory = categoryFilter === 'All' || u.category === categoryFilter;
      const matchesLocation = locationFilter === 'All' || u.location === locationFilter;
      const matchesSearch = searchTerm === '' ||
        (u.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const price = u.priceRange ? u.priceRange[0] : 0;
      const matchesPrice = price >= minPrice && price <= maxPrice;
      // Fix: Using availableToday as availableNow does not exist on the User interface
      const matchesUrgency = !isUrgent || u.availableToday;

      return matchesCategory && matchesLocation && matchesSearch && matchesPrice && matchesUrgency;
    });
  }, [experts, categoryFilter, locationFilter, searchTerm, minPrice, maxPrice, isUrgent]);

  const categories = Object.values(Category);

  return (
    <div className="pb-12 animate-in fade-in duration-700">
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="w-full">
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold mb-4 tracking-tighter text-black uppercase break-words max-w-full">Discovered</h1>
          <p className="text-[#86868b] font-bold uppercase text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.4em] opacity-50 break-words max-w-full">Verified professionals ready to execute.</p>
        </div>

        <button
          onClick={() => setIsUrgent(!isUrgent)}
          className={`w-full md:w-auto px-6 md:px-10 py-4 text-[11px] md:text-[12px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all border-2 rounded-full break-words whitespace-normal ${isUrgent
              ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-lg shadow-red-200'
              : 'bg-[#f5f5f7] border-transparent text-[#86868b] hover:text-black hover:bg-[#ebebe7]'
            }`}
        >
          {isUrgent ? 'Active Emergency' : 'Show Available Now'}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-black/5 apple-shadow-lg mb-24">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              placeholder="Search experts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f5f7] border-none rounded-[24px] md:rounded-[28px] px-6 md:px-8 py-4 md:py-5 text-black outline-none focus:bg-[#ebebe7] transition-all font-bold text-base md:text-lg"
            />
            <button className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 btn-apple px-6 md:px-8 py-2 md:py-3 text-[10px] md:text-[11px] uppercase tracking-widest hover:scale-105">Find</button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto px-6 md:px-10 py-4 md:py-5 bg-white border border-black/10 rounded-[24px] md:rounded-[28px] text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-black hover:text-white transition-all break-words"
          >
            {showFilters ? 'Hide Filters' : 'Filter Options'}
          </button>
        </div>

        {showFilters && (
          <div className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 animate-in slide-in-from-top-6 duration-500">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] mb-6">Starting Price</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full bg-[#f5f5f7] border-none rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none"
                />
                <span className="text-[#86868b] font-bold text-[11px] uppercase">To</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full bg-[#f5f5f7] border-none rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] mb-6">Expert Categories</label>
              <div className="relative max-w-xs">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
                  className="w-full bg-[#f5f5f7] text-black font-bold text-[14px] px-6 py-4 rounded-3xl outline-none appearance-none cursor-pointer hover:bg-[#ebebe7] transition-all border border-black/5 focus:ring-2 focus:ring-black/5"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#86868b]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] mb-6">Lagos Areas</label>
              <div className="relative max-w-xs">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value as Location | 'All')}
                  className="w-full bg-[#f5f5f7] text-black font-bold text-[14px] px-6 py-4 rounded-3xl outline-none appearance-none cursor-pointer hover:bg-[#ebebe7] transition-all border border-black/5 focus:ring-2 focus:ring-black/5"
                >
                  <option value="All">All Lagos Areas</option>
                  {Object.values(Location).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#86868b]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-32">
        {categoryFilter === 'All' && searchTerm === '' && !showFilters ? (
          categories.map(cat => {
            const catUsers = filtered.filter(u => u.category === cat).slice(0, 4);
            if (catUsers.length === 0) return null;
            return (
              <section key={cat} className="animate-in fade-in duration-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4 w-full">
                  <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter text-black break-words max-w-full">{cat} Experts</h2>
                  <button
                    onClick={() => {
                      setCategoryFilter(cat);
                      setShowFilters(true);
                    }}
                    className="text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] border-b-2 border-black pb-1 hover:opacity-50 transition-opacity text-left"
                  >
                    View All {cat}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {catUsers.map(u => (
                    <VendorCard
                      key={u.id}
                      vendor={u}
                      onSelect={onSelect}
                      isUnlocked={unlockedIds.includes(u.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 gap-4 w-full">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter break-words max-w-full">
                {filtered.length} Expert{filtered.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                {filtered.map(u => (
                  <VendorCard
                    key={u.id}
                    vendor={u}
                    onSelect={onSelect}
                    isUnlocked={unlockedIds.includes(u.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#f5f5f7] py-40 rounded-[60px] text-center px-12 opacity-50">
                <p className="text-[#86868b] font-black uppercase tracking-[0.4em] text-[13px]">No matching experts detected in this search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
