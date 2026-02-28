
import React, { useState, useEffect, useMemo } from 'react';
import { Category, User, ServiceRequest, Location, ServicePackage } from './types';
import { MOCK_USERS } from './constants';
import { Navbar, Footer } from './components/Layout';
import { ProductTour } from './components/ProductTour';
import CalendarModal from './components/CalendarModal';
import { SuccessAnimation } from './components/SuccessAnimation';
import { LoadingAnimation } from './components/LoadingAnimation';
import AccessGateModal from './components/AccessGateModal';
import { useQuery, useMutation } from "convex/react";
import { api } from "./convex/_generated/api";
import { initializePaystack } from './services/paymentService';
import Home from './pages/Home';
import MyConnections from './pages/MyConnections';
import VendorDashboard from './pages/VendorDashboard';
import HowItWorks from './pages/HowItWorks';
import Discovery from './pages/Discovery';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Auth from './pages/Auth';
import CompleteProfile from './pages/CompleteProfile';
import AdminDashboard from './pages/AdminDashboard';
import CoinMarket from './pages/CoinMarket';
import ForVendors from './pages/ForVendors';
import { PrivacyPolicy, RefundPolicy } from './pages/Policies';

// --- Price List Section Component ---
const PriceListSection: React.FC<{ packages: ServicePackage[] }> = ({ packages }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="mb-20 border-t border-black/5 pt-12">
      <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] mb-2">Price List</h4>
      <h3 className="text-2xl font-black tracking-tighter uppercase mb-8">Service Packages</h3>
      <div className="space-y-3">
        {packages.map(pkg => (
          <div key={pkg.id} className="border border-black/5 rounded-[24px] overflow-hidden transition-all">
            <button
              onClick={() => setExpanded(expanded === pkg.id ? null : pkg.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-[#f5f5f7] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-black tracking-tight">{pkg.name}</span>
                    {pkg.isPopular && (
                      <span className="px-2.5 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full">Most Popular</span>
                    )}
                  </div>
                  {pkg.duration && (
                    <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mt-0.5 block">{pkg.duration}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-lg font-black text-black">₦{pkg.price.toLocaleString()}</span>
                <svg className={`w-4 h-4 text-black/30 transition-transform duration-200 ${expanded === pkg.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {expanded === pkg.id && pkg.inclusions.length > 0 && (
              <div className="px-6 pb-6 bg-[#f9f9f9] border-t border-black/5">
                {pkg.description && (
                  <p className="text-sm font-medium text-[#86868b] mt-4 mb-4 italic">{pkg.description}</p>
                )}
                <ul className="space-y-2 mt-4">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                      <span className="text-sm font-bold text-black">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const sessionId = typeof window !== 'undefined' ? localStorage.getItem("hmb_session_id") || undefined : undefined;

  const convexUser = useQuery(api.api.current, { sessionId });
  const profileStatus = useQuery(api.api.getProfileStatus, { sessionId });
  const convexProfiles = useQuery(api.api.searchProfiles);
  const convexUnlocks = useQuery(api.api.getUnlocks);

  const _updateProfileMutation = useMutation(api.api.updateProfile);
  const _adminUpdateProfileMutation = useMutation(api.api.adminUpdateProfile);
  const _creditCoinsMutation = useMutation(api.api.creditCoins);
  const _deductCoinsMutation = useMutation(api.api.deductCoins);
  const _insertUnlockMutation = useMutation(api.api.insertUnlock);

  const updateProfileMutation = (args: any) => _updateProfileMutation({ ...args, sessionId });
  const adminUpdateProfileMutation = (args: any) => _adminUpdateProfileMutation({ ...args, sessionId });
  const creditCoinsMutation = (args: any) => _creditCoinsMutation({ ...args, sessionId });
  const deductCoinsMutation = (args: any) => _deductCoinsMutation({ ...args, sessionId });
  const insertUnlockMutation = (args: any) => _insertUnlockMutation({ ...args, sessionId });

  const logoutMutation = useMutation(api.auth.logout);
  const signOut = async () => {
    if (sessionId) await logoutMutation({ sessionId: sessionId as any }).catch(() => { });
    localStorage.removeItem("hmb_session_id");
    window.location.reload();
  };

  const [currentUserLocal, setCurrentUserLocal] = useState<User | null>(null);
  const currentUser = React.useMemo(() => {
    if (!convexUser) return currentUserLocal;
    return {
      ...convexUser,
      id: convexUser.userId,
      name: convexUser.name || convexUser.full_name || 'User',
      isCreator: convexUser.is_creator,
      kycVerified: convexUser.kyc_verified,
      kycStatus: convexUser.kyc_status,
      reliabilityScore: convexUser.reliability_score || 70,
      totalUnlocks: 0,
      avatar: convexUser.avatar || `https://ui-avatars.com/api/?name=${convexUser.full_name || convexUser.name || 'User'}&background=000&color=fff`,
      hasPurchasedSignUpPack: convexUser.has_purchased_sign_up_pack,
    } as unknown as User;
  }, [convexUser, currentUserLocal]);
  const setCurrentUser = setCurrentUserLocal;

  // === SMART AUTH ROUTING ===
  // After magic link login, redirect new users to CompleteProfile
  // and returning users to the dashboard.
  useEffect(() => {
    if (profileStatus === undefined) return; // still loading
    if (profileStatus === null) return;      // not logged in — stay on current view

    if (!profileStatus.isComplete) {
      // First-time user — show profile completion page
      setCurrentView('complete-profile');
    } else {
      // Returning user — go to dashboard if they're on an auth/empty screen
      if (currentView === 'auth' || currentView === 'signup' || currentView === 'complete-profile' || currentView === 'home') {
        setCurrentView('dashboard');
      }
    }
  }, [profileStatus]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showCoinMarket, setShowCoinMarket] = useState(false);

  // Scroll to Top on View Change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

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
  const [successAnim, setSuccessAnim] = useState<{
    isVisible: boolean;
    actionText: string;
    deducted?: number;
    onCompleteCallback?: () => void;
  }>({ isVisible: false, actionText: '' });

  const [calendarVendor, setCalendarVendor] = useState<User | null>(null);

  // Access gate for unauthenticated unlock attempts
  const [showAccessGate, setShowAccessGate] = useState(false);
  const [pendingVendorIntent, setPendingVendorIntent] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem('hmb_unlocks', JSON.stringify(unlockedUserIds));
    localStorage.setItem('hmb_requests', JSON.stringify(serviceRequests));
  }, [unlockedUserIds, serviceRequests]);

  // Auto-sync users from Convex
  useEffect(() => {
    if (convexProfiles) {
      const mappedUsers = convexProfiles.map(p => ({
        ...p,
        id: p.userId, // Map Convex userId to our frontend 'id'
        name: p.name || p.full_name || 'User',
        isCreator: p.is_creator,
        kycVerified: p.kyc_verified,
        kycStatus: p.kyc_status,
        businessName: p.business_name || '', // Add placeholders for data not mapped in default schema yet
        infrastructuralRank: p.infrastructural_rank || 0,
        availableToday: p.available_today || false,
        reliabilityScore: p.reliability_score || 70,
        totalUnlocks: p.total_unlocks || 0,
        ratingAvg: p.rating_avg || 0,
        isSuspended: p.is_suspended,
        trialStartDate: p.trial_start_date || Date.now(),
        completedJobs: p.completed_jobs || 0,
        avgDeliveryTime: p.avg_delivery_time || '24h',
        topSkills: p.top_skills || [],
        socialLinks: p.social_links || {},
        coins: p.coins || 0,
        isPaid: p.is_paid || false,
        isPreLaunch: p.is_pre_launch || false,
        hasPurchasedSignUpPack: p.has_purchased_sign_up_pack,
        preferredLocation: p.preferred_location as Location,
        panicModeOptIn: p.panic_mode_opt_in || false,
        panicModePrice: p.panic_mode_price || 0,
        availabilityStatus: p.availability_status || 'AVAILABLE',
        blockedDates: p.blocked_dates || [],
        lastAvailabilityUpdate: p.last_availability_update || Date.now()
      }));

      // Merge MOCK users with real DB users so the app still looks populated while we add features
      setUsers([...MOCK_USERS, ...(mappedUsers as unknown as User[])]);
    }
  }, [convexProfiles]);

  // Sync Unlocks
  useEffect(() => {
    if (convexUnlocks) {
      setServiceRequests(convexUnlocks.map(r => ({
        id: r._id,
        clientId: r.organiserId,
        creatorId: r.vendorProfileId,
        status: r.status,
        amount: r.amount,
        paymentType: r.tier as 'standard' | 'urgent',
        timestamp: r._creationTime
      })));
    }
  }, [convexUnlocks]);

  useEffect(() => {
    let result = users.filter(u => u.isCreator && !u.isSuspended);
    if (selectedCategory !== 'All') result = result.filter(v => v.category === selectedCategory);
    if (selectedLocation !== 'All') result = result.filter(v => v.location === selectedLocation);
    if (isUrgent) result = result.filter(v => v.availableToday);

    result.sort((a, b) => {
      let rankA = (a.reliabilityScore || 0) + (a.isVerified ? 20 : 0);
      let rankB = (b.reliabilityScore || 0) + (b.isVerified ? 20 : 0);

      // Location boost
      if (currentUser?.preferredLocation) {
        if (a.location === currentUser.preferredLocation) rankA += 50;
        if (b.location === currentUser.preferredLocation) rankB += 50;
      }

      return rankB - rankA;
    });

    setFilteredVendors(result);
  }, [selectedCategory, isUrgent, users]);

  const handleLogin = (user: User, isNewUser?: boolean) => {
    // Restore pending vendor intent from sessionStorage if it was saved before auth navigation
    const savedIntent = sessionStorage.getItem('hmb_pending_vendor');
    if (savedIntent && !pendingVendorIntent) {
      try {
        const restored = JSON.parse(savedIntent) as User;
        setPendingVendorIntent(restored);
        sessionStorage.removeItem('hmb_pending_vendor');
      } catch (_) { }
    }

    const existing = users.find(u => u.email === user.email);
    if (existing) {
      if (existing.isSuspended) {
        alert("This account has been suspended by the Admin Protocol.");
        return;
      }
      setCurrentUser(existing);
    } else {
      const vendorCount = users.filter(u => u.isCreator).length;
      const isPreLaunch = vendorCount < 200;

      const newUser: User = {
        ...user,
        kycStatus: 'unverified',
        kycVerified: false,
        reliabilityScore: 70,
        totalUnlocks: 0,
        isSuspended: false,
        coins: 2, // New User Onboarding: 2 Free Coins
        isPreLaunch,
        isPaid: false,
        hasPurchasedSignUpPack: false,
        trialStartDate: Date.now(),
        panicModeOptIn: false,
        panicModePrice: 0,
        availabilityStatus: 'AVAILABLE',
        blockedDates: [],
        lastAvailabilityUpdate: Date.now()
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
    setCurrentView('home');

    // Show welcome coins animation for brand-new signups
    if (isNewUser) {
      setSuccessAnim({
        isVisible: true,
        actionText: '2 Coins Activated',
        onCompleteCallback: () => {
          // Re-open the vendor profile they were trying to access
          if (pendingVendorIntent) {
            setActiveUser(pendingVendorIntent);
            setPendingVendorIntent(null);
          }
        }
      });
    } else if (pendingVendorIntent) {
      setActiveUser(pendingVendorIntent);
      setPendingVendorIntent(null);
    }
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

    insertUnlockMutation({
      vendorProfileId: vendorId as any, // using strings as fallback mapped in data
      tier: newRequest.paymentType,
      amount: newRequest.amount,
      status: newRequest.status
    }).catch(console.error);
    setUsers(prev => prev.map(u => {
      if (u.id === vendorId) {
        return { ...u, totalUnlocks: (u.totalUnlocks || 0) + 1 };
      }
      return u;
    }));

    // Replaced direct view change here, rely on animation callback if applicable
    // setCurrentView('my-connections');
  };

  const handlePurchaseCoins = async (coinsToAdd: number) => {
    if (!currentUser) return;

    const isSignUpPack = coinsToAdd === 3 && !currentUser.hasPurchasedSignUpPack;

    setIsProcessingPayment(true);
    const startTime = Date.now();

    try {
      await creditCoinsMutation({
        amount: coinsToAdd,
        description: `Coin Purchase – ${coinsToAdd} coins`,
      });

      if (isSignUpPack) {
        updateProfileMutation({ has_purchased_sign_up_pack: true }).catch(console.error);
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) await new Promise(res => setTimeout(res, 1500 - elapsed));

      setShowCoinMarket(false);
      setSuccessAnim({
        isVisible: true,
        actionText: `+${coinsToAdd} Coins Added`,
      });
    } catch (error) {
      console.error('[HMB] Credit coins failed:', error);
      alert("Failed to confirm payment.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUnlockWithCoins = async (vendor: User) => {
    if (!currentUser) {
      setPendingVendorIntent(vendor);
      setShowAccessGate(true);
      return;
    }

    const requiredCoins = vendor.availableToday ? 2 : 1;

    if ((currentUser.coins || 0) < requiredCoins) {
      setShowCoinMarket(true);
      return;
    }

    setIsProcessingPayment(true);
    try {
      const startTime = Date.now();
      const isUrgentUnlock = vendor.availableToday && vendor.panicModeOptIn;
      const unlockDesc = isUrgentUnlock ? `Panic Unlock – ${vendor.businessName || vendor.name}` : `Contact Unlock – ${vendor.businessName || vendor.name}`;

      // Call convex mutation
      await deductCoinsMutation({
        amount: requiredCoins,
        description: unlockDesc
      });

      const unlockAmount = isUrgentUnlock ? (vendor.panicModePrice || 0) : 0;

      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) await new Promise(res => setTimeout(res, 1500 - elapsed));
      setIsProcessingPayment(false);

      handleUnlockSuccess(vendor.id, unlockAmount, isUrgentUnlock ? 'urgent' : 'standard');

      setSuccessAnim({
        isVisible: true,
        actionText: isUrgentUnlock ? 'Panic Mode Activated' : 'Contact Unlocked',
        deducted: requiredCoins,
        onCompleteCallback: () => setCurrentView('my-connections')
      });

    } catch (error: any) {
      console.error("Coin unlock error:", error);
      alert(error.message === 'Insufficient coins' ? 'Not enough coins. Please top up your wallet.' : 'Unlock failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };


  const handleCalendarUnlock = async (vendor: User, isUrgentUnlock: boolean, selectedDate: Date) => {
    // similar logic to handleUnlockWithCoins but driven by the calendar
    if (!currentUser) {
      setCalendarVendor(null);
      setPendingVendorIntent(vendor);
      setShowAccessGate(true);
      return;
    }

    const requiredCoins = isUrgentUnlock ? 2 : 1;

    if ((currentUser.coins || 0) < requiredCoins) {
      setCalendarVendor(null);
      setShowCoinMarket(true);
      return;
    }

    setIsProcessingPayment(true);
    try {
      const startTime = Date.now();

      await deductCoinsMutation({
        amount: requiredCoins,
        description: isUrgentUnlock ? `Panic Calendar Unlock – ${vendor.businessName || vendor.name}` : `Calendar Unlock – ${vendor.businessName || vendor.name}`
      });

      const newBalance = currentUser.coins - requiredCoins;
      const updatedUser = { ...currentUser, coins: newBalance };

      const unlockAmount = isUrgentUnlock ? (vendor.panicModePrice || 0) : 0;

      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) await new Promise(res => setTimeout(res, 1500 - elapsed));
      setIsProcessingPayment(false);

      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      handleUnlockSuccess(vendor.id, unlockAmount, isUrgentUnlock ? 'urgent' : 'standard');

      setCalendarVendor(null);
      setActiveUser(null);

      setSuccessAnim({
        isVisible: true,
        actionText: isUrgentUnlock ? 'Panic Mode Activated' : 'Contact Unlocked',
        deducted: requiredCoins,
        onCompleteCallback: () => setCurrentView('my-connections')
      });

    } catch (error) {
      console.error("Coin unlock error:", error);
      alert("Error processing protocol unlock.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleKeepDate = async (vendor: User, selectedDate: Date) => {
    if (!currentUser) {
      setCalendarVendor(null);
      setPendingVendorIntent(vendor);
      setShowAccessGate(true);
      return;
    }

    if ((currentUser.coins || 0) < 1) {
      setCalendarVendor(null);
      setShowCoinMarket(true);
      return;
    }

    setIsProcessingPayment(true);
    try {
      const startTime = Date.now();

      await deductCoinsMutation({
        amount: 1,
        description: `Date Request – ${vendor.businessName || vendor.name}`
      });

      const newBalance = currentUser.coins - 1;
      const updatedUser = { ...currentUser, coins: newBalance };

      const dateStr = selectedDate.toLocaleDateString();
      const message = encodeURIComponent(`Hello ${vendor.businessName || vendor.name}, I am interested in booking your services for ${dateStr}. I connected with you on HoldMyBeer.`);
      const phoneNumber = vendor.phone?.replace(/\D/g, '');

      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) await new Promise(res => setTimeout(res, 1500 - elapsed));
      setIsProcessingPayment(false);

      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

      setCalendarVendor(null);
      setActiveUser(null);

      setSuccessAnim({
        isVisible: true,
        actionText: 'Date Request Sent',
        deducted: 1,
        onCompleteCallback: () => {
          if (phoneNumber) {
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
          } else {
            alert('Vendor phone number not found.');
          }
        }
      });

    } catch (error) {
      console.error("Keep date error:", error);
      alert("Error processing date request.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      if (activeUser && activeUser.id === updatedUser.id) {
        setActiveUser(updatedUser);
      }

      // Fire mutation to our database asynchronously for normal users updating their own profile
      updateProfileMutation({
        name: updatedUser.name,
        business_name: updatedUser.businessName,
        category: updatedUser.category,
        bio: updatedUser.bio,
        location: updatedUser.location,
        has_purchased_sign_up_pack: updatedUser.hasPurchasedSignUpPack,
        preferred_location: updatedUser.preferredLocation,
        available_today: updatedUser.availableToday,
        top_skills: updatedUser.topSkills,
        social_links: updatedUser.socialLinks,
        avatar: updatedUser.avatar,
        portfolio: updatedUser.portfolio,
        is_creator: updatedUser.isCreator,
        phone: updatedUser.phone,
        availability_status: updatedUser.availabilityStatus,
        panic_mode_opt_in: updatedUser.panicModeOptIn,
        panic_mode_price: updatedUser.panicModePrice
      }).catch(console.error);
    } else {
      // Admin update context! Call the admin mutation route for the target ID
      if (activeUser && activeUser.id === updatedUser.id) {
        setActiveUser(updatedUser);
      }
      adminUpdateProfileMutation({
        userId: updatedUser.id,
        kyc_verified: updatedUser.kycVerified,
        kyc_status: updatedUser.kycStatus,
        is_suspended: updatedUser.isSuspended,
        coins: updatedUser.coins,
        reliability_score: updatedUser.reliabilityScore,
        panic_mode_opt_in: updatedUser.panicModeOptIn,
        panic_mode_price: updatedUser.panicModePrice,
      }).catch(console.error);
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
            onVendorSelect={(vendor) => {
              setActiveUser(vendor);
              setCalendarVendor(vendor);
            }}
            unlockedVendorIds={unlockedUserIds}
            isLoggedIn={!!currentUser}
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'discovery': return <Discovery users={users.filter(u => !u.isSuspended)} onSelect={(vendor) => {
        setActiveUser(vendor);
        setCalendarVendor(vendor);
      }} unlockedIds={unlockedUserIds} />;
      case 'pricing': return <Pricing />;
      case 'dashboard':
        return currentUser ? (
          <VendorDashboard
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            serviceRequests={serviceRequests}
            unlockedVendors={users.filter(u => unlockedUserIds.includes(u.id))}
            allUsers={users}
            onNavigate={setCurrentView}
          />
        ) : <Auth onNavigate={setCurrentView} onLogin={handleLogin} />;
      case 'my-connections': return <MyConnections vendors={users.filter(u => u.isCreator)} unlockedVendorIds={unlockedUserIds} serviceRequests={serviceRequests} currentUser={currentUser} onVendorSelect={setActiveUser} protocolId={protocolId} />;
      case 'how-it-works': return <HowItWorks />;
      case 'about': return <About />;
      case 'for-vendors': return <ForVendors onNavigate={setCurrentView} />;
      case 'policies': return <PrivacyPolicy />;
      case 'refund-policy': return <RefundPolicy />;
      case 'auth': return <Auth onNavigate={setCurrentView} onLogin={handleLogin} />;
      case 'complete-profile': return (
        <CompleteProfile
          onComplete={() => {
            setSuccessAnim({
              isVisible: true,
              actionText: '2 Coins Activated 🎉',
              onCompleteCallback: () => setCurrentView('dashboard')
            });
          }}
        />
      );
      case 'signup': return <Auth onLogin={handleLogin} />; // Signup now uses the same magic link Auth page
      case 'admin': return <AdminDashboard users={adminUsersList} serviceRequests={serviceRequests} onExit={() => setCurrentView('home')} onUpdateUser={handleUpdateUser} />;
      default: return null;
    }
  };

  // Full-screen intercept: if logged in but profile is incomplete, always show CompleteProfile
  if (profileStatus !== undefined && profileStatus !== null && !profileStatus.isComplete) {
    return (
      <CompleteProfile
        onComplete={() => {
          setSuccessAnim({
            isVisible: true,
            actionText: '2 Coins Activated 🎉',
            onCompleteCallback: () => setCurrentView('dashboard')
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black overflow-x-hidden w-full relative">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onLogout={async () => {
          await signOut();
          setCurrentUser(null);
          setCurrentView('home');
        }}
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

      <LoadingAnimation isVisible={isProcessingPayment} />

      <AccessGateModal
        isOpen={showAccessGate}
        onClose={() => setShowAccessGate(false)}
        onSignUp={() => {
          // Save intent to sessionStorage so it survives the auth navigation
          if (pendingVendorIntent) {
            sessionStorage.setItem('hmb_pending_vendor', JSON.stringify(pendingVendorIntent));
          }
          setShowAccessGate(false);
          setActiveUser(null); // Close profile modal so signup page is fully visible
          setCurrentView('signup');
        }}
        onLogin={() => {
          if (pendingVendorIntent) {
            sessionStorage.setItem('hmb_pending_vendor', JSON.stringify(pendingVendorIntent));
          }
          setShowAccessGate(false);
          setActiveUser(null); // Close profile modal so login page is fully visible
          setCurrentView('auth');
        }}
      />

      {activeUser && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" onClick={() => setActiveUser(null)} />
          <div className="relative bg-white w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-[48px] overflow-hidden flex flex-col apple-shadow-2xl animate-in zoom-in-95 duration-500 border border-black/5">

            {/* Header Sticky Area */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 py-4 md:px-10 md:py-8 flex items-center justify-between overflow-hidden">
              <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
                <img src={activeUser.avatar} className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-black/5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] md:text-2xl font-black tracking-tighter text-black uppercase truncate leading-tight">{activeUser.businessName || activeUser.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${activeUser.availableToday ? 'bg-green-50 text-green-600' : 'bg-[#f5f5f7] text-[#86868b]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeUser.availableToday ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {activeUser.availableToday ? 'Available' : 'Offline'}
                    </span>
                    <p className="text-[9px] md:text-[11px] font-bold text-[#86868b] uppercase tracking-widest truncate">{activeUser.category} • {activeUser.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                {unlockedUserIds.includes(activeUser.id) ? (
                  <button
                    onClick={() => { setActiveUser(null); setCurrentView('my-connections'); }}
                    className="btn-apple px-3 py-2 text-[9px] uppercase tracking-widest hidden sm:block"
                  >
                    View Contact
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlockWithCoins(activeUser)}
                    className={`px-3 py-2 text-[9px] uppercase tracking-widest hidden sm:block rounded-full font-black shadow-lg transition-all ${activeUser.availableToday && activeUser.panicModeOptIn ? 'bg-red-500 text-white animate-pulse' : 'btn-apple'}`}
                  >
                    {activeUser.availableToday && activeUser.panicModeOptIn ? '⚠️ Panic' : 'Hire'}
                  </button>
                )}
                <button onClick={() => setActiveUser(null)} className="w-9 h-9 md:w-10 md:h-10 bg-[#f5f5f7] rounded-full hover:bg-black/10 transition-colors shrink-0 flex items-center justify-center mr-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-8 md:px-10 md:pt-20 md:pb-32" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}>

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

                {/* 3.5 Price List */}
                {activeUser.packages && activeUser.packages.filter(p => p.isActive).length > 0 && (
                  <PriceListSection packages={activeUser.packages.filter(p => p.isActive)} />
                )}

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
                      <div className="flex items-center gap-2 opacity-60 cursor-not-allowed">
                        <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black">Contact Signals Locked</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {unlockedUserIds.includes(activeUser.id) ? (
                      <div className="flex gap-3 w-full">
                        <a href={`tel:${activeUser.phone}`} className="flex-1 py-5 bg-[#f5f5f7] hover:bg-black/10 text-black rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all text-center flex items-center justify-center">Call</a>
                        <a
                          href={`https://wa.me/${activeUser.phone?.replace('+', '').replace(/ /g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-5 bg-green-500 hover:bg-green-600 text-white rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all text-center flex items-center justify-center"
                        >
                          WhatsApp
                        </a>
                        <button onClick={() => setCalendarVendor(activeUser)} className="flex-1 btn-apple py-5 uppercase tracking-widest rounded-[20px]">Keep Date</button>
                      </div>
                    ) : (
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => setCalendarVendor(activeUser)}
                          className="flex-1 py-5 bg-[#f5f5f7] hover:bg-black/10 text-black rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all text-center"
                        >
                          View Calendar
                        </button>
                        <button
                          onClick={() => handleUnlockWithCoins(activeUser)}
                          className={`flex-1 py-4 uppercase tracking-widest flex flex-col items-center justify-center gap-0.5 rounded-[20px] font-black transition-all ${activeUser.availableToday && activeUser.panicModeOptIn ? 'bg-red-500 text-white animate-pulse' : 'btn-apple'}`}
                        >
                          <span className="text-[11px]">{activeUser.availableToday && activeUser.panicModeOptIn ? '🚨 Panic Unlock' : 'Unlock Contact'}</span>
                          <span className="text-[9px] opacity-60 font-black">{activeUser.availableToday ? '2 Coins' : '1 Coin'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {!currentUser && <Footer onNavigate={setCurrentView} />}
      <ProductTour isLoggedIn={!!currentUser} />

      {calendarVendor && (
        <CalendarModal
          vendor={calendarVendor}
          isOpen={!!calendarVendor}
          onClose={() => setCalendarVendor(null)}
          onUnlock={handleCalendarUnlock}
          onKeepDate={handleKeepDate}
          isUnlocked={unlockedUserIds.includes(calendarVendor.id)}
        />
      )}

      <SuccessAnimation
        isVisible={successAnim.isVisible}
        actionText={successAnim.actionText}
        deducted={successAnim.deducted}
        balance={currentUser?.coins || 0}
        onComplete={() => {
          setSuccessAnim(prev => ({ ...prev, isVisible: false }));
          if (successAnim.onCompleteCallback) {
            successAnim.onCompleteCallback();
          }
        }}
      />
    </div>
  );
};

export default App;
