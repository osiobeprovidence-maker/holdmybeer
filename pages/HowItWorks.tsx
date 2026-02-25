
import React, { useState } from 'react';

const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planners' | 'vendors'>('planners');

  return (
    <div className="pb-24 max-w-6xl mx-auto px-6 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center mb-24 md:mb-40 pt-10">
        <h1 className="text-4xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tighter text-black leading-none">
          How it <span className="text-[#86868b]">works.</span>
        </h1>
        <p className="text-base md:text-2xl lg:text-3xl text-black max-w-3xl mx-auto font-bold leading-tight mb-8">
          HoldMyBeer connects event planners directly to verified professionals using a simple coin-based access system.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-60">
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-xs bg-[#f5f5f7] px-6 py-3 rounded-full">
            <span>✕</span> No Subscriptions
          </div>
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-xs bg-[#f5f5f7] px-6 py-3 rounded-full">
            <span>✕</span> No Commissions
          </div>
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-xs bg-[#f5f5f7] px-6 py-3 rounded-full">
            <span>✕</span> No Middleman
          </div>
        </div>
      </section>

      {/* Role Switcher */}
      <div className="flex justify-center mb-20">
        <div className="bg-[#f5f5f7] p-2 rounded-[32px] flex gap-2 shadow-sm border border-black/5">
          <button
            onClick={() => setActiveTab('planners')}
            className={`px-8 md:px-12 py-4 rounded-[24px] text-[11px] md:text-[13px] font-black uppercase tracking-widest transition-all ${activeTab === 'planners' ? 'bg-black text-white shadow-xl scale-105' : 'text-[#86868b] hover:text-black'}`}
          >
            For Planners
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-8 md:px-12 py-4 rounded-[24px] text-[11px] md:text-[13px] font-black uppercase tracking-widest transition-all ${activeTab === 'vendors' ? 'bg-black text-white shadow-xl scale-105' : 'text-[#86868b] hover:text-black'}`}
          >
            For Professionals
          </button>
        </div>
      </div>

      {activeTab === 'planners' ? (
        <div className="space-y-40 animate-in slide-in-from-bottom-8 duration-700">
          {/* Planner Step 1 */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
            <div className="w-full md:w-1/2 relative group">
              <div className="bg-[#f5f5f7] aspect-square rounded-[60px] flex items-center justify-center text-[120px] md:text-[180px] apple-shadow transition-transform duration-700 group-hover:scale-95 group-hover:rotate-3">🔎</div>
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-[32px] apple-shadow border border-black/5 hidden md:block animate-bounce delay-700">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Filters Included</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase"><span className="text-green-500">✓</span> Location</div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase"><span className="text-green-500">✓</span> Category</div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase"><span className="text-green-500">✓</span> Pricing</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-6">Step 01</p>
              <h2 className="text-2xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">Search & Discover.</h2>
              <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed mb-8">
                Browse our curated pool of elite Nigerians experts. From legendary DJs to master caterers, every professional is vetted for quality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[32px] border border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Verify</p>
                  <p className="text-sm font-bold uppercase">Business Name</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Pricing</p>
                  <p className="text-sm font-bold uppercase">Starting Range</p>
                </div>
              </div>
            </div>
          </div>

          {/* Planner Step 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center">
            <div className="w-full md:w-1/2 relative group">
              <div className="bg-black aspect-square rounded-[60px] flex items-center justify-center text-[120px] md:text-[180px] shadow-2xl transition-transform duration-700 group-hover:scale-95 group-hover:-rotate-3 text-white">₿</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">🔓</div>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-6">Step 02</p>
              <h2 className="text-2xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">Unlock with Coins.</h2>
              <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed mb-8">
                Access verified phone numbers and direct WhatsApp signals using our transparent coin layer. No messy subscriptions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-[#f5f5f7] p-6 rounded-[32px]">
                  <span className="text-2xl">🎁</span>
                  <p className="text-sm font-bold uppercase tracking-tight">New users receive <span className="text-black font-black">2 FREE COINS</span></p>
                </div>
                <div className="flex items-center gap-4 bg-[#f5f5f7] p-6 rounded-[32px]">
                  <span className="text-2xl">🔓</span>
                  <p className="text-sm font-bold uppercase tracking-tight">1 Coin = Unlock 1 Vendor Contact</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panic Mode Section */}
          <div className="bg-red-500 rounded-[32px] md:rounded-[64px] p-8 md:p-24 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 text-[200px] opacity-10 rotate-12 transition-transform duration-1000 group-hover:rotate-45 group-hover:scale-110">🚨</div>
            <div className="relative z-10 max-w-2xl">
              <p className="font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-6 opacity-60">High Priority</p>
              <h2 className="text-2xl md:text-7xl font-black mb-6 md:mb-10 tracking-tighter leading-none uppercase italic">Panic Mode.</h2>
              <p className="text-base md:text-2xl font-medium mb-12 leading-relaxed opacity-90">
                Need a vendor urgently for a last-minute event or emergency replacement? Activate Panic Mode for maximum priority.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">The Logic</h4>
                  <p className="text-sm font-bold uppercase">Panic Mode costs 2 coins. marked as urgent. Vendors respond fast.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Best For</h4>
                  <p className="text-sm font-bold uppercase">Emergency rentals, same-day bookings, and birthday chaos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Planner Step 3 */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
            <div className="w-full md:w-1/2">
              <div className="bg-[#f5f5f7] aspect-square rounded-[60px] flex items-center justify-center text-[120px] md:text-[180px] apple-shadow">🗣️</div>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-6">Step 03</p>
              <h2 className="text-3xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">Talk & Book.</h2>
              <p className="text-lg md:text-xl text-[#86868b] font-medium leading-relaxed mb-8">
                Skip the platform noise. Jump straight to WhatsApp, negotiate your terms, and seal the deal. We provide the bridge; you build the relationship.
              </p>
              <div className="flex items-center gap-3 text-black opacity-40 italic font-black text-sm uppercase">
                <span className="w-8 h-[2px] bg-black"></span> 100% Direct Booking
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-40 animate-in slide-in-from-bottom-8 duration-700 text-right">
          {/* Vendor Step 1 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center text-left">
            <div className="w-full md:w-1/2">
              <div className="bg-black aspect-square rounded-[60px] flex items-center justify-center text-[120px] md:text-[180px] apple-shadow text-white">📸</div>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-6">Phase 01</p>
              <h2 className="text-2xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">Build Your Brand.</h2>
              <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed mb-8 text-right">
                Set up your professional listing with high-quality portfolio images and clear pricing. Only approved listings enter the protocol.
              </p>
              <div className="flex flex-wrap gap-3 justify-end leading-none">
                <span className="px-5 py-3 bg-[#f5f5f7] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Portfolio</span>
                <span className="px-5 py-3 bg-[#f5f5f7] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Business Name</span>
                <span className="px-5 py-3 bg-[#f5f5f7] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Location</span>
              </div>
            </div>
          </div>

          {/* Vendor Step 2 */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center text-left">
            <div className="w-full md:w-1/2 relative">
              <div className="bg-blue-600 aspect-square rounded-[60px] flex items-center justify-center text-[100px] md:text-[150px] apple-shadow text-white animate-pulse">FREE</div>
              <div className="absolute -top-10 -left-10 bg-white p-8 rounded-full apple-shadow border border-black/5 animate-bounce">
                <p className="text-4xl">🚀</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-6">Phase 02</p>
              <h2 className="text-2xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">30-Day Launch.</h2>
              <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed mb-8 text-left">
                Every vendor starts with a 30-day free trial. Direct client leads, maximum visibility, and zero risk while you build your pipeline.
              </p>
              <div className="border border-black/5 p-8 rounded-[40px] bg-white inline-block">
                <p className="text-4xl font-black text-black">0.00 <span className="text-sm uppercase tracking-widest text-[#86868b] ml-2">NGN during trial</span></p>
              </div>
            </div>
          </div>

          {/* Vendor Step 3 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center text-left">
            <div className="w-full md:w-1/2">
              <div className="bg-green-500 aspect-square rounded-[60px] flex items-center justify-center text-[120px] md:text-[180px] apple-shadow text-white italic font-black tracking-tighter">100%</div>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-6">Phase 03</p>
              <h2 className="text-2xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic text-right leading-none">Activate & Earn.</h2>
              <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed mb-8 text-right">
                Once trial ends, activate to remain visible. You keep 100% of your earnings—always. We take zero commission from your hard-earned booking fees.
              </p>
              <div className="flex justify-end italic font-black text-sm uppercase opacity-40">
                You handle the booking <span className="w-8 h-[2px] bg-black ml-3 self-center"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules & Logic Grid */}
      <section className="mt-60 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#f5f5f7] p-12 md:p-20 rounded-[64px] border border-black/5">
          <h3 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">Rules of Protocol</h3>
          <div className="space-y-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#86868b]">For Planners</p>
              <ul className="space-y-4 font-bold text-black uppercase text-sm italic">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Clear face profile photo required</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> No logos or celebrity photos</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Coins required to unlock contacts</li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#86868b]">For Vendors</p>
              <ul className="space-y-4 font-bold text-black uppercase text-sm italic">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Business logo or pro image only</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Fake listings are removed instantly</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> 30-day trial for new vendors</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-black p-12 md:p-20 rounded-[64px] text-white">
          <h3 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">Neutral Layer</h3>
          <p className="text-xl font-medium text-white/60 mb-12 leading-relaxed italic">
            "HoldMyBeer is a bridge, not a gatekeeper. We provide verified access; you provide the excellence."
          </p>
          <div className="space-y-8 border-t border-white/10 pt-10">
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[11px] font-black uppercase tracking-widest">Commission</span>
              <span className="text-2xl font-black">0%</span>
            </div>
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[11px] font-black uppercase tracking-widest">Negotiation</span>
              <span className="text-sm font-black italic uppercase">DIRECT & PRIVATE</span>
            </div>
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[11px] font-black uppercase tracking-widest">Interference</span>
              <span className="text-sm font-black italic uppercase">ZERO INTERFERENCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="mt-40 bg-zinc-900 rounded-[40px] md:rounded-[64px] p-8 md:p-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <h2 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-none">Ready for <br />Relief?</h2>
        <p className="text-white/40 mb-16 max-w-xl mx-auto font-medium text-lg md:text-2xl leading-relaxed italic">
          Find your first connection today and replace event chaos with structure.
        </p>
        <button
          onClick={() => window.location.hash = 'home'}
          className="w-full md:w-auto bg-white text-black font-black px-16 md:px-24 py-8 md:py-10 rounded-full text-xl md:text-2xl hover:scale-105 transition-all shadow-2xl uppercase tracking-tighter italic"
        >
          Enter the Protocol
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
