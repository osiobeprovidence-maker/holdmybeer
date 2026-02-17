
import React from 'react';

const Services: React.FC = () => {
  return (
    <div className="py-12 md:py-20 max-w-6xl mx-auto px-4 md:px-6">
      <div className="text-center mb-12 md:mb-20">
        <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 uppercase tracking-tighter italic leading-none">Infrastructure For Events</h1>
        <p className="text-lg md:text-xl text-[#86868b] max-w-3xl mx-auto font-medium">
          We don't just find vendors. We build the layer that makes event planning in Nigeria reliable, even if you're thousands of miles away.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {[
          {
            title: "Remote Planning",
            icon: "🌍",
            desc: "Flying in from overseas? We are your boots on the ground. Find every service you need for a surprise party or wedding from one central hub."
          },
          {
            title: "Panic Mode (Rescue)",
            icon: "🚨",
            desc: "Plans fell apart? One of your hires fled? Our rescue mode filters for pros who are verified and ready to show up in less than 24 hours."
          },
          {
            title: "Verified Access",
            icon: "🛡️",
            desc: "Stop chasing social media profiles. We sell direct access to verified pros. Pay a small fee, get their WhatsApp, and get to work."
          }
        ].map((s, i) => (
          <div key={i} className="bg-white p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-black/5 apple-shadow transition-all group hover:bg-[#f5f5f7]">
            <div className="text-4xl md:text-5xl mb-6">{s.icon}</div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-tight">{s.title}</h3>
            <p className="text-[#86868b] leading-relaxed text-sm font-medium">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
