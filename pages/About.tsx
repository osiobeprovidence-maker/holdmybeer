
import React from 'react';

const About: React.FC = () => {
    return (
        <div className="pb-24 max-w-6xl mx-auto px-6 animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="text-center mb-32 md:mb-48 pt-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-black/5 rounded-full blur-3xl -z-10 animate-pulse" />
                <h1 className="text-4xl md:text-9xl font-black mb-10 tracking-tighter text-black leading-none uppercase italic">
                    Removing <br /><span className="text-[#86868b]">Friction.</span>
                </h1>
                <p className="text-lg md:text-2xl lg:text-3xl text-black max-w-3xl mx-auto font-black leading-tight mb-12 uppercase italic tracking-tighter">
                    HoldMyBeer is Nigeria's elite expert retrieval layer. <br />We built it because planning events was too hard.
                </p>
            </section>

            {/* The Problem Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-center">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-6 text-[#86868b]">The Problem We Saw</p>
                    <h2 className="text-3xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">Exciting. <br />Until it isn't.</h2>
                    <p className="text-xl text-[#86868b] font-medium leading-relaxed italic mb-8">
                        You call one vendor — no response. You check Instagram — price changes. You hear "I know someone" — but that someone knows someone else.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100">
                            <span className="text-2xl">🛑</span>
                            <p className="text-sm font-bold uppercase tracking-tight text-red-900">Too many middlemen</p>
                        </div>
                        <div className="flex items-center gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100">
                            <span className="text-2xl">🛑</span>
                            <p className="text-sm font-bold uppercase tracking-tight text-red-900">Too much uncertainty</p>
                        </div>
                        <div className="flex items-center gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100">
                            <span className="text-2xl">🛑</span>
                            <p className="text-sm font-bold uppercase tracking-tight text-red-900">Too much stress</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#f5f5f7] aspect-square rounded-[64px] flex items-center justify-center text-[150px] md:text-[200px] apple-shadow relative group overflow-hidden">
                    🤯
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-black uppercase tracking-widest text-black/40">The Stress Layer</p>
                    </div>
                </div>
            </section>

            {/* Why We Built & Core Identity */}
            <section className="bg-black rounded-[64px] p-12 md:p-24 mb-40 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 text-[300px] opacity-5 -rotate-12 translate-x-1/2 translate-y-1/2">🍺</div>
                <div className="relative z-10">
                    <p className="font-black uppercase tracking-[0.4em] text-[12px] mb-8 opacity-40">The Mission</p>
                    <h2 className="text-3xl md:text-8xl font-black mb-12 tracking-tighter leading-none uppercase italic">We Fixed <br />One Thing. <br /><span className="text-white/40">Access.</span></h2>
                    <p className="text-xl md:text-2xl font-medium mb-16 max-w-2xl leading-relaxed text-white/60 italic">
                        HoldMyBeer was created to remove the noise. Not booking management, not commission-based control, not interference. Just clean, direct access.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">The Platform Logic</h4>
                            <ul className="space-y-6 font-bold text-white uppercase text-sm italic">
                                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Planners discover real vendors</li>
                                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Vendors get serious clients</li>
                                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white rounded-full"></span> Direct communication flow</li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-xl md:text-3xl font-black italic uppercase leading-none text-white/20 underline decoration-white/10">ZERO PLATFORM INTERFERENCE.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Makes Us Different Grid */}
            <section className="mb-40">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-12 text-center text-[#86868b]">What Makes Us Different</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-[#f5f5f7] p-12 rounded-[56px] border border-black/5 group hover:bg-black hover:text-white transition-all duration-700">
                        <h3 className="text-xl font-black mb-6 tracking-tighter uppercase italic">No Commissions.</h3>
                        <p className="text-sm font-bold uppercase opacity-60 group-hover:opacity-100">Most platforms take a cut. We don't. Deals remain 100% yours.</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-12 rounded-[56px] border border-black/5 group hover:bg-black hover:text-white transition-all duration-700">
                        <h3 className="text-xl font-black mb-6 tracking-tighter uppercase italic">No Control.</h3>
                        <p className="text-sm font-bold uppercase opacity-60 group-hover:opacity-100">We don't manage your bookings. We just provide the bridge.</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-12 rounded-[56px] border border-black/5 group hover:bg-black hover:text-white transition-all duration-700">
                        <h3 className="text-xl font-black mb-6 tracking-tighter uppercase italic">No Guessing.</h3>
                        <p className="text-sm font-bold uppercase opacity-60 group-hover:opacity-100">Transparent price ranges shown upfront. No hiding behind forms.</p>
                    </div>
                </div>
            </section>

            {/* Heritage & Values */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-40">
                <div className="bg-[#f8f8f8] p-12 md:p-20 rounded-[64px] border border-black/5">
                    <h3 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">Built for <br />Nigeria.</h3>
                    <p className="text-lg font-medium text-[#86868b] mb-12 leading-relaxed italic">
                        Weddings, Birthdays, Corporate events, Concerts, Private parties. We understand how events work here. Last-minute happens. Budgets shift. Urgency is real.
                    </p>
                    <div className="flex flex-wrap gap-4 opacity-40">
                        <span className="text-[10px] font-black uppercase tracking-widest border border-black px-4 py-2 rounded-full">Panic Mode</span>
                        <span className="text-[10px] font-black uppercase tracking-widest border border-black px-4 py-2 rounded-full">Real-Time</span>
                    </div>
                </div>

                <div className="bg-zinc-900 p-12 md:p-20 rounded-[64px] text-white">
                    <h3 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">Our Standard</h3>
                    <ul className="space-y-6 font-bold text-white/60 uppercase text-xs italic">
                        <li className="flex items-center gap-3">✓ Professional listings only</li>
                        <li className="flex items-center gap-3">✓ Clear profile guidelines</li>
                        <li className="flex items-center gap-3">✓ Transparent pricing</li>
                        <li className="flex items-center gap-3">✓ No fake vendors</li>
                        <li className="flex items-center gap-3">✓ No hidden fees</li>
                    </ul>
                    <p className="mt-12 text-sm font-black text-white uppercase italic">Trust is not optional.</p>
                </div>
            </div>

            {/* Vision & Call to Action */}
            <section className="text-center py-24 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-10 text-[#86868b]">Our Vision</p>
                <h2 className="text-3xl md:text-8xl font-black mb-12 tracking-tighter uppercase italic leading-none max-w-4xl mx-auto">
                    The most <span className="text-[#86868b]">trusted</span> retrieval layer in Nigeria.
                </h2>
                <p className="text-lg md:text-2xl text-black font-medium max-w-2xl mx-auto italic mb-16 opacity-60">
                    Not the loudest. Not the flashiest. The most reliable.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <button
                        onClick={() => window.location.hash = 'discovery'}
                        className="btn-apple px-20 py-8 text-2xl uppercase tracking-tighter italic"
                    >
                        Find. Connect. Book.
                    </button>
                </div>
            </section>
        </div>
    );
};

export default About;
