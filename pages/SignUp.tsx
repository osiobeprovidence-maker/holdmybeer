import React, { useState } from 'react';
import { User, Location } from '../types';
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpProps {
    onLogin: (user: User, isNewUser?: boolean) => void;
    onNavigate: (view: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onLogin, onNavigate }) => {
    const { signIn } = useAuthActions();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            await signIn("password", {
                email,
                password,
                name,
                flow: "signUp"
            });

            onLogin({
                id: 'convex-auth-temp-id',
                name: name || 'Convex User',
                email: email,
                isCreator: false,
                location: Location.LAGOS_ISLAND,
                kycVerified: false,
                kycStatus: 'unverified',
                avatar: `https://ui-avatars.com/api/?name=${name || 'User'}&background=000&color=fff`,
                coins: 2, // Signup bonus preview
                totalUnlocks: 0,
                isSuspended: false,
                reliabilityScore: 70
            }, true);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || "Failed to create profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-12 md:py-24 max-w-4xl mx-auto px-4 md:px-6 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] md:rounded-[64px] apple-shadow-lg border border-black/5 overflow-hidden">
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
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-16 relative overflow-hidden">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter text-black uppercase">
                            Create Profile
                        </h1>
                        <p className="text-[#86868b] font-medium text-sm leading-relaxed italic uppercase tracking-tight">
                            Generate your identity on the retrieval layer via Convex.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100">
                                {errorMsg}
                            </div>
                        )}

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

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] ml-4">Security Key (Password)</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-lg placeholder:text-black/10"
                                placeholder="••••••••"
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
