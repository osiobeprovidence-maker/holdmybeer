
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: any;
  onLogout: () => void;
  onShowCoinMarket: () => void;
}

// Standardised coin symbol — "B" with double vertical stroke
const CoinSymbol = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
    <text x="1" y="10" fontSize="10" fontWeight="900" fill="currentColor" fontFamily="sans-serif">Ƀ</text>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  onShowCoinMarket
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const NavButton = ({ view, label }: { view: string, label: string }) => (
    <button
      onClick={() => { onNavigate(view); setIsMenuOpen(false); }}
      className={`px-3 py-1.5 text-[13px] font-bold tracking-tight transition-all relative uppercase ${currentView === view ? 'text-black' : 'text-[#86868b] hover:text-black'}`}
    >
      {label}
      {currentView === view && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />}
    </button>
  );

  // Logged-out desktop nav items
  const loggedOutNav = (
    <>
      <NavButton view="how-it-works" label="How It Works" />
      <NavButton view="pricing" label="Pricing" />
      <NavButton view="for-vendors" label="For Vendors" />
      <NavButton view="about" label="About" />
    </>
  );

  // Logged-in desktop center nav — Discovery only
  const loggedInNav = (
    <>
      <NavButton view="discovery" label="Discovery" />
    </>
  );

  return (
    <nav className="sticky top-0 z-[200] bg-white/80 backdrop-blur-xl border-b border-black/[0.03] py-5 px-6 md:px-12 flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { onNavigate(currentUser ? 'discovery' : 'home'); setIsMenuOpen(false); }}>
        <div className="w-8 h-8 bg-black flex items-center justify-center rounded-full shadow-sm">
          <span className="text-base leading-none">🍺</span>
        </div>
        <h1 className="text-base font-bold tracking-tight text-black uppercase">HoldMyBeer</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        {currentUser ? loggedInNav : loggedOutNav}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {currentUser && (
          <div
            id="coin-balance"
            className="flex items-center gap-1.5 bg-black text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer"
            onClick={onShowCoinMarket}
          >
            <span className="text-[11px] font-black tracking-wider">Ƀ</span>
            <span className="text-[10px] font-black tracking-widest uppercase">{currentUser.coins || 0}</span>
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 bg-white/20 rounded-full flex items-center justify-center text-[9px] md:text-[10px]">+</span>
          </div>
        )}

        {currentUser ? (
          <div className="hidden lg:flex items-center gap-5">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 bg-[#f5f5f7] px-4 py-2 rounded-full hover:bg-[#ebebe7] transition-colors"
            >
              <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} className="w-5 h-5 rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Profile</span>
            </button>
            <button
              onClick={() => onNavigate('discovery')}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#86868b] hover:text-black transition-colors"
            >
              Discovery
            </button>
            <button onClick={onLogout} className="text-[#86868b] text-[11px] font-bold hover:text-black transition-colors uppercase tracking-widest">Exit</button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => onNavigate('auth')} className="text-[#86868b] text-[11px] font-bold hover:text-black transition-colors uppercase tracking-widest">Login</button>
            <button onClick={() => onNavigate('signup')} className="text-[#86868b] text-[11px] font-bold hover:text-black transition-colors uppercase tracking-widest">Sign Up</button>
          </div>
        )}

        {/* Hamburger Toggle */}
        <button
          className="lg:hidden p-2 text-black z-[210] relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay System */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xl z-[150] animate-in fade-in duration-300 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-x-0 top-0 bg-white z-[160] flex flex-col p-8 pt-24 lg:hidden animate-in slide-in-from-top-full duration-500 rounded-b-[48px] shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex flex-col gap-6 mb-12">
              {currentUser ? (
                // Logged-in mobile nav
                <>
                  <button onClick={() => { onNavigate('discovery'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">Discovery</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                  <button onClick={() => { onNavigate('pricing'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">Pricing</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                  <button onClick={() => { onNavigate('for-vendors'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">For Vendors</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                  <button onClick={() => { onShowCoinMarket(); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">Wallet</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                </>
              ) : (
                // Logged-out mobile nav
                <>
                  <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">Home</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                  <button onClick={() => { onNavigate('how-it-works'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">How It Works</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                  <button onClick={() => { onNavigate('pricing'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">Pricing</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                  <button onClick={() => { onNavigate('for-vendors'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">For Vendors</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                  <button onClick={() => { onNavigate('about'); setIsMenuOpen(false); }} className="group flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter uppercase text-black">About</span>
                    <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-black/5 pt-10 pb-8">
              {currentUser ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 bg-[#f5f5f7] p-6 rounded-[32px]">
                    <img src={currentUser.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b] mb-1">Authenticated Hub</p>
                      <p className="text-lg font-black uppercase text-black">{currentUser.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="btn-apple py-5">Profile</button>
                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="px-6 py-5 rounded-full border border-black/10 text-[11px] font-black uppercase tracking-widest text-red-500">Exit</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] text-center mb-6">Join the Protocol</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { onNavigate('auth'); setIsMenuOpen(false); }} className="py-5 bg-[#f5f5f7] rounded-[24px] text-[12px] font-black uppercase tracking-widest">Login</button>
                    <button onClick={() => { onNavigate('signup'); setIsMenuOpen(false); }} className="py-5 bg-[#f5f5f7] rounded-[24px] text-[12px] font-black uppercase tracking-widest">Sign Up</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center pb-4 pt-4">
              <button onClick={() => setIsMenuOpen(false)} className="text-[10px] font-black uppercase tracking-[0.5em] text-[#86868b]">Dismiss Menu</button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="py-24 px-8 md:px-12 mt-20 border-t border-black/[0.03] bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="max-w-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-black flex items-center justify-center rounded-full shadow-sm">🍺</div>
            <h1 className="text-lg font-bold tracking-tight text-black uppercase">HoldMyBeer</h1>
          </div>
          <p className="text-[#86868b] text-sm leading-relaxed font-bold uppercase tracking-tight opacity-50">
            Finding experts should be simple. <br />The easiest way to connect with event pros in Nigeria.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-24">
          <div>
            <h4 className="text-black font-bold mb-6 text-[11px] uppercase tracking-[0.3em] opacity-40">Navigate</h4>
            <ul className="space-y-4 text-[13px] md:text-sm font-bold text-[#86868b]">
              <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-black uppercase">How It Works</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-black uppercase">Pricing</button></li>
              <li><button onClick={() => onNavigate('for-vendors')} className="hover:text-black uppercase">For Vendors</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-black uppercase">About</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-black font-bold mb-6 text-[11px] uppercase tracking-[0.3em] opacity-40">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-[#86868b]">
              <li><button onClick={() => onNavigate('policies')} className="hover:text-black uppercase">Privacy</button></li>
              <li><button onClick={() => onNavigate('refund-policy')} className="hover:text-black uppercase">Refunds</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-black/[0.02] text-[10px] font-bold text-[#86868b] flex justify-between items-center uppercase tracking-[0.3em] opacity-30">
        <p>© 2024 HoldMyBeer.</p>
        <button onClick={() => onNavigate('admin')} className="hover:text-black transition-colors">
          Expert Retrieval Nigeria. v2.0.5
        </button>
      </div>
    </footer>
  );
};
