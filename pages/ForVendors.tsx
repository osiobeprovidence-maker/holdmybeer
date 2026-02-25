
import React from 'react';

const ForVendors: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
    return (
        <div className="pb-24 max-w-6xl mx-auto px-6 animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="text-center mb-32 md:mb-48 pt-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-black/5 rounded-full blur-3xl -z-10 animate-pulse" />
                <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter text-black leading-none uppercase italic">
                    Join the <br /><span className="text-[#86868b]">Protocol.</span>
                </h1>
                <p className="text-xl md:text-3xl text-black max-w-3xl mx-auto font-black leading-tight mb-12 uppercase italic tracking-tighter">
                    We don’t control your business. <br />We increase your visibility.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <button
                        onClick={() => onNavigate('auth')}
                        className="btn-apple px-12 py-6 text-xl uppercase italic tracking-tighter shadow-2xl scale-105 active:scale-95 transition-all"
                    >
                        Start 30-Day Free Trial
                    </button>
                </div>
            </section>

            {/* Why Join? Grid */}
            <section className="mb-40">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-12 text-center text-[#86868b]">Why Join HoldMyBeer?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#f5f5f7] p-12 rounded-[56px] border border-black/5 hover:scale-[1.02] transition-transform duration-500 group">
                        <div className="text-5xl mb-8 group-hover:rotate-12 transition-transform">📱</div>
                        <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase italic">Direct Access.</h3>
                        <p className="text-sm font-bold text-[#86868b] uppercase leading-relaxed">
                            No platform negotiation. No interference. Clients get your direct Phone and WhatsApp signals immediately.
                        </p>
                    </div>
                    <div className="bg-black text-white p-12 rounded-[56px] border border-white/5 shadow-2xl hover:scale-[1.02] transition-transform duration-500 group">
                        <div className="text-5xl mb-8 group-hover:scale-110 transition-transform text-white">₦</div>
                        <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase italic">100% Yours.</h3>
                        <p className="text-sm font-bold text-white/40 uppercase leading-relaxed text-white/60">
                            Zero commission. If you close a ₦500,000 job, you keep every single Naira. We take nothing from your deal.
                        </p>
                    </div>
                    <div className="bg-[#f5f5f7] p-12 rounded-[56px] border border-black/5 hover:scale-[1.02] transition-transform duration-500 group">
                        <div className="text-5xl mb-8 group-hover:-translate-y-2 transition-transform">🎯</div>
                        <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase italic text-right">High Intent.</h3>
                        <p className="text-sm font-bold text-[#86868b] uppercase leading-relaxed text-right">
                            Clients must use coins to unlock you. No time-wasters. No window shoppers. Only serious leads ready to book.
                        </p>
                    </div>
                </div>
            </section>

            {/* How it Works for Vendors */}
            <section className="space-y-40 mb-40">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
                    <div className="w-full md:w-1/2">
                        <div className="bg-zinc-100 aspect-square rounded-[64px] flex items-center justify-center text-[120px] md:text-[180px] apple-shadow relative group">
                            📸
                            <div className="absolute top-10 right-10 bg-white p-6 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">✨</div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <p className="text-black font-black uppercase tracking-[0.4em] text-[12px] mb-6 opacity-40">Step 01</p>
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">Create Your <br />Listing.</h2>
                        <ul className="space-y-4 font-bold text-[#86868b] uppercase text-sm italic">
                            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Business name & Category</li>
                            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Starting price range</li>
                            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Portfolio Images</li>
                            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-black rounded-full"></span> Clear Logo or Photo</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center">
                    <div className="w-full md:w-1/2">
                        <div className="bg-blue-600 aspect-square rounded-[64px] flex items-center justify-center text-[120px] md:text-[180px] text-white italic font-black apple-shadow relative overflow-hidden group">
                            30
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 text-right">
                        <p className="text-black font-black uppercase tracking-[0.4em] text-[12px] mb-6 opacity-40">Step 02</p>
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic leading-none">Free Trial <br />Launch.</h2>
                        <p className="text-xl text-[#86868b] font-medium leading-relaxed mb-6 italic">
                            Every vendor gets 30 days of full protocol invisibility. Unlimited lead potential. Zero payment required while you scale.
                        </p>
                        <div className="inline-block bg-[#f5f5f7] px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest leading-none">0.00 NGN to start</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
                    <div className="w-full md:w-1/2">
                        <div className="bg-black aspect-square rounded-[64px] flex items-center justify-center text-[120px] md:text-[180px] text-white apple-shadow">🔓</div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <p className="text-black font-black uppercase tracking-[0.4em] text-[12px] mb-6 opacity-40">Step 03</p>
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-black leading-none uppercase italic">Activate & <br />Maintain.</h2>
                        <p className="text-xl text-[#86868b] font-medium leading-relaxed mb-6 italic">
                            Activate your listing after 30 days to remain public. Secure your spot in the retrieval layer and access premium boost features.
                        </p>
                        <div className="flex items-center gap-3 text-black opacity-30 italic font-black text-sm uppercase">
                            <span className="w-8 h-[2px] bg-black"></span> Professional Longevity
                        </div>
                    </div>
                </div>
            </section>

            {/* Boost Options */}
            <section className="bg-amber-400 rounded-[64px] p-12 md:p-24 mb-40 text-black relative overflow-hidden group">
                <div className="absolute -top-10 right-0 p-12 text-[200px] opacity-10 rotate-12 group-hover:scale-110 transition-transform">⚡️</div>
                <div className="relative z-10 max-w-3xl">
                    <p className="font-black uppercase tracking-[0.4em] text-[12px] mb-6 opacity-60">Optional Edge</p>
                    <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-none uppercase italic">Boost <br />The Signal.</h2>
                    <p className="text-xl md:text-2xl font-black mb-12 leading-tight uppercase tracking-tight italic">
                        Want more eyes? Boosting is completely optional but designed to prioritize your profile across the network.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/5 backdrop-blur-md p-8 rounded-[40px] border border-black/10">
                            <p className="text-lg font-black uppercase italic mb-2">Priority Search</p>
                            <p className="text-sm font-bold uppercase opacity-60 italic">Appear higher in category results.</p>
                        </div>
                        <div className="bg-black/5 backdrop-blur-md p-8 rounded-[40px] border border-black/10">
                            <p className="text-lg font-black uppercase italic mb-2">Visual Contrast</p>
                            <p className="text-sm font-bold uppercase opacity-60 italic">Stand out in a crowded market.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Requirements & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-40">
                <div className="bg-zinc-900 p-12 md:p-20 rounded-[64px] text-white">
                    <h3 className="text-4xl font-black mb-12 tracking-tighter uppercase italic">Quality Codes</h3>
                    <ul className="space-y-10">
                        <li className="flex gap-6 items-start">
                            <div className="text-3xl">👤</div>
                            <div>
                                <p className="text-lg font-black uppercase italic mb-2">Clear Face or Photo</p>
                                <p className="text-sm font-medium text-white/40 uppercase tracking-tight leading-relaxed">No cartoons, celebrity photos, or generic assets. Real identity only.</p>
                            </div>
                        </li>
                        <li className="flex gap-6 items-start">
                            <div className="text-3xl">📊</div>
                            <div>
                                <p className="text-lg font-black uppercase italic mb-2">Accurate Pricing</p>
                                <p className="text-sm font-medium text-white/40 uppercase tracking-tight leading-relaxed">Provide real starting price ranges to ensure leads are aligned with your value.</p>
                            </div>
                        </li>
                        <li className="flex gap-6 items-start">
                            <div className="text-3xl">🛡️</div>
                            <div>
                                <p className="text-lg font-black uppercase italic mb-2">Zero Fake Policy</p>
                                <p className="text-sm font-medium text-white/40 uppercase tracking-tight leading-relaxed">Low-quality or misleading listings are removed instantly from the protocol.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-[#f5f5f7] p-12 md:p-20 rounded-[64px] border border-black/5">
                    <h3 className="text-4xl font-black mb-12 tracking-tighter uppercase italic leading-none">Who Should <br />Join?</h3>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                        {['DJs', 'Caterers', 'Decorators', 'Makeup Artists', 'Ushers', 'MCs', 'Ice Truck Owners', 'Rental Services'].map((cat) => (
                            <div key={cat} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                <span className="text-sm font-black uppercase italic">{cat}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 pt-12 border-t border-black/5">
                        <p className="text-xl font-black tracking-tight uppercase italic mb-4 text-black/40">The Different Edge</p>
                        <p className="text-sm font-bold uppercase italic text-black/60 leading-relaxed">
                            Built specifically for Nigerian event culture. We understand the speed, the noise, and the need for direct, authenticated connections.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <section className="text-center py-24 bg-black rounded-[64px] text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter uppercase italic leading-none">Ready to <br />Launch?</h2>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <button
                        onClick={() => onNavigate('auth')}
                        className="bg-white text-black px-16 py-8 rounded-full text-xl font-black uppercase italic tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                        Create Vendor Profile
                    </button>
                    <button
                        onClick={() => onNavigate('auth')}
                        className="bg-transparent border-2 border-white/20 px-16 py-8 rounded-full text-xl font-black uppercase italic tracking-tighter hover:border-white transition-all"
                    >
                        Start Free Trial
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ForVendors;
