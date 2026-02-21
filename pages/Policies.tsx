
import React from 'react';

export const PrivacyPolicy: React.FC = () => (
  <div className="py-24 max-w-3xl mx-auto px-6 animate-in fade-in duration-700">
    <h1 className="text-6xl font-extrabold mb-12 uppercase tracking-tighter text-black leading-none">Privacy Policy</h1>
    <div className="prose prose-invert space-y-12">
      <p className="text-xl text-[#86868b] font-medium leading-relaxed">Your privacy is core to the HoldMyBeer experience. We operate with zero friction and maximum security across Nigeria.</p>
      
      <section>
        <h3 className="text-black font-extrabold text-2xl mb-4 tracking-tight uppercase">1. Expert & User Data</h3>
        <p className="text-[#86868b] leading-relaxed">We store only essential data required to bridge connections. Experts provide business details and portfolio samples, while users provide contact information necessary for authentication.</p>
      </section>

      <section>
        <h3 className="text-black font-extrabold text-2xl mb-4 tracking-tight uppercase">2. Access Control</h3>
        <p className="text-[#86868b] leading-relaxed">Your professional phone number and WhatsApp details remain locked until a direct "Handshake" fee is paid by a user. We do not sell or trade your data outside of this direct connection model.</p>
      </section>

      <section>
        <h3 className="text-black font-extrabold text-2xl mb-4 tracking-tight uppercase">3. Direct Communication</h3>
        <p className="text-[#86868b] leading-relaxed">HoldMyBeer is a connection layer. Once access is granted, communication happens directly between the parties involved. We do not track private chats or negotiations.</p>
      </section>
    </div>
  </div>
);

export const RefundPolicy: React.FC = () => (
  <div className="py-24 max-w-3xl mx-auto px-6 animate-in fade-in duration-700">
    <h1 className="text-6xl font-extrabold mb-12 uppercase tracking-tighter text-black leading-none">Refund Policy</h1>
    <div className="prose prose-invert space-y-12">
      <p className="text-xl text-[#86868b] font-medium leading-relaxed">HoldMyBeer provides instant access to expert connections. Because our service delivers digital access immediately, we follow a strict refund criteria.</p>
      
      <h3 className="text-black font-extrabold text-2xl tracking-tight uppercase">Valid Refund Scenarios</h3>
      <ul className="list-none space-y-6 text-[#86868b] font-medium">
        <li className="flex gap-4">
          <span className="text-black font-black">✓</span>
          <span><strong>Broken Link:</strong> The revealed WhatsApp link or phone number is permanently unreachable.</span>
        </li>
        <li className="flex gap-4">
          <span className="text-black font-black">✓</span>
          <span><strong>Inaccurate Profile:</strong> The professional revealed is entirely unrelated to the category listed.</span>
        </li>
        <li className="flex gap-4">
          <span className="text-black font-black">✓</span>
          <span><strong>Duplicate Charge:</strong> Technical errors resulting in multiple payments for a single unlock.</span>
        </li>
      </ul>
      <div className="bg-[#f5f5f7] p-10 rounded-[40px] border border-black/5 mt-16">
        <p className="text-black font-bold uppercase tracking-widest text-[12px] mb-4">Support Contact</p>
        <p className="text-[#86868b] italic">
          All refund requests must be submitted to support@holdmybeer.ng with your transaction ID within 12 hours of the unlock event.
        </p>
      </div>
    </div>
  </div>
);
