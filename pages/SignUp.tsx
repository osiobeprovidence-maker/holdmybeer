
import React, { useState } from 'react';
import { User, Location } from '../types';
import { supabase } from '../services/supabaseClient';

interface SignUpProps {
    onLogin: (user: User, isNewUser?: boolean) => void;
    onNavigate: (view: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'info' | 'code'>('info');
    const [code, setCode] = useState('');

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (supabase) {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    data: { name },
                }
            });
            if (error) {
                alert(error.message);
                setLoading(false);
                return;
            }
        } else {
            await new Promise(r => setTimeout(r, 1500));
        }

        setLoading(false);
        setStep('code');
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (supabase) {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: code,
                type: 'email'
            });

            if (error) {
                alert(error.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
                const isNewUser = !profile || (profile.coins || 0) === 0;
                const startingCoins = isNewUser ? 2 : (profile?.coins || 0);

                const loggedInUser: User = profile ? {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    isCreator: profile.is_creator,
                    location: profile.location,
                    kycVerified: profile.kyc_verified,
                    kycStatus: profile.kyc_status,
                    avatar: profile.avatar,
                    totalUnlocks: profile.total_unlocks,
                    isSuspended: profile.is_suspended,
                    reliabilityScore: profile.reliability_score || 70,
                    coins: startingCoins
                } : {
                    id: data.user.id,
                    name: name || data.user.user_metadata?.name || 'Expert Client',
                    email: data.user.email || email,
                    isCreator: false,
                    location: Location.LAGOS_ISLAND,
                    kycVerified: false,
                    kycStatus: 'unverified',
                    avatar: `https://ui-avatars.com/api/?name=${name || 'Expert'}&background=000&color=fff`,
                    coins: 2
                };

                // Credit 2 coins if new user
                if (isNewUser && supabase) {
                    await supabase.from('profiles').upsert({
                        id: loggedInUser.id,
                        coins: 2
                    });
                }

                onLogin(loggedInUser, isNewUser);
            }
        } else {
            setTimeout(() => {
                onLogin({
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    email,
                    isCreator: false,
                    location: Location.LAGOS_ISLAND,
                    kycVerified: false,
                    kycStatus: 'unverified',
                    avatar: `https://ui-avatars.com/api/?name=${name}&background=000&color=fff`,
                    coins: 2
                }, true);
            }, 1000);
        }
    };

    return (
        <div className="py-12 md:py-24 max-w-4xl mx-auto px-6 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[48px] md:rounded-[64px] apple-shadow-lg border border-black/5 overflow-hidden">
                {/* Visual Side */}
                <div className="hidden lg:flex bg-black p-16 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-12 text-[300px] opacity-10 rotate-12">🍺</div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 opacity-40">Join the Protocol</p>
                        <h2 className="text-6xl font-black mb-8 tracking-tighter uppercase italic leading-none">Access <br />Starts <br />Here.</h2>
                        <p className="text-xl font-medium opacity-60 leading-relaxed italic">
                            The most trusted retrieval layer for event professionals in Nigeria.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">Direct Client Connections</p>
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">Zero Subscription Noise</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 md:p-20 relative overflow-hidden">
                    <div className="mb-12">
                        <h1 className="text-4xl font-extrabold mb-4 tracking-tighter text-black uppercase">
                            {step === 'info' ? 'Create Profile' : 'Verify Signal'}
                        </h1>
                        <p className="text-[#86868b] font-medium text-sm leading-relaxed italic uppercase tracking-tight">
                            {step === 'info'
                                ? 'Generate your identity on the retrieval layer.'
                                : `Security code sent to your signal: ${email}`}
                        </p>
                    </div>

                    {step === 'info' ? (
                        <form onSubmit={handleInitialSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] ml-4">Full Identity</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-lg placeholder:text-black/10"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] ml-4">Contact Signal (Email)</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-lg placeholder:text-black/10"
                                    placeholder="name@signal.com"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-6 rounded-[28px] mt-6 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Generate Access'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] ml-4">6-Digit Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-8 py-6 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-3xl tracking-[0.5em] text-center"
                                    placeholder="000000"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || code.length < 6}
                                className="w-full bg-black text-white py-6 rounded-[28px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Authenticate'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('info')}
                                className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] hover:text-black"
                            >
                                Change Identity Details
                            </button>
                        </form>
                    )}

                    <div className="mt-12 pt-10 border-t border-black/5 text-center">
                        <button
                            onClick={() => onNavigate('auth')}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] hover:text-black underline underline-offset-8"
                        >
                            Existing Profile? Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
