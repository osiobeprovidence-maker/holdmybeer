import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

interface CompleteProfileProps {
    onComplete: () => void;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ onComplete }) => {
    const completeProfileMutation = useMutation(api.api.completeProfile);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !phone.trim()) {
            setErrorMsg('Both fields are required.');
            return;
        }
        setLoading(true);
        setErrorMsg('');
        try {
            await completeProfileMutation({ full_name: fullName.trim(), phone: phone.trim() });
            onComplete();
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-14 justify-center">
                    <div className="w-10 h-10 bg-black flex items-center justify-center rounded-full shadow-md">
                        <span className="text-xl leading-none">🍺</span>
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">HoldMyBeer</span>
                </div>

                <div className="bg-white border border-black/[0.05] rounded-[48px] p-10 shadow-2xl shadow-black/5">
                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] mb-3">
                            One-Time Setup
                        </p>
                        <h2 className="text-4xl font-black tracking-tighter text-black uppercase leading-tight">
                            Complete<br />Your Profile
                        </h2>
                        <p className="mt-4 text-sm text-[#86868b] font-medium leading-relaxed">
                            You're almost in. We just need your name and phone number to activate your account and credit your 2 free coins.
                        </p>
                    </div>

                    {/* Bonus badge */}
                    <div className="flex items-center gap-3 bg-black text-white rounded-[24px] px-5 py-3.5 mb-8">
                        <span className="text-xl">🪙</span>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Signup Bonus</p>
                            <p className="text-sm font-black">2 Free Coins — credited on completion</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] ml-4">
                                Full Name
                            </label>
                            <input
                                id="complete-profile-name"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-7 py-4 text-black outline-none focus:ring-2 focus:ring-black/10 transition-all font-bold text-base placeholder:text-black/20"
                                placeholder="e.g. Chisom Okafor"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] ml-4">
                                Phone Number
                            </label>
                            <input
                                id="complete-profile-phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-7 py-4 text-black outline-none focus:ring-2 focus:ring-black/10 transition-all font-bold text-base placeholder:text-black/20"
                                placeholder="+234 800 000 0000"
                            />
                        </div>

                        <button
                            type="submit"
                            id="complete-profile-submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-5 rounded-[28px] mt-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[12px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Activate Account &amp; Claim 2 Coins</>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-[#86868b] font-bold uppercase tracking-widest mt-8 opacity-50">
                    Passwordless · OTP · Secured by Convex
                </p>
            </div>
        </div>
    );
};

export default CompleteProfile;
