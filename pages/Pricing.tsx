
import React, { useState } from 'react';

const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'vendors'>('users');

  return (
    <div className="pb-24 max-w-6xl mx-auto px-6 animate-in fade-in duration-700">
      {/* Header */}
      <section className="text-center mb-16 md:mb-32 pt-10">
        <h1 className="text-4xl md:text-9xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">
          Pricing.
        </h1>
        <p className="text-base md:text-2xl lg:text-3xl text-[#86868b] max-w-2xl mx-auto font-bold leading-tight uppercase tracking-tighter">
          Simple. Transparent. <br /><span className="text-black">No Subscriptions.</span>
        </p>
      </section>

      {/* Pricing Switcher */}
      <div className="flex justify-center mb-20">
        <div className="bg-[#f5f5f7] p-2 rounded-[24px] md:rounded-[40px] flex gap-2 shadow-sm border border-black/5">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 md:px-16 py-3 md:py-5 rounded-[20px] md:rounded-[32px] text-[10px] md:text-[14px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-black text-white shadow-2xl scale-105' : 'text-[#86868b] hover:text-black'}`}
          >
            For Planners
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-6 md:px-16 py-3 md:py-5 rounded-[20px] md:rounded-[32px] text-[10px] md:text-[14px] font-black uppercase tracking-widest transition-all ${activeTab === 'vendors' ? 'bg-black text-white shadow-2xl scale-105' : 'text-[#86868b] hover:text-black'}`}
          >
            For Professionals
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          {/* User Section 1: The Starter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-4 bg-[#f5f5f7] p-8 md:p-12 rounded-[40px] md:rounded-[56px] flex flex-col justify-center border border-black/5 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 text-[120px] md:text-[180px] opacity-5 group-hover:rotate-12 transition-transform duration-1000">🎁</div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-[#86868b]">The Protocol Entry</p>
              <h3 className="text-2xl md:text-4xl font-black mb-8 tracking-tighter uppercase italic leading-none">Free <br />Starter.</h3>
              <p className="text-sm font-bold uppercase mb-8 opacity-60">Every new user gets a boosted start on the protocol.</p>
              <div className="bg-white p-6 rounded-[32px] border border-black/5">
                <p className="text-3xl font-black text-black">2 COINS</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">Available Instantly</p>
              </div>
            </div>

            <div className="lg:col-span-8 bg-black p-8 md:p-16 rounded-[40px] md:rounded-[56px] text-white flex flex-col justify-center border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 text-[100px] md:text-[150px] opacity-10">🔓</div>
              <h3 className="text-2xl md:text-5xl font-black mb-10 tracking-tighter uppercase italic">What Coins Do?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">1</div>
                  <div>
                    <p className="text-lg font-black uppercase italic mb-2">1 Coin = 1 Unlock</p>
                    <p className="text-sm font-medium text-white/40 uppercase tracking-tight">Access verified phone numbers and direct WhatsApp signals.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 font-black text-red-500 italic">!</div>
                  <div>
                    <p className="text-lg font-black uppercase italic mb-2 text-red-500">Panic Mode = 2 Coins</p>
                    <p className="text-sm font-medium text-white/40 uppercase tracking-tight">Signal absolute urgency to the expert network.</p>
                  </div>
                </div>
              </div>
              <p className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Coins Never Expire • No Recurring Fees • Buy Once</p>
            </div>
          </div>

          {/* User Section 2: Coin Packages */}
          <div className="mb-20">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] mb-10 text-center text-[#86868b]">Coin Packages</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter Pack */}
              <div className="bg-white p-12 rounded-[48px] border border-black/5 apple-shadow hover:scale-[1.02] transition-all group">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-black/40">Base Package</p>
                <h3 className="text-2xl font-black mb-8 tracking-tighter uppercase italic">Single Unlock</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-3xl md:text-5xl font-black tracking-tighter text-black">₦200</span>
                  <span className="text-[10px] md:text-sm font-bold text-[#86868b] uppercase">/ 1 Coin</span>
                </div>
                <div className="w-full h-[2px] bg-black/5 mb-8"></div>
                <p className="text-[11px] font-black uppercase tracking-widest text-black/40">Quick single contact</p>
              </div>

              {/* Package 2 */}
              <div className="bg-[#f5f5f7] p-12 rounded-[48px] border border-black/5 flex flex-col justify-center items-center text-center">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4">Value Pack</p>
                <p className="text-3xl font-black text-black italic">₦2,000</p>
                <p className="text-sm font-bold uppercase tracking-tight text-[#86868b] mt-2">10 COINS</p>
              </div>

              {/* Package 3 */}
              <div className="bg-black p-12 rounded-[48px] border border-white/5 flex flex-col justify-center items-center text-center text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-[60px] opacity-10 rotate-12">🔥</div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-white/50">Pro Pack</p>
                <p className="text-3xl font-black italic">₦4,000</p>
                <p className="text-sm font-bold uppercase tracking-tight text-white/60 mt-2">23 COINS</p>
                <span className="mt-4 px-4 py-1.5 bg-red-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest">+3 Bonus Coins</span>
              </div>
            </div>
          </div>

          {/* User Section 3: Panic Mode Detail */}
          <div className="bg-red-500 rounded-[56px] p-12 md:p-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-[200px] opacity-10 animate-pulse">🚨</div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic leading-none">Panic Mode.</h2>
              <p className="text-lg md:text-2xl font-medium mb-12 leading-relaxed opacity-90 uppercase tracking-tight">
                Need a vendor urgently for same-day chaos or emergency replacement? Panic mode signals the network you are ready to book NOW.
              </p>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20 inline-block">
                <p className="text-3xl font-black uppercase italic">2 Coins</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* Vendor Trial */}
            <div className="bg-zinc-900 p-6 md:p-20 rounded-[32px] md:rounded-[56px] text-white flex flex-col relative overflow-hidden group">
              <div className="absolute -bottom-6 -right-6 text-[80px] md:text-[200px] opacity-10 group-hover:scale-110 transition-transform duration-1000">🎉</div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-white/40">The Professional Start</p>
              <h3 className="text-xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic leading-none">14-Day <br />Free Trial.</h3>
              <p className="text-sm md:text-lg font-medium text-white/60 mb-8 uppercase tracking-tight italic">
                Full visibility. Access to all leads. Direct connects. Zero payment required to start your journey.
              </p>
              <div className="mt-auto flex items-center gap-4">
                <span className="px-6 py-3 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-widest">Visibility Active</span>
                <span className="px-6 py-3 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-widest">Verified Leads</span>
              </div>
            </div>

            {/* Vendor Activation */}
            <div className="bg-[#f5f5f7] p-6 md:p-20 rounded-[32px] md:rounded-[56px] border border-black/5 flex flex-col relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-6 text-[80px] md:text-[150px] opacity-5">🔓</div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-[#86868b]">Post-Trial Protocol</p>
              <h3 className="text-xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic leading-none">Activate <br />Your Spot.</h3>
              <p className="text-sm md:text-lg font-medium text-black/60 mb-10 uppercase tracking-tight italic">
                To remain visible and accessible to event planners after 14 days, maintain an active listing.
              </p>

              <div className="space-y-4 mb-12">
                <div className="bg-white p-8 rounded-[40px] border border-black/5 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-black uppercase italic">Annual Activation</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">365 Days Access</p>
                  </div>
                  <p className="text-2xl font-black italic uppercase">₦15,000</p>
                </div>
              </div>

              <p className="text-[11px] font-black uppercase tracking-widest text-black/40">You keep 100% of your earnings. No Commission.</p>
            </div>
          </div>
        </div>
      )}

      {/* Logic Grid */}
      <section className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black p-8 md:p-20 rounded-[40px] md:rounded-[64px] text-white">
          <h3 className="text-2xl md:text-4xl font-black mb-10 tracking-tighter uppercase italic">Clarifications</h3>
          <ul className="space-y-8">
            <li className="flex gap-6 items-start">
              <span className="w-1.5 h-1.5 bg-white rounded-full mt-2"></span>
              <div>
                <p className="text-sm font-black uppercase italic">Zero Commission</p>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-tight">We take nothing from your booking fee. The deal is 100% yours.</p>
              </div>
            </li>
            <li className="flex gap-6 items-start">
              <span className="w-1.5 h-1.5 bg-white rounded-full mt-2"></span>
              <div>
                <p className="text-sm font-black uppercase italic">One-Time Purchases</p>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-tight">Coins are bought as needed. No recurring credit card bills.</p>
              </div>
            </li>
            <li className="flex gap-6 items-start">
              <span className="w-1.5 h-1.5 bg-white rounded-full mt-2"></span>
              <div>
                <p className="text-sm font-black uppercase italic">Direct Interface</p>
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-tight">Pay only for the connection signal. Everything else is private.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-[#f5f5f7] p-8 md:p-20 rounded-[40px] md:rounded-[64px] border border-black/5">
          <h3 className="text-2xl md:text-4xl font-black mb-10 tracking-tighter uppercase italic leading-none">Why this works.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase italic">NO</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">Hidden Recurring Fees</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase italic">100%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">Earnings Retention</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase italic">DIRECT</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">Client to Vendor Flow</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase italic">ZERO</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">Middleman Cuts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="mt-40 text-center px-4">
        <h2 className="text-2xl md:text-4xl font-black mb-8 tracking-tighter uppercase italic leading-tight">Simple Access. <span className="opacity-20 block md:inline">No mess.</span></h2>
        <button
          onClick={() => window.location.hash = 'discovery'}
          className="btn-apple px-12 md:px-20 py-6 md:py-8 text-lg md:text-2xl uppercase tracking-tighter italic w-full md:w-auto"
        >
          Enter the Protocol
        </button>
      </div>
    </div>
  );
};

export default Pricing;
