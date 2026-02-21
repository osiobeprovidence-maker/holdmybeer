
import React from 'react';

const Services: React.FC = () => {
  return (
    <div className="py-20 max-w-6xl mx-auto px-6">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter italic">Infrastructure For Events</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          We don't just find vendors. We build the layer that makes event planning in Nigeria reliable, even if you're thousands of miles away.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <div key={i} className="glass p-12 rounded-[3rem] border-white/5 hover:border-amber-500/20 transition-all">
            <div className="text-5xl mb-6">{s.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
