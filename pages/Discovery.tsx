
import React, { useState, useMemo } from 'react';
import { User, Category } from '../types';
import VendorCard from '../components/VendorCard';

interface DiscoveryProps {
  users: User[];
  onSelect: (user: User) => void;
  unlockedIds: string[];
}

const Discovery: React.FC<DiscoveryProps> = ({ users, onSelect, unlockedIds }) => {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [isUrgent, setIsUrgent] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const experts = useMemo(() => users.filter(u => u.isCreator), [users]);

  const filtered = useMemo(() => {
    return experts.filter(u => {
      const matchesCategory = categoryFilter === 'All' || u.category === categoryFilter;
      const matchesSearch = searchTerm === '' ||
        (u.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const price = u.priceRange ? u.priceRange[0] : 0;
      const matchesPrice = price >= minPrice && price <= maxPrice;
      // Fix: Using availableToday as availableNow does not exist on the User interface
      const matchesUrgency = !isUrgent || u.availableToday;

      return matchesCategory && matchesSearch && matchesPrice && matchesUrgency;
    });
  }, [experts, categoryFilter, searchTerm, minPrice, maxPrice, isUrgent]);

  const categories = Object.values(Category);

  return (
    <div className="py-12 animate-in fade-in duration-700">
      <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 px-4 md:px-0">
        <div>
          <h1 className="text-5xl md:text-8xl font-extrabold mb-3 md:mb-4 tracking-tighter text-black uppercase leading-none">Discovered</h1>
          <p className="text-[#86868b] font-bold uppercase text-[10px] md:text-[11px] tracking-[0.4em] opacity-50">Verified professionals ready to execute.</p>
        </div>

        <button
          onClick={() => setIsUrgent(!isUrgent)}
          className={`w-full md:w-auto px-8 md:px-10 py-3.5 md:py-4 text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] transition-all border-2 rounded-full ${isUrgent
            ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-lg shadow-red-200'
            : 'bg-[#f5f5f7] border-transparent text-[#86868b] hover:text-black hover:bg-[#ebebe7]'
            }`}
        >
          {isUrgent ? 'Active Emergency' : 'Show Available Now'}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-black/5 apple-shadow-lg mb-16 md:mb-24 mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              placeholder="Search experts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f5f7] border-none rounded-[20px] md:rounded-[28px] px-6 md:px-8 py-4 md:py-5 text-black outline-none focus:bg-[#ebebe7] transition-all font-bold text-base md:text-lg"
            />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 btn-apple px-6 md:px-8 py-2 md:py-3 text-[10px] md:text-[11px] uppercase tracking-widest">Find</button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto px-10 py-4 md:py-5 bg-white border border-black/10 rounded-[20px] md:rounded-[28px] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
          >
            {showFilters ? 'Hide Filters' : 'Filter Options'}
          </button>
        </div>

        {showFilters && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-16 animate-in slide-in-from-top-6 duration-500">
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

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] mb-6">Expert Categories</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCategoryFilter('All')}
                  className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-full border transition-all ${categoryFilter === 'All' ? 'bg-black text-white border-black' : 'bg-transparent text-[#86868b] border-black/5 hover:border-black/20 hover:text-black'}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-full border transition-all ${categoryFilter === cat ? 'bg-black text-white border-black' : 'bg-transparent text-[#86868b] border-black/5 hover:border-black/20 hover:text-black'}`}
                  >
                    {cat}
                  </button>
                ))}
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-12 px-4 md:px-0">
                  <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter text-black">{cat} Experts</h2>
                  <button
                    onClick={() => {
                      setCategoryFilter(cat);
                      setShowFilters(true);
                    }}
                    className="text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
                  >
                    View All {cat}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-4 md:px-0">
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
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl font-extrabold uppercase tracking-tighter">
                {filtered.length} Expert{filtered.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 px-4 md:px-0">
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
              <div className="bg-[#f5f5f7] py-20 md:py-40 rounded-[32px] md:rounded-[60px] text-center px-6 md:px-12 opacity-50 mx-4 md:mx-0">
                <p className="text-[#86868b] font-black uppercase tracking-[0.4em] text-[11px] md:text-[13px]">No matching experts detected in this search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
