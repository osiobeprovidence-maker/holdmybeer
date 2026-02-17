
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="py-12 md:py-24 max-w-4xl mx-auto px-4 md:px-6 animate-in fade-in duration-700">
      <div className="text-center mb-20 md:mb-40">
        <h1 className="text-5xl md:text-9xl font-extrabold mb-6 md:mb-10 tracking-tighter text-black leading-[0.9]">How it works.</h1>
        <p className="text-lg md:text-2xl text-[#86868b] leading-relaxed max-w-2xl mx-auto font-medium">
          Three steps to the perfect event connection. <br />Decisive, fast, and neutral.
        </p>
      </div>

      <div className="space-y-32 md:space-y-64">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center px-4 md:px-0 text-center md:text-left">
          <div className="w-full md:w-1/2">
            <div className="bg-[#f5f5f7] aspect-square rounded-[40px] md:rounded-[60px] flex items-center justify-center text-[100px] md:text-[160px] apple-shadow">🔎</div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-black font-extrabold uppercase tracking-[0.4em] text-[11px] md:text-[13px] mb-4 md:mb-6">Step 01</p>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 md:mb-8 tracking-tighter text-black leading-none">Find your fit.</h2>
            <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed">
              Browse our city-based pool of verified DJs, Caterers, and Photographers. Use the urgency filter to find pros available for your birthday chaos or wedding emergency.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center px-4 md:px-0 text-center md:text-left">
          <div className="w-full md:w-1/2">
            <div className="bg-[#f5f5f7] aspect-square rounded-[40px] md:rounded-[60px] flex items-center justify-center text-[100px] md:text-[160px] apple-shadow">🔓</div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-black font-extrabold uppercase tracking-[0.4em] text-[11px] md:text-[13px] mb-4 md:mb-6">Step 02</p>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 md:mb-8 tracking-tighter text-black leading-none">Unlock Access.</h2>
            <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed">
              Pay a single, direct fee (Standard or Urgent) to instantly reveal the expert's verified Phone, Email, and WhatsApp details. No middleman, no complications.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center px-4 md:px-0 text-center md:text-left">
          <div className="w-full md:w-1/2">
            <div className="bg-[#f5f5f7] aspect-square rounded-[40px] md:rounded-[60px] flex items-center justify-center text-[100px] md:text-[160px] apple-shadow">🗣️</div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-black font-extrabold uppercase tracking-[0.4em] text-[11px] md:text-[13px] mb-4 md:mb-6">Step 03</p>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 md:mb-8 tracking-tighter text-black leading-none">Connect directly.</h2>
            <p className="text-base md:text-xl text-[#86868b] font-medium leading-relaxed">
              Jump straight to WhatsApp or call the professional. You negotiate the terms, you finalize the booking. We exit the process once the connection is made.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-32 md:mt-64 bg-black rounded-[40px] md:rounded-[80px] p-12 md:p-24 text-center text-white shadow-2xl mx-4 md:mx-0">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 md:mb-8 tracking-tighter">Ready for relief?</h2>
        <p className="text-white/60 mb-10 md:mb-16 max-w-sm md:max-w-md mx-auto font-medium text-lg md:text-xl leading-relaxed">Find your first connection today and replace event chaos with structure.</p>
        <button onClick={() => window.location.hash = 'home'} className="w-full md:w-auto bg-white text-black font-extrabold px-12 md:px-20 py-5 md:py-8 rounded-full text-lg md:text-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest">Start Discovery</button>
      </div>
    </div>
  );
};

export default HowItWorks;
