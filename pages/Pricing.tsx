
import React from 'react';

const Pricing: React.FC = () => {
  return (
    <div className="py-24 max-w-5xl mx-auto px-6 animate-in fade-in duration-700">
      <div className="text-center mb-24">
        <p className="text-[14px] font-bold text-black/40 uppercase tracking-[0.4em] mb-6">Access Fees</p>
        <h1 className="text-6xl md:text-9xl font-extrabold mb-8 tracking-tighter text-black uppercase">Pricing</h1>
        <p className="text-2xl text-[#86868b] max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-tight">
          Direct connection fees. No middleman. No sub-balances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="apple-card p-16 apple-shadow flex flex-col">
          <h3 className="text-3xl font-extrabold mb-8 text-black tracking-tight uppercase">Standard Handshake</h3>
          <p className="text-[#86868b] mb-12 text-lg font-bold uppercase tracking-widest leading-relaxed opacity-60">Instant access to a verified expert's contact signals.</p>
          <div className="mt-auto">
            <p className="text-7xl font-extrabold text-black mb-2 tracking-tighter">₦2,500</p>
            <p className="text-[13px] text-[#86868b] font-bold uppercase tracking-[0.3em] mb-12">One-Time Access Fee</p>
            <ul className="space-y-6 text-[14px] text-black font-black uppercase tracking-widest">
              <li className="flex items-center gap-4">
                <div className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-full text-[10px]">✓</div>
                Direct WhatsApp
              </li>
              <li className="flex items-center gap-4">
                <div className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-full text-[10px]">✓</div>
                Verified Mobile
              </li>
              <li className="flex items-center gap-4">
                <div className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-full text-[10px]">✓</div>
                Direct Handshake
              </li>
            </ul>
          </div>
        </div>

        <div className="apple-card p-16 apple-shadow bg-black text-white flex flex-col scale-[1.03]">
          <div className="bg-white/10 text-white text-[11px] font-bold uppercase px-4 py-1.5 self-start mb-10 rounded-full tracking-[0.3em]">For Experts</div>
          <h3 className="text-3xl font-extrabold mb-8 tracking-tight uppercase">Priority Hub</h3>
          <p className="text-white/60 mb-12 text-lg font-bold uppercase tracking-widest leading-relaxed">Secure your positioning in the expert retrieval list.</p>
          <div className="mt-auto">
            <p className="text-7xl font-extrabold text-white mb-2 tracking-tighter">₦15,000</p>
            <p className="text-[13px] text-white/40 font-bold uppercase tracking-[0.3em] mb-12">Monthly Presence Fee</p>
            <ul className="space-y-6 text-[14px] text-white/80 font-black uppercase tracking-widest">
              <li className="flex items-center gap-4">
                <div className="w-5 h-5 bg-white text-black flex items-center justify-center rounded-full text-[10px]">✓</div>
                Verified Badge
              </li>
              <li className="flex items-center gap-4">
                <div className="w-5 h-5 bg-white text-black flex items-center justify-center rounded-full text-[10px]">✓</div>
                Top Tier Search
              </li>
              <li className="flex items-center gap-4">
                <div className="w-5 h-5 bg-white text-black flex items-center justify-center rounded-full text-[10px]">✓</div>
                Direct Leads
              </li>
            </ul>
            <button className="w-full bg-white text-black font-black py-6 rounded-full mt-12 transition-all hover:scale-105 shadow-xl text-lg uppercase tracking-[0.3em]">Join List</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
