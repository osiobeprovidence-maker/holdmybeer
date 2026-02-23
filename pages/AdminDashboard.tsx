
import React, { useState, useMemo } from 'react';
import { User, ServiceRequest } from '../types';

interface AdminDashboardProps {
  users: User[];
  serviceRequests: ServiceRequest[];
  onExit: () => void;
  onUpdateUser: (user: User) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, serviceRequests, onExit, onUpdateUser }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [nodeSearch, setNodeSearch] = useState('');

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
    setActionLoading(user.id);
    setTimeout(() => {
      onUpdateUser({
        ...user,
        kycVerified: true,
        kycStatus: 'verified',
        isVerified: true,
        reliabilityScore: Math.max(user.reliabilityScore || 0, 85)
      });
      setActionLoading(null);
    }, 800);
  };

  const handleToggleSuspension = (user: User) => {
    const status = user.isSuspended ? 'restoring' : 'suspending';
    setActionLoading(`${user.id}-${status}`);
    setTimeout(() => {
      onUpdateUser({
        ...user,
        isSuspended: !user.isSuspended
      });
      setActionLoading(null);
    }, 600);
  };

  const totalRevenue = serviceRequests.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExperts = users.filter(u => u.isCreator).length;
  const totalHandshakes = serviceRequests.length;
  const verifiedExperts = users.filter(u => u.isCreator && u.kycVerified).length;

  const filteredNodes = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(nodeSearch.toLowerCase()) ||
      (u.businessName && u.businessName.toLowerCase().includes(nodeSearch.toLowerCase())) ||
      u.email.toLowerCase().includes(nodeSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(nodeSearch.toLowerCase())
    );
  }, [users, nodeSearch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="w-full max-w-md bg-white border border-black/5 rounded-[60px] p-8 md:p-16 apple-shadow-lg text-center">
          <div className="w-20 h-20 bg-black flex items-center justify-center rounded-[28px] mx-auto mb-10">
            <span className="text-4xl">🐺</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Admin Protocol</h1>
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
    <div className="py-8 md:py-12 animate-in fade-in duration-700 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 border-b border-black/5 pb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-[0.4em]">Protocol Active // Secure Layer</p>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-black uppercase leading-none">Control</h1>
          <p className="text-[#86868b] font-bold uppercase text-[11px] tracking-widest opacity-50">Global Oversight & Expert Node Management</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => setIsAuthenticated(false)} className="flex-1 md:flex-none px-8 py-4 bg-[#f5f5f7] rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Lock Protocol</button>
          <button onClick={onExit} className="flex-1 md:flex-none px-8 py-4 bg-white border border-black/10 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#f5f5f7] transition-all">Exit</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-24">
        <div className="bg-[#f5f5f7] p-6 md:p-10 rounded-[40px] md:rounded-[48px] apple-shadow">
          <p className="text-[9px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-4">Total Handshakes</p>
          <p className="text-3xl md:text-5xl font-black">{totalHandshakes}</p>
        </div>
        <div className="bg-[#f5f5f7] p-6 md:p-10 rounded-[40px] md:rounded-[48px] apple-shadow">
          <p className="text-[9px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-4">Throughput (NGN)</p>
          <p className="text-3xl md:text-5xl font-black">₦{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#f5f5f7] p-6 md:p-10 rounded-[40px] md:rounded-[48px] apple-shadow">
          <p className="text-[9px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-4">Expert Nodes</p>
          <p className="text-3xl md:text-5xl font-black">{totalExperts}</p>
        </div>
        <div className="bg-[#f5f5f7] p-6 md:p-10 rounded-[40px] md:rounded-[48px] apple-shadow">
          <p className="text-[9px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-4">Verified Nodes</p>
          <p className="text-3xl md:text-5xl font-black">{verifiedExperts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        <section className="lg:col-span-7">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Network Nodes</h3>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search Node/ID..."
                value={nodeSearch}
                onChange={(e) => setNodeSearch(e.target.value)}
                className="w-full bg-[#f5f5f7] border-none rounded-2xl px-5 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
            {filteredNodes.length > 0 ? filteredNodes.map(u => {
              const isGuest = u.id.startsWith('HMB-NODE-');
              return (
                <div key={u.id} className={`bg-white border border-black/5 p-6 md:p-8 rounded-[32px] flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center group hover:bg-[#f5f5f7] transition-all ${u.isSuspended ? 'opacity-50 grayscale' : ''}`}>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="relative">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] flex items-center justify-center text-xl border border-black/5 ${isGuest ? 'bg-black text-white font-mono' : 'bg-[#f5f5f7]'}`}>
                        {isGuest ? '#' : <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} className="w-full h-full object-cover rounded-[20px] md:rounded-[24px]" />}
                      </div>
                      {u.isVerified && <div className="absolute -top-1 -right-1 bg-black text-white p-1 rounded-full text-[8px]">✓</div>}
                    </div>
                    <div className="max-w-[150px] md:max-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm md:text-base font-black text-black uppercase tracking-tight truncate">{u.name}</p>
                        {u.isSuspended && <span className="bg-red-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">Suspended</span>}
                        {isGuest && <span className="bg-blue-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase">Guest Node</span>}
                      </div>
                      <p className="text-[10px] text-[#86868b] font-bold uppercase truncate">{u.isCreator ? (u.businessName || u.category) : (isGuest ? 'Hardware Identification' : 'Platform Member')}</p>
                      <p className="text-[8px] text-[#86868b] font-bold uppercase opacity-50 mt-1 font-mono">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        {u.isCreator && !u.kycVerified && !u.isSuspended && (
                          <button
                            onClick={() => handleManualVerify(u)}
                            disabled={!!actionLoading}
                            className="bg-black text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                          >
                            Verify
                          </button>
                        )}

                        {!isGuest && (
                          <button
                            onClick={() => handleToggleSuspension(u)}
                            disabled={!!actionLoading}
                            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${u.isSuspended ? 'bg-black text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                          >
                            {u.isSuspended ? 'Restore' : 'Suspend'}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${u.kycVerified ? 'bg-black text-white' : 'bg-gray-100 text-[#86868b]'}`}>
                          {isGuest ? 'Anonymized' : `KYC: ${u.kycStatus}`}
                        </span>
                        <span className="text-[8px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-500 font-mono">
                          ID: {u.id.substr(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center bg-[#f5f5f7] rounded-[32px]">
                <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em]">No matching nodes found in directory.</p>
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-5">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Handshake Log</h3>
            <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest">{serviceRequests.length} Events</span>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
            {serviceRequests.length > 0 ? serviceRequests.sort((a, b) => b.timestamp - a.timestamp).map(req => {
              const creator = users.find(u => u.id === req.creatorId);
              return (
                <div key={req.id} className="bg-white border border-black/5 p-6 md:p-8 rounded-[32px] group hover:bg-[#f5f5f7] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-1">Handshake ID</p>
                      <p className="text-xs font-black text-black uppercase tracking-tight font-mono">{req.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-1">{new Date(req.timestamp).toLocaleDateString()}</p>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${req.paymentType === 'urgent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {req.paymentType}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.03] flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-[#86868b] font-bold uppercase tracking-widest mb-1">Source Node</p>
                      <p className="text-[10px] font-mono text-black uppercase truncate max-w-[120px]">{req.clientId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-black">₦{req.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center bg-[#f5f5f7] rounded-[32px]">
                <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em]">Handshake log is currently null.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
