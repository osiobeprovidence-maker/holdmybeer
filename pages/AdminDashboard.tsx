
import React, { useState, useMemo } from 'react';
import { User, ServiceRequest } from '../types';

interface AdminDashboardProps {
  users: User[];
  serviceRequests: ServiceRequest[];
  onExit: () => void;
  onUpdateUser: (user: User) => void;
}

type AdminTab = 'overview' | 'users' | 'transactions' | 'panic';

const StatCard = ({ label, value, sub, dark }: { label: string; value: string | number; sub?: string; dark?: boolean }) => (
  <div className={`p-6 md:p-8 rounded-[32px] ${dark ? 'bg-black text-white' : 'bg-[#f5f5f7]'}`}>
    <p className={`text-[9px] font-black uppercase tracking-widest mb-3 ${dark ? 'text-white/40' : 'text-[#86868b]'}`}>{label}</p>
    <p className={`text-3xl md:text-4xl font-black tracking-tighter ${dark ? 'text-white' : 'text-black'}`}>{value}</p>
    {sub && <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${dark ? 'text-white/30' : 'text-[#86868b]'}`}>{sub}</p>}
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, serviceRequests, onExit, onUpdateUser }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [nodeSearch, setNodeSearch] = useState('');
  const [coinAdjust, setCoinAdjust] = useState<Record<string, number>>({});
  const [filterType, setFilterType] = useState<'all' | 'vendors' | 'clients' | 'suspended' | 'unverified'>('all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'RiderEzzy') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Access Key');
    }
  };

  const handleManualVerify = (user: User) => {
    setActionLoading(`verify-${user.id}`);
    setTimeout(() => {
      onUpdateUser({ ...user, kycVerified: true, kycStatus: 'verified', isVerified: true, reliabilityScore: Math.max(user.reliabilityScore || 0, 85) });
      setActionLoading(null);
    }, 800);
  };

  const handleToggleSuspension = (user: User) => {
    setActionLoading(`suspend-${user.id}`);
    setTimeout(() => {
      onUpdateUser({ ...user, isSuspended: !user.isSuspended });
      setActionLoading(null);
    }, 600);
  };

  const handleAdjustCoins = (user: User, delta: number) => {
    setActionLoading(`coins-${user.id}`);
    setTimeout(() => {
      onUpdateUser({ ...user, coins: Math.max(0, (user.coins || 0) + delta) });
      setActionLoading(null);
    }, 400);
  };

  const handleTogglePanic = (user: User) => {
    setActionLoading(`panic-${user.id}`);
    setTimeout(() => {
      onUpdateUser({ ...user, panicModeOptIn: !user.panicModeOptIn });
      setActionLoading(null);
    }, 400);
  };

  // ── Stats ──────────────────────────────────────────
  const totalRevenue = serviceRequests.reduce((a, r) => a + r.amount, 0);
  const subscriptionRevenue = users.filter(u => u.isCreator && u.isPaid).reduce((a, u) => a + (u.isPreLaunch ? 7000 : 10000), 0);
  const totalExperts = users.filter(u => u.isCreator).length;
  const totalClients = users.filter(u => !u.isCreator).length;
  const verifiedExperts = users.filter(u => u.isCreator && u.kycVerified).length;
  const suspendedUsers = users.filter(u => u.isSuspended).length;
  const panicVendors = users.filter(u => u.isCreator && u.panicModeOptIn);
  const preLaunchVendors = users.filter(u => u.isCreator && u.isPreLaunch).length;
  const totalCoinsInCirculation = users.reduce((a, u) => a + (u.coins || 0), 0);
  const vendorsWithPackages = users.filter(u => u.isCreator && u.packages && u.packages.length > 0).length;
  const urgentRequests = serviceRequests.filter(r => r.paymentType === 'urgent').length;

  // ── Filtered nodes ─────────────────────────────────
  const filteredNodes = useMemo(() => {
    let list = users.filter(u => {
      if (filterType === 'vendors') return u.isCreator;
      if (filterType === 'clients') return !u.isCreator;
      if (filterType === 'suspended') return u.isSuspended;
      if (filterType === 'unverified') return u.isCreator && !u.kycVerified;
      return true;
    });
    if (nodeSearch) {
      const q = nodeSearch.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        (u.businessName?.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, nodeSearch, filterType]);

  // ── Login gate ─────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="w-full max-w-md bg-white border border-black/5 rounded-[60px] p-8 md:p-16 apple-shadow-lg text-center">
          <div className="w-20 h-20 bg-black flex items-center justify-center rounded-[28px] mx-auto mb-10">
            <span className="text-4xl">🐺</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Admin Protocol</h1>
          <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em] mb-12">Authorized Infrastructure Access Only</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Protocol Key"
              className="w-full bg-[#f5f5f7] border-none rounded-[32px] p-6 text-center text-lg font-black outline-none tracking-[0.2em] focus:ring-4 focus:ring-black/5 transition-all"
            />
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}
            <button type="submit" className="w-full btn-apple py-6 text-[14px] uppercase tracking-[0.3em] shadow-xl">Authenticate</button>
          </form>
          <button onClick={onExit} className="mt-12 text-[#86868b] text-[10px] font-bold uppercase tracking-widest hover:text-black transition-colors">Return to Surface</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-in fade-in duration-700 w-full max-w-7xl mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-black/5 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em]">Protocol Active · Secure Layer</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase leading-none">Control</h1>
          <p className="text-[#86868b] font-bold uppercase text-[10px] tracking-widest opacity-50 mt-1">HoldMyBeer · Global Oversight Panel</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => setIsAuthenticated(false)} className="flex-1 md:flex-none px-6 py-3 bg-[#f5f5f7] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Lock</button>
          <button onClick={onExit} className="flex-1 md:flex-none px-6 py-3 border border-black/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#f5f5f7] transition-all">Exit</button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-8 mb-12 border-b border-black/5 overflow-x-auto scrollbar-hide">
        {([
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: `Users (${users.length})` },
          { id: 'transactions', label: `Transactions (${serviceRequests.length})` },
          { id: 'panic', label: `🚨 Panic Monitor (${panicVendors.length})` },
        ] as { id: AdminTab; label: string }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap relative transition-all ${activeTab === t.id ? 'text-black' : 'text-[#86868b] hover:text-black'}`}
          >
            {t.label}
            {activeTab === t.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={users.length} sub={`${totalExperts} vendors · ${totalClients} clients`} />
            <StatCard label="Turnover (NGN)" value={`₦${(totalRevenue + subscriptionRevenue).toLocaleString()}`} sub={`Subs ₦${subscriptionRevenue.toLocaleString()} · Unlocks ₦${totalRevenue.toLocaleString()}`} dark />
            <StatCard label="Contact Unlocks" value={serviceRequests.length} sub={`${urgentRequests} panic unlocks`} />
            <StatCard label="Verified Vendors" value={`${verifiedExperts}/${totalExperts}`} sub={`${Math.round((verifiedExperts / Math.max(totalExperts, 1)) * 100)}% verified`} />
            <StatCard label="Coins in Circulation" value={totalCoinsInCirculation} sub="Across all wallets" />
            <StatCard label="Panic-Ready Vendors" value={panicVendors.length} sub="Opt-in for emergency calls" />
            <StatCard label="Vendors w/ Packages" value={vendorsWithPackages} sub="Structured pricing active" />
            <StatCard label="Pre-Launch Slots" value={`${preLaunchVendors}/200`} sub={`${200 - preLaunchVendors} slots remaining`} />
          </div>

          {/* Progress bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f5f5f7] rounded-[28px] p-6 md:p-8">
              <div className="flex justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">KYC Verification Rate</p>
                <p className="text-[10px] font-black">{Math.round((verifiedExperts / Math.max(totalExperts, 1)) * 100)}%</p>
              </div>
              <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full transition-all duration-1000" style={{ width: `${(verifiedExperts / Math.max(totalExperts, 1)) * 100}%` }} />
              </div>
            </div>
            <div className="bg-[#f5f5f7] rounded-[28px] p-6 md:p-8">
              <div className="flex justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">Pre-Launch Capacity</p>
                <p className="text-[10px] font-black">{preLaunchVendors}/200</p>
              </div>
              <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full transition-all duration-1000" style={{ width: `${(preLaunchVendors / 200) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Suspended Alert */}
          {suspendedUsers > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-[24px] p-6 flex items-center gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-black text-red-600 uppercase tracking-widest text-[11px]">{suspendedUsers} Suspended Account{suspendedUsers > 1 ? 's' : ''}</p>
                <p className="text-[10px] text-red-400 font-bold mt-0.5">These accounts cannot access the platform. Review in Users tab.</p>
              </div>
              <button onClick={() => { setActiveTab('users'); setFilterType('suspended'); }} className="ml-auto px-4 py-2 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">Review</button>
            </div>
          )}
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div className="animate-in fade-in duration-500">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={nodeSearch}
              onChange={(e) => setNodeSearch(e.target.value)}
              className="flex-1 bg-[#f5f5f7] border-none rounded-2xl px-5 py-3 text-[11px] font-bold uppercase tracking-widest outline-none"
            />
            <div className="flex gap-2 flex-wrap">
              {(['all', 'vendors', 'clients', 'suspended', 'unverified'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filterType === f ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#86868b] hover:text-black'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-6">{filteredNodes.length} nodes found</p>

          <div className="space-y-4">
            {filteredNodes.length > 0 ? filteredNodes.map(u => {
              const isGuest = u.id.startsWith('HMB-NODE-');
              const activePackages = u.packages?.filter(p => p.isActive) || [];
              const priceMin = activePackages.length > 0 ? Math.min(...activePackages.map(p => p.price)) : 0;
              const priceMax = activePackages.length > 0 ? Math.max(...activePackages.map(p => p.price)) : 0;
              return (
                <div key={u.id} className={`bg-white border border-black/5 rounded-[28px] p-5 md:p-6 transition-all ${u.isSuspended ? 'opacity-50 grayscale' : ''}`}>
                  {/* Row 1: Identity */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-[#f5f5f7] border border-black/5">
                        {isGuest
                          ? <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs font-black">#</div>
                          : <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=000&color=fff`} className="w-full h-full object-cover" />
                        }
                      </div>
                      {u.isVerified && <div className="absolute -top-1 -right-1 bg-black text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">✓</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <p className="font-black text-black uppercase tracking-tight text-sm">{u.businessName || u.name}</p>
                        {u.isSuspended && <span className="bg-red-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">Suspended</span>}
                        {u.isCreator && <span className="bg-black text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">Vendor</span>}
                        {isGuest && <span className="bg-blue-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">Guest</span>}
                        {u.isPaid && <span className="bg-green-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">Paid</span>}
                        {u.isPreLaunch && <span className="bg-orange-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">Founding 200</span>}
                        {u.panicModeOptIn && <span className="bg-red-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">🚨 Panic</span>}
                      </div>
                      <p className="text-[10px] text-[#86868b] font-bold truncate">{u.email}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-[9px] font-black uppercase text-[#86868b]">KYC: <span className={u.kycVerified ? 'text-green-600' : 'text-red-500'}>{u.kycStatus || 'unverified'}</span></span>
                        <span className="text-[9px] font-black uppercase text-[#86868b]">Coins: <span className="text-black">Ƀ{u.coins || 0}</span></span>
                        {u.isCreator && <span className="text-[9px] font-black uppercase text-[#86868b]">Reliability: <span className="text-black">{u.reliabilityScore || 0}%</span></span>}
                        {u.isCreator && activePackages.length > 0 && (
                          <span className="text-[9px] font-black uppercase text-[#86868b]">Packages: <span className="text-black">{activePackages.length} (₦{priceMin.toLocaleString()}–₦{priceMax.toLocaleString()})</span></span>
                        )}
                        {u.panicModeOptIn && u.panicModePrice && (
                          <span className="text-[9px] font-black uppercase text-red-500">Panic Rate: ₦{u.panicModePrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Actions */}
                  <div className="flex flex-wrap gap-2 border-t border-black/5 pt-4">
                    {/* KYC Verify */}
                    {u.isCreator && !u.kycVerified && !u.isSuspended && (
                      <button
                        onClick={() => handleManualVerify(u)}
                        disabled={!!actionLoading}
                        className="btn-apple px-4 py-2 text-[9px] disabled:opacity-40"
                      >
                        {actionLoading === `verify-${u.id}` ? '...' : '✓ Verify KYC'}
                      </button>
                    )}

                    {/* Suspend / Restore */}
                    {!isGuest && (
                      <button
                        onClick={() => handleToggleSuspension(u)}
                        disabled={!!actionLoading}
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-40 ${u.isSuspended ? 'bg-black text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                      >
                        {actionLoading === `suspend-${u.id}` ? '...' : u.isSuspended ? 'Restore' : 'Suspend'}
                      </button>
                    )}

                    {/* Coin Controls */}
                    <div className="flex items-center gap-1 bg-[#f5f5f7] rounded-full px-2 py-1">
                      <button
                        onClick={() => handleAdjustCoins(u, -1)}
                        disabled={!!actionLoading || (u.coins || 0) <= 0}
                        className="w-6 h-6 bg-white rounded-full font-black text-sm flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30"
                      >−</button>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 min-w-[40px] text-center">Ƀ{u.coins || 0}</span>
                      <button
                        onClick={() => handleAdjustCoins(u, 1)}
                        disabled={!!actionLoading}
                        className="w-6 h-6 bg-white rounded-full font-black text-sm flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30"
                      >+</button>
                    </div>

                    {/* Panic Toggle (vendors only) */}
                    {u.isCreator && (
                      <button
                        onClick={() => handleTogglePanic(u)}
                        disabled={!!actionLoading}
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-40 ${u.panicModeOptIn ? 'bg-red-500 text-white' : 'bg-[#f5f5f7] text-[#86868b] hover:text-black'}`}
                      >
                        {actionLoading === `panic-${u.id}` ? '...' : u.panicModeOptIn ? '🚨 Panic ON' : 'Panic OFF'}
                      </button>
                    )}

                    {/* Add 2 free coins shortcut */}
                    <button
                      onClick={() => handleAdjustCoins(u, 2)}
                      disabled={!!actionLoading}
                      className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#f5f5f7] text-[#86868b] hover:bg-black hover:text-white transition-all disabled:opacity-40"
                    >
                      +2 Coins
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center bg-[#f5f5f7] rounded-[32px]">
                <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em]">No matching nodes found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TRANSACTIONS TAB ── */}
      {activeTab === 'transactions' && (
        <div className="animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Unlocks" value={serviceRequests.length} />
            <StatCard label="Unlock Revenue" value={`₦${totalRevenue.toLocaleString()}`} dark />
            <StatCard label="Panic Unlocks" value={urgentRequests} sub={`${serviceRequests.length > 0 ? Math.round((urgentRequests / serviceRequests.length) * 100) : 0}% of total`} />
            <StatCard label="Subscription Revenue" value={`₦${subscriptionRevenue.toLocaleString()}`} />
          </div>

          <div className="space-y-4">
            {serviceRequests.length > 0 ? serviceRequests.sort((a, b) => b.timestamp - a.timestamp).map(req => {
              const creator = users.find(u => u.id === req.creatorId);
              const client = users.find(u => u.id === req.clientId);
              return (
                <div key={req.id} className="bg-white border border-black/5 p-5 md:p-6 rounded-[24px]">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${req.paymentType === 'urgent' ? 'bg-red-500 text-white' : 'bg-[#f5f5f7] text-[#86868b]'}`}>
                          {req.paymentType === 'urgent' ? '🚨 Panic Unlock' : 'Standard Unlock'}
                        </span>
                        <span className="text-[9px] text-[#86868b] font-bold">{new Date(req.timestamp).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-[8px] font-black text-[#86868b] uppercase tracking-widest mb-0.5">Vendor</p>
                          <p className="text-[11px] font-black text-black truncate">{creator?.businessName || creator?.name || 'Unknown'}</p>
                          <p className="text-[9px] text-[#86868b] truncate">{creator?.category}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-[#86868b] uppercase tracking-widest mb-0.5">Client</p>
                          <p className="text-[11px] font-black text-black truncate">{client?.name || req.clientId.slice(0, 12) + '...'}</p>
                          <p className="text-[9px] text-[#86868b] font-mono truncate">{req.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-black text-black">₦{req.amount.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-[#86868b] uppercase">{req.status}</p>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center bg-[#f5f5f7] rounded-[32px]">
                <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em]">No transactions recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PANIC MONITOR TAB ── */}
      {activeTab === 'panic' && (
        <div className="animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Panic-Ready Vendors" value={panicVendors.length} dark />
            <StatCard label="Panic Unlocks" value={urgentRequests} />
            <StatCard label="Avg Panic Rate" value={panicVendors.length > 0 ? `₦${Math.round(panicVendors.reduce((a, u) => a + (u.panicModePrice || 0), 0) / panicVendors.length).toLocaleString()}` : '—'} />
            <StatCard label="Available Today" value={panicVendors.filter(u => u.availableToday).length} sub="Currently available for panic" />
          </div>

          {panicVendors.length === 0 ? (
            <div className="py-20 text-center bg-[#f5f5f7] rounded-[32px]">
              <p className="text-4xl mb-4">🚨</p>
              <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em]">No vendors have opted into Panic Mode.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {panicVendors.map(u => (
                <div key={u.id} className="bg-white border border-black/5 rounded-[24px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=000&color=fff`} className="w-12 h-12 rounded-[14px] object-cover border border-black/5 shrink-0" />
                    <div>
                      <p className="font-black text-black uppercase tracking-tight text-sm">{u.businessName || u.name}</p>
                      <p className="text-[10px] text-[#86868b] font-bold">{u.category} · {u.location}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${u.availableToday ? 'bg-green-50 text-green-600' : 'bg-[#f5f5f7] text-[#86868b]'}`}>
                          {u.availableToday ? '● Available Now' : '○ Not Available'}
                        </span>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                          Rate: ₦{(u.panicModePrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePanic(u)}
                    disabled={!!actionLoading}
                    className="px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500 text-white hover:bg-black transition-all disabled:opacity-40 shrink-0"
                  >
                    {actionLoading === `panic-${u.id}` ? '...' : 'Disable Panic'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
