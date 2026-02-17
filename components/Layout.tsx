
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
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

  return (
    <nav className="sticky top-0 z-[200] bg-white/80 backdrop-blur-xl border-b border-black/[0.03] py-5 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}>
        <div className="w-8 h-8 bg-black flex items-center justify-center rounded-full shadow-sm">
          <span className="text-base leading-none">🍺</span>
        </div>
        <h1 className="text-base font-bold tracking-tight text-black uppercase">holdmybeer</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <NavButton view="discovery" label="Discovered" />
        <NavButton view="my-connections" label="Connections" />
        <NavButton view="how-it-works" label="Guide" />
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 bg-[#f5f5f7] px-4 py-2 rounded-full hover:bg-[#ebebe7] transition-colors"
            >
              <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} className="w-5 h-5 rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Hub</span>
            </button>
            <button onClick={onLogout} className="text-[#86868b] text-[11px] font-bold hover:text-black transition-colors uppercase tracking-widest">Exit</button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('auth')}
            className="hidden md:block btn-apple text-[12px] px-8 py-2.5 uppercase tracking-widest"
          >
            Start
          </button>
        )}

        {/* Hamburger Toggle */}
        <button
          className="md:hidden p-2 text-black z-[210] relative"
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
          {/* Dense Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xl z-[150] animate-in fade-in duration-300 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Solid Menu Panel */}
          <div className="fixed inset-x-0 top-0 bg-white z-[160] flex flex-col p-8 pt-24 md:hidden animate-in slide-in-from-top-full duration-500 rounded-b-[48px] shadow-2xl">
            <div className="flex flex-col gap-8 mb-16">
              <button
                onClick={() => { onNavigate('discovery'); setIsMenuOpen(false); }}
                className="group flex items-center justify-between"
              >
                <span className="text-4xl font-black tracking-tighter uppercase text-black">Discovered</span>
                <span className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
              </button>
              <button
                onClick={() => { onNavigate('my-connections'); setIsMenuOpen(false); }}
                className="group flex items-center justify-between"
              >
                <span className="text-4xl font-black tracking-tighter uppercase text-black">Connections</span>
                <span className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
              </button>
              <button
                onClick={() => { onNavigate('how-it-works'); setIsMenuOpen(false); }}
                className="group flex items-center justify-between"
              >
                <span className="text-4xl font-black tracking-tighter uppercase text-black">Guide</span>
                <span className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">→</span>
              </button>
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
                  <button onClick={() => { onNavigate('auth'); setIsMenuOpen(false); }} className="w-full btn-apple py-7 text-xl uppercase tracking-widest shadow-xl">Get Started</button>
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
    <footer className="py-16 md:py-24 px-6 md:px-12 mt-20 border-t border-black/[0.03] bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
        <div className="max-w-xs text-center md:text-left mx-auto md:mx-0">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <div className="w-8 h-8 bg-black flex items-center justify-center rounded-full shadow-sm">🍺</div>
            <h1 className="text-lg font-bold tracking-tight text-black uppercase">holdmybeer</h1>
          </div>
          <p className="text-[#86868b] text-sm leading-relaxed font-bold uppercase tracking-tight opacity-50">
            Finding experts should be simple. <br />The easiest way to connect with event pros in Nigeria.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 md:gap-24 w-full md:w-auto text-center md:text-left">
          <div>
            <h4 className="text-black font-bold mb-6 text-[11px] uppercase tracking-[0.3em] opacity-40">Navigate</h4>
            <ul className="space-y-4 text-sm font-bold text-[#86868b]">
              <li><button onClick={() => onNavigate('discovery')} className="hover:text-black uppercase">Discovered</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-black uppercase">Pricing</button></li>
              <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-black uppercase">Guide</button></li>
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
      <div className="max-w-7xl mx-auto mt-16 md:mt-24 pt-8 border-t border-black/[0.02] text-[9px] md:text-[10px] font-bold text-[#86868b] flex flex-col md:flex-row justify-between items-center gap-4 uppercase tracking-[0.3em] opacity-30">
        <p>© 2024 holdmybeer.</p>
        <button
          onClick={() => onNavigate('admin')}
          className="hover:text-black transition-colors"
        >
          Expert Retrieval Nigeria. v2.0.4
        </button>
      </div>
    </footer>
  );
};
