
import React from 'react';

const Pricing: React.FC = () => {
  return (
    <div className="pb-24 max-w-5xl mx-auto px-6 animate-in fade-in duration-700">
      <div className="text-center mb-16 md:mb-24">
        <p className="text-[12px] md:text-[14px] font-bold text-black/40 uppercase tracking-[0.4em] mb-6">Access Fees</p>
        <h1 className="text-5xl md:text-9xl font-extrabold mb-8 tracking-tighter text-black uppercase">Pricing</h1>
        <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-tight">
          Direct connection fees. No middleman. No sub-balances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="apple-card p-8 md:p-12 apple-shadow flex flex-col items-center text-center">
          <h3 className="text-xl font-extrabold mb-4 text-black tracking-tight uppercase text-center w-full">5 Coins</h3>
          <p className="text-4xl font-extrabold text-black mb-6 tracking-tighter">₦5,000</p>
          <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-[0.2em] mb-8">Starter Pack</p>
          <div className="w-full h-px bg-black/5 mb-8"></div>
          <p className="text-[10px] font-bold text-black uppercase tracking-widest">₦1,000 per coin</p>
        </div>

        <div className="apple-card p-8 md:p-12 apple-shadow flex flex-col items-center text-center border-2 border-black relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em]">Value Pack</div>
          <h3 className="text-xl font-extrabold mb-4 text-black tracking-tight uppercase text-center w-full">10 Coins</h3>
          <p className="text-4xl font-extrabold text-black mb-6 tracking-tighter">₦9,000</p>
          <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-[0.2em] mb-8">Most Popular</p>
          <div className="w-full h-px bg-black/5 mb-8"></div>
          <p className="text-[10px] font-bold text-black uppercase tracking-widest">₦900 per coin</p>
        </div>

        <div className="apple-card p-8 md:p-12 apple-shadow flex flex-col items-center text-center">
          <h3 className="text-xl font-extrabold mb-4 text-black tracking-tight uppercase text-center w-full">20 Coins</h3>
          <p className="text-4xl font-extrabold text-black mb-6 tracking-tighter">₦16,000</p>
          <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-[0.2em] mb-8">Pro Pack</p>
          <div className="w-full h-px bg-black/5 mb-8"></div>
          <p className="text-[10px] font-bold text-black uppercase tracking-widest">₦800 per coin</p>
        </div>
      </div>

      <div className="apple-card p-8 md:p-16 apple-shadow mb-12 bg-[#f5f5f7]">
        <h3 className="text-2xl font-extrabold mb-12 text-black tracking-tight uppercase text-center">Coin Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl mb-4">🤝</span>
            <p className="text-2xl font-black mb-2 uppercase tracking-tighter">1 Coin</p>
            <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-[0.2em]">Standard Handshake</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl mb-4">🚨</span>
            <p className="text-2xl font-black mb-2 uppercase tracking-tighter text-red-500">2 Coins</p>
            <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-[0.2em]">Panic Mode (Urgent)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="apple-card p-10 md:p-16 apple-shadow bg-black text-white flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">🏷️</div>
          <div className="bg-white/10 text-white text-[10px] md:text-[11px] font-black uppercase px-4 py-1.5 self-start mb-10 rounded-full tracking-[0.3em]">Phase 1: Early Bird</div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight uppercase">Pre-Launch Pro</h3>
          <p className="text-white/60 mb-12 text-sm font-bold uppercase tracking-widest leading-relaxed">Reserve your spot among the founding 200 specialists.</p>
          <div className="mt-auto">
            <p className="text-5xl md:text-6xl font-extrabold text-white mb-2 tracking-tighter">₦7,000</p>
            <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em] mb-12">Yearly Sub (30-Day Free Trial)</p>
            <ul className="space-y-6 text-[11px] text-white/80 font-black uppercase tracking-widest">
              <li className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white text-black flex items-center justify-center rounded-full text-[8px]">✓</div>
                First 200 Users Only
              </li>
              <li className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white text-black flex items-center justify-center rounded-full text-[8px]">✓</div>
                Extended 30-Day Access
              </li>
              <li className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white text-black flex items-center justify-center rounded-full text-[8px]">✓</div>
                Verified Founding Status
              </li>
            </ul>
          </div>
        </div>

        <div className="apple-card p-10 md:p-16 apple-shadow bg-[#f5f5f7] flex flex-col">
          <div className="bg-black/5 text-black/40 text-[10px] md:text-[11px] font-black uppercase px-4 py-1.5 self-start mb-10 rounded-full tracking-[0.3em]">Phase 2: Main Stage</div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight uppercase text-black">Standard Pro</h3>
          <p className="text-black/40 mb-12 text-sm font-bold uppercase tracking-widest leading-relaxed">Full access for established event professionals.</p>
          <div className="mt-auto">
            <p className="text-5xl md:text-6xl font-extrabold text-black mb-2 tracking-tighter">₦10,000</p>
            <p className="text-[11px] text-black/20 font-bold uppercase tracking-[0.2em] mb-12">Yearly Sub (7-Day Trial)</p>
            <ul className="space-y-6 text-[11px] text-black/60 font-black uppercase tracking-widest">
              <li className="flex items-center gap-4">
                <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-full text-[8px]">✓</div>
                Priority Search Result
              </li>
              <li className="flex items-center gap-4">
                <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-full text-[8px]">✓</div>
                Full Analytics Dashboard
              </li>
              <li className="flex items-center gap-4">
                <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-full text-[8px]">✓</div>
                Verified Badge Support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
