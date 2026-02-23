
import React, { useState, useEffect, useMemo } from 'react';
import { Category, User, ServiceRequest, Location } from './types';
import { MOCK_USERS } from './constants';
import { Navbar, Footer } from './components/Layout';
import { supabase } from './services/supabaseClient';
import { initializePaystack } from './services/paymentService';
import Home from './pages/Home';
import MyConnections from './pages/MyConnections';
import VendorDashboard from './pages/VendorDashboard';
import HowItWorks from './pages/HowItWorks';
import Discovery from './pages/Discovery';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import CoinMarket from './pages/CoinMarket';
import { PrivacyPolicy, RefundPolicy } from './pages/Policies';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showCoinMarket, setShowCoinMarket] = useState(false);

  // Protocol Access ID (PAID) for Guests
  const [protocolId] = useState<string>(() => {
    const saved = localStorage.getItem('hmb_protocol_id');
    if (saved) return saved;
    const newId = `HMB-NODE-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
    localStorage.setItem('hmb_protocol_id', newId);
    return newId;
  });

  const [unlockedUserIds, setUnlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('hmb_unlocks');
    return saved ? JSON.parse(saved) : [];
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('hmb_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null);
  const [filteredVendors, setFilteredVendors] = useState<User[]>(MOCK_USERS);

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedLocation, setSelectedLocation] = useState<Location | 'All'>('All');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    localStorage.setItem('hmb_unlocks', JSON.stringify(unlockedUserIds));
    localStorage.setItem('hmb_requests', JSON.stringify(serviceRequests));
  }, [unlockedUserIds, serviceRequests]);

  // Load from Supabase on mount
  useEffect(() => {
    const initData = async () => {
      if (!supabase) return;

      const { data: profiles } = await supabase.from('profiles').select('*');
      if (profiles && profiles.length > 0) {
        // Map snake_case from DB to camelCase for frontend
        const mappedUsers = profiles.map(p => ({
          ...p,
          isCreator: p.is_creator,
          kycVerified: p.kyc_verified,
          kycStatus: p.kyc_status,
          businessName: p.business_name,
          infrastructuralRank: p.infrastructural_rank,
          availableToday: p.available_today,
          reliabilityScore: p.reliability_score,
          totalUnlocks: p.total_unlocks,
          ratingAvg: p.rating_avg,
          isSuspended: p.is_suspended,
          trialStartDate: p.trial_start_date,
          completedJobs: p.completed_jobs,
          avgDeliveryTime: p.avg_delivery_time,
          topSkills: p.top_skills,
          socialLinks: p.social_links,
          coins: p.coins || 0
        }));
        setUsers(mappedUsers as unknown as User[]);
      }

      const { data: requests } = await supabase.from('service_requests').select('*');
      if (requests && requests.length > 0) {
        setServiceRequests(requests.map(r => ({
          id: r.id,
          clientId: r.client_id,
          creatorId: r.creator_id,
          status: r.status,
          amount: r.amount,
          paymentType: r.payment_type,
          timestamp: r.timestamp
        })));

        // Compute unlocks for guest nodes or current id just from requests
        // Wait, for simplistic upgrade we keep localStorage unlocks
      }
    };
    initData();
  }, []);

  useEffect(() => {
    let result = users.filter(u => u.isCreator && !u.isSuspended);
    if (selectedCategory !== 'All') result = result.filter(v => v.category === selectedCategory);
    if (selectedLocation !== 'All') result = result.filter(v => v.location === selectedLocation);
    if (isUrgent) result = result.filter(v => v.availableToday);

    result.sort((a, b) => {
      const rankA = (a.reliabilityScore || 0) + (a.isVerified ? 20 : 0);
      const rankB = (b.reliabilityScore || 0) + (b.isVerified ? 20 : 0);
      return rankB - rankA;
    });

    setFilteredVendors(result);
  }, [selectedCategory, isUrgent, users]);

  const handleLogin = (user: User) => {
    const existing = users.find(u => u.email === user.email);
    if (existing) {
      if (existing.isSuspended) {
        alert("This account has been suspended by the Admin Protocol.");
        return;
      }
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        ...user,
        kycStatus: 'unverified',
        kycVerified: false,
        reliabilityScore: 70,
        totalUnlocks: 0,
        isSuspended: false,
        coins: 0
      };

      if (supabase) {
        // We do a simple insert to profiles for the mocked auth.
        // It bypasses auth.users since it's just a demo UI.
        supabase.from('profiles').insert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          is_creator: newUser.isCreator,
          location: newUser.location,
          kyc_verified: newUser.kycVerified,
          kyc_status: newUser.kycStatus,
          avatar: newUser.avatar,
          reliability_score: newUser.reliabilityScore,
          total_unlocks: newUser.totalUnlocks,
          is_suspended: newUser.isSuspended,
          coins: 0
        }).then(({ error }) => { if (error) console.error("Supabase insert error:", error) });
      }

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
    setCurrentView('home');
  };

  const handleUnlockSuccess = (vendorId: string, amount: number, type: 'standard' | 'urgent') => {
    setUnlockedUserIds(prev => {
      const newIds = [...prev, vendorId];
      localStorage.setItem('hmb_unlocks', JSON.stringify(newIds));
      return newIds;
    });

    const newRequest: ServiceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: currentUser?.id || protocolId,
      creatorId: vendorId,
      status: 'unlocked',
      amount,
      paymentType: type,
      timestamp: Date.now()
    };

    setServiceRequests(prev => {
      const newRequests = [...prev, newRequest];
      localStorage.setItem('hmb_requests', JSON.stringify(newRequests));
      return newRequests;
    });

    if (supabase) {
      supabase.from('service_requests').insert({
        id: newRequest.id,
        client_id: newRequest.clientId,
        creator_id: newRequest.creatorId,
        status: newRequest.status,
        amount: newRequest.amount,
        payment_type: newRequest.paymentType,
        timestamp: newRequest.timestamp
      }).then(({ error }) => { if (error) console.error("Supabase insert error:", error) });
    }

    setUsers(prev => prev.map(u => {
      if (u.id === vendorId) {
        return { ...u, totalUnlocks: (u.totalUnlocks || 0) + 1 };
      }
      return u;
    }));

    setCurrentView('my-connections');
  };

  const handlePurchaseCoins = async (coinsToAdd: number) => {
    if (!currentUser) return;

    const newBalance = (currentUser.coins || 0) + coinsToAdd;
    const updatedUser = { ...currentUser, coins: newBalance };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    if (supabase) {
      await supabase
        .from('profiles')
        .update({ coins: newBalance })
        .eq('id', currentUser.id);
    }

    setShowCoinMarket(false);
  };

  const handleUnlockWithCoins = async (vendor: User) => {
    if (!currentUser) {
      setCurrentView('auth');
      return;
    }

    const requiredCoins = vendor.availableToday ? 2 : 1;

    if ((currentUser.coins || 0) < requiredCoins) {
      setShowCoinMarket(true);
      return;
    }

    setIsProcessingPayment(true);

    try {
      const newBalance = currentUser.coins - requiredCoins;
      const updatedUser = { ...currentUser, coins: newBalance };

      if (supabase) {
        await supabase
          .from('profiles')
          .update({ coins: newBalance })
          .eq('id', currentUser.id);
      }

      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

      handleUnlockSuccess(vendor.id, 0, vendor.availableToday ? 'urgent' : 'standard');

      setAssistantMessage(`Protocol Handshake Verified via Coins. Balance: ${newBalance}`);
      setTimeout(() => setAssistantMessage(null), 5000);
    } catch (error) {
      console.error("Coin unlock error:", error);
      alert("Error processing protocol unlock.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    if (activeUser && activeUser.id === updatedUser.id) {
      setActiveUser(updatedUser);
    }

    if (supabase) {
      supabase.from('profiles').update({
        name: updatedUser.name,
        business_name: updatedUser.businessName,
        category: updatedUser.category,
        bio: updatedUser.bio,
        location: updatedUser.location,
        available_today: updatedUser.availableToday,
        price_range: updatedUser.priceRange,
        top_skills: updatedUser.topSkills,
        services: updatedUser.services,
        experience: updatedUser.experience,
        industries: updatedUser.industries,
        social_links: updatedUser.socialLinks,
        avatar: updatedUser.avatar,
        portfolio: updatedUser.portfolio
      }).eq('id', updatedUser.id).then(({ error }) => {
        if (error) console.error("Supabase update error:", error);
      });
    }

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Compute "Guest Nodes" for Admin visualization
  const guestNodes = useMemo(() => {
    const uniqueGuestIds = new Set<string>(serviceRequests.filter(r => r.clientId.startsWith('HMB-NODE-')).map(r => r.clientId));
    return Array.from(uniqueGuestIds).map(id => ({
      id,
      name: `Guest Node: ${id.split('-').pop()}`,
      email: 'Anonymous Device',
      isCreator: false,
      location: Location.LAGOS_ISLAND,
      kycVerified: false,
      kycStatus: 'unverified' as const,
      isSuspended: false
    }));
  }, [serviceRequests]);

  const adminUsersList = useMemo(() => [...users, ...guestNodes], [users, guestNodes]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home
            vendors={users.filter(u => u.isCreator && !u.isSuspended)}
            filteredVendors={filteredVendors}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            isUrgent={isUrgent}
            setIsUrgent={setIsUrgent}
            assistantMessage={assistantMessage}
            setAssistantMessage={setAssistantMessage}
            setFilteredVendors={setFilteredVendors}
            onVendorSelect={setActiveUser}
            unlockedVendorIds={unlockedUserIds}
            isLoggedIn={!!currentUser}
          />
        );
      case 'discovery': return <Discovery users={users.filter(u => !u.isSuspended)} onSelect={setActiveUser} unlockedIds={unlockedUserIds} />;
      case 'pricing': return <Pricing />;
      case 'dashboard':
        return currentUser ? (
          <VendorDashboard
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            serviceRequests={serviceRequests}
            unlockedVendors={users.filter(u => unlockedUserIds.includes(u.id))}
            allUsers={users}
          />
        ) : <Auth onLogin={handleLogin} />;
      case 'my-connections': return <MyConnections vendors={users.filter(u => u.isCreator)} unlockedVendorIds={unlockedUserIds} serviceRequests={serviceRequests} currentUser={currentUser} onVendorSelect={setActiveUser} protocolId={protocolId} />;
      case 'how-it-works': return <HowItWorks />;
      case 'policies': return <PrivacyPolicy />;
      case 'refund-policy': return <RefundPolicy />;
      case 'auth': return <Auth onLogin={handleLogin} />;
      case 'admin': return <AdminDashboard users={adminUsersList} serviceRequests={serviceRequests} onExit={() => setCurrentView('home')} onUpdateUser={handleUpdateUser} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onLogout={() => { setCurrentUser(null); setCurrentView('home'); }}
        onShowCoinMarket={() => setShowCoinMarket(true)}
      />
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-40 w-full">{renderCurrentView()}</main>

      {showCoinMarket && (
        <CoinMarket
          currentUser={currentUser}
          onPurchaseSuccess={handlePurchaseCoins}
          onClose={() => setShowCoinMarket(false)}
        />
      )}

      {isProcessingPayment && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-white/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="text-center">
            <div className="w-16 h-16 border-[4px] border-[#f5f5f7] border-t-black rounded-full animate-spin mx-auto mb-8"></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Verifying Handshake...</h2>
            <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.4em] mt-4">Securing Protocol Connection</p>
          </div>
        </div>
      )}

      {activeUser && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" onClick={() => setActiveUser(null)} />
          <div className="relative bg-white w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-[48px] overflow-hidden flex flex-col apple-shadow-2xl animate-in zoom-in-95 duration-500 border border-black/5">

            {/* Header Sticky Area */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-6 md:px-12 md:py-10 flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-6">
                <img src={activeUser.avatar} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-black/5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-black tracking-tighter text-black uppercase">{activeUser.businessName || activeUser.name}</h2>
                    <div className={`w-2 h-2 rounded-full ${activeUser.availableToday ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <p className="text-[10px] md:text-[11px] font-bold text-[#86868b] uppercase tracking-widest">{activeUser.category} • {activeUser.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {unlockedUserIds.includes(activeUser.id) ? (
                  <button
                    onClick={() => { setActiveUser(null); setCurrentView('my-connections'); }}
                    className="btn-apple px-6 py-3 text-[11px] uppercase tracking-widest hidden sm:block"
                  >
                    View Contact
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlockWithCoins(activeUser)}
                    className="btn-apple px-6 py-3 text-[11px] uppercase tracking-widest hidden sm:block"
                  >
                    Hire Expert ({activeUser.availableToday ? '2 Coins' : '1 Coin'})
                  </button>
                )}
                <button onClick={() => setActiveUser(null)} className="p-2 md:p-3 bg-[#f5f5f7] rounded-full hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto scrollbar-hide">
              <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:px-12 md:pt-24 md:pb-32">

                {/* 1. Bio & Highlights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 mt-4">
                  <div className="lg:col-span-7">
                    <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] mb-4">Expert Bio</h4>
                    <p className="text-xl md:text-2xl font-medium text-black leading-tight mb-8">
                      {activeUser.bio || "No bio provided."}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {activeUser.topSkills?.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-[#f5f5f7] rounded-full text-[10px] font-black uppercase tracking-widest text-black/60">{skill}</span>
                      )) || (
                          <span className="px-4 py-2 bg-[#f5f5f7] rounded-full text-[10px] font-black uppercase tracking-widest text-black/60">Verified Expert</span>
                        )}
                    </div>
                  </div>

                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-[#f5f5f7] p-6 rounded-[32px] flex flex-col justify-center">
                      <p className="text-[9px] font-black text-[#86868b] uppercase tracking-widest mb-1">Rating</p>
                      <p className="text-2xl font-black text-black">★ {activeUser.ratingAvg || 'NEW'}</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-6 rounded-[32px] flex flex-col justify-center">
                      <p className="text-[9px] font-black text-[#86868b] uppercase tracking-widest mb-1">Completed</p>
                      <p className="text-2xl font-black text-black">{activeUser.completedJobs || 0}+ Jobs</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-6 rounded-[32px] flex flex-col justify-center">
                      <p className="text-[9px] font-black text-[#86868b] uppercase tracking-widest mb-1">Avg Delivery</p>
                      <p className="text-2xl font-black text-black">{activeUser.avgDeliveryTime || '24h'}</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-6 rounded-[32px] flex flex-col justify-center">
                      <p className="text-[9px] font-black text-[#86868b] uppercase tracking-widest mb-1">Reliability</p>
                      <p className="text-2xl font-black text-black">{activeUser.reliabilityScore}%</p>
                    </div>
                  </div>
                </div>

                {/* 2. Experience & Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 border-t border-black/5 pt-12">
                  <div>
                    <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] mb-6">Services Offered</h4>
                    <div className="space-y-3">
                      {(activeUser.services || ['Professional Execution', 'Consultation', 'Delivery']).map(s => (
                        <div key={s} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-black rounded-full" />
                          <span className="text-sm font-bold text-black uppercase tracking-tight">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] mb-6">Experience & Industries</h4>
                    <p className="text-sm font-bold text-black uppercase tracking-tight mb-4">{activeUser.experience || '2+ Years of Industry Experience'}</p>
                    <div className="flex flex-wrap gap-2">
                      {(activeUser.industries || ['Events', 'Corporate', 'Private']).map(i => (
                        <span key={i} className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">#{i}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Proof of Work Gallery (Shorts Style) */}
                <div className="mb-20">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] mb-2">Proof of Work</h4>
                      <h3 className="text-2xl font-black tracking-tighter uppercase">Shorts Gallery</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">{activeUser.portfolio?.length || 0} Assets</span>
                    </div>
                  </div>

                  <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    {activeUser.portfolio?.map((item, idx) => {
                      const isVideo = item?.toLowerCase().match(/\.(mp4|webm|ogg)$/) || item?.includes('video');
                      return (
                        <div key={idx} className="relative w-[240px] md:w-[280px] aspect-[3/4] shrink-0 rounded-[32px] overflow-hidden group bg-[#f5f5f7] apple-shadow border border-black/5 snap-center">
                          {isVideo ? (
                            <video src={item} className="w-full h-full object-cover" />
                          ) : (
                            <img src={item} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">Asset {idx + 1}</p>
                            <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">Verified Proof</p>
                          </div>
                          {isVideo && (
                            <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {(!activeUser.portfolio || activeUser.portfolio.length === 0) && (
                      <div className="w-full py-20 text-center bg-[#f5f5f7] rounded-[40px] border-2 border-dashed border-black/5">
                        <p className="text-4xl mb-4">📸</p>
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">No assets uploaded yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Social Links & Contact */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-black/5">
                  <div className="flex gap-6">
                    {(unlockedUserIds.includes(activeUser.id) || currentUser?.id === activeUser.id) ? (
                      <>
                        {activeUser.socialLinks?.instagram && <a href={activeUser.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#86868b] hover:text-black">Instagram</a>}
                        {activeUser.socialLinks?.behance && <a href={activeUser.socialLinks.behance} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#86868b] hover:text-black">Behance</a>}
                        {activeUser.socialLinks?.youtube && <a href={activeUser.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#86868b] hover:text-black">YouTube</a>}
                        {activeUser.socialLinks?.tiktok && <a href={activeUser.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#86868b] hover:text-black">TikTok</a>}
                        {activeUser.socialLinks?.portfolio && <a href={activeUser.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-[#86868b] hover:text-black">Portfolio</a>}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 opacity-30 cursor-not-allowed" title="Unlock contact to see social links">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Contact Signals Locked</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {unlockedUserIds.includes(activeUser.id) ? (
                      <button onClick={() => { setActiveUser(null); setCurrentView('my-connections'); }} className="w-full md:w-auto btn-apple px-12 py-5 uppercase tracking-widest">View Contact Signal</button>
                    ) : (
                      <button
                        onClick={() => handleUnlockWithCoins(activeUser)}
                        className="w-full md:w-auto btn-apple px-12 py-5 uppercase tracking-widest flex items-center justify-center gap-4"
                      >
                        <span>Unlock Contact</span>
                        <span className="opacity-20">/</span>
                        <span>{activeUser.availableToday ? '2 Coins' : '1 Coin'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {!currentUser && <Footer onNavigate={setCurrentView} />}
    </div>
  );
};

export default App;
