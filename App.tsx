
import React, { useState, useEffect, useMemo } from 'react';
import { Category, User, ServiceRequest, Location } from './types';
import { MOCK_USERS } from './constants';
import { Navbar, Footer } from './components/Layout';
import UnlockModal from './components/UnlockModal';
import Home from './pages/Home';
import MyConnections from './pages/MyConnections';
import VendorDashboard from './pages/VendorDashboard';
import HowItWorks from './pages/HowItWorks';
import Discovery from './pages/Discovery';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import { PrivacyPolicy, RefundPolicy } from './pages/Policies';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

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
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null);
  const [filteredVendors, setFilteredVendors] = useState<User[]>(MOCK_USERS);

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    localStorage.setItem('hmb_unlocks', JSON.stringify(unlockedUserIds));
    localStorage.setItem('hmb_requests', JSON.stringify(serviceRequests));
  }, [unlockedUserIds, serviceRequests]);

  useEffect(() => {
    let result = users.filter(u => u.isCreator && !u.isSuspended);
    if (selectedCategory !== 'All') result = result.filter(v => v.category === selectedCategory);
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
        isSuspended: false
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
    setCurrentView('home');
  };

  const handleUnlockSuccess = (vendorId: string, amount: number, type: 'standard' | 'urgent') => {
    setUnlockedUserIds(prev => [...prev, vendorId]);
    const newRequest: ServiceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: currentUser?.id || protocolId, // Identify guest by PAID
      creatorId: vendorId,
      status: 'unlocked',
      amount,
      paymentType: type,
      timestamp: Date.now()
    };
    setServiceRequests(prev => [...prev, newRequest]);

    setUsers(prev => prev.map(u => {
      if (u.id === vendorId) {
        return { ...u, totalUnlocks: (u.totalUnlocks || 0) + 1 };
      }
      return u;
    }));

    setShowUnlockModal(false);
    setCurrentView('my-connections');
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Compute "Guest Nodes" for Admin visualization
  const guestNodes = useMemo(() => {
    const uniqueGuestIds = new Set(serviceRequests.filter(r => r.clientId.startsWith('HMB-NODE-')).map(r => r.clientId));
    return Array.from(uniqueGuestIds).map((id: string) => ({
      id,
      name: `Guest Node: ${id.split('-').pop()}`,
      email: 'Anonymous Device',
      isCreator: false,
      location: Location.LAGOS,
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
            isUrgent={isUrgent}
            setIsUrgent={setIsUrgent}
            assistantMessage={assistantMessage}
            setAssistantMessage={setAssistantMessage}
            setFilteredVendors={setFilteredVendors}
            onVendorSelect={setActiveUser}
            unlockedVendorIds={unlockedUserIds}
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
      <Navbar currentView={currentView} onNavigate={setCurrentView} currentUser={currentUser} onLogout={() => { setCurrentUser(null); setCurrentView('home'); }} />
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">{renderCurrentView()}</main>

      {activeUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" onClick={() => setActiveUser(null)} />
          <div className="relative bg-white rounded-[32px] md:rounded-[48px] w-full max-w-5xl h-[92vh] md:h-[80vh] overflow-hidden flex flex-col md:flex-row apple-shadow-lg animate-in zoom-in-95 duration-500 border border-black/5 mx-2">
            <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-full bg-[#f5f5f7]">
              <img src={activeUser.portfolio?.[0] || activeUser.avatar} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-16 lg:p-20 flex flex-col h-full overflow-y-auto">
              <div className="flex justify-between items-start mb-6 md:mb-12">
                <div className="flex-grow pr-4">
                  <span className="text-[9px] md:text-[12px] font-bold text-[#86868b] uppercase tracking-[0.2em]">{activeUser.category}</span>
                  <h2 className="text-2xl md:text-5xl font-extrabold text-black tracking-tighter mt-1 md:mt-2 leading-tight break-words">{activeUser.businessName || activeUser.name}</h2>
                </div>
                <button onClick={() => setActiveUser(null)} className="p-2 md:p-3 bg-[#f5f5f7] rounded-full hover:scale-110 transition-transform flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px]">
                  <p className="text-[9px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Reliability</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">{activeUser.reliabilityScore}%</p>
                </div>
                <div className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px]">
                  <p className="text-[9px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Unlocks</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">{activeUser.totalUnlocks}</p>
                </div>
              </div>

              <div className="mb-8 md:mb-12">
                <h4 className="text-[10px] md:text-[11px] font-bold mb-4 uppercase text-[#86868b] tracking-widest">Expert Bio</h4>
                <p className="text-black text-lg md:text-xl leading-relaxed font-medium">
                  {activeUser.bio}
                </p>
              </div>

              <div className="mt-auto pt-6 md:pt-10">
                {unlockedUserIds.includes(activeUser.id) ? (
                  <button onClick={() => { setActiveUser(null); setCurrentView('my-connections'); }} className="w-full btn-apple py-5 md:py-6 text-base md:text-lg">View Contact Details</button>
                ) : (
                  <button
                    onClick={() => setShowUnlockModal(true)}
                    className="w-full btn-apple py-5 md:py-6 text-base md:text-lg flex items-center justify-center gap-4 group"
                  >
                    <span>Unlock Contact</span>
                    <span className="opacity-30 group-hover:opacity-100 transition-opacity">/</span>
                    <span>₦{activeUser.availableToday ? '5,000' : '2,500'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showUnlockModal && activeUser && <UnlockModal userEmail={currentUser?.email} vendor={activeUser} onClose={() => setShowUnlockModal(false)} onSuccess={handleUnlockSuccess} />}
      <Footer onNavigate={setCurrentView} />
    </div>
  );
};

export default App;
