import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useNotification } from '../components/NotificationProvider';

interface CompleteProfileProps {
    onComplete: () => void;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ onComplete }) => {
    const { success: notifySuccess, error: notifyError } = useNotification();
    const completeProfileMutation = useMutation(api.api.completeProfile);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !phone.trim() || fullName.trim().length < 2) {
            const error = 'Full name must be at least 2 characters.';
            setErrorMsg(error);
            notifyError(error);
            return;
        }
        setLoading(true);
        setErrorMsg('');
        try {
            const sessionToken = typeof window !== 'undefined' ? localStorage.getItem("hmb_session_id") || undefined : undefined;

            if (!sessionToken) {
                const error = 'Your session has expired or is missing. Please log in again.';
                setErrorMsg(error);
                notifyError(error);
                setLoading(false);
                return;
            }

            // Simple phone normalization: remove everything except digits and leading +
            const normalizedPhone = phone.trim().replace(/(?!^\+)\D/g, '');

            await completeProfileMutation({
                fullName: fullName.trim(),
                phone: normalizedPhone,
                username: username.trim(),
                sessionToken
            });

            setSuccess(true);
            notifySuccess('Profile activated! 🎉 2 bonus coins added to your wallet.');
            setTimeout(() => {
                onComplete();
            }, 2500);

        } catch (err: any) {
            console.error({ event: 'profile_completion_error', error: err });
            const errorMsg = err.message || 'Something went wrong. Please try again.';
            setErrorMsg(errorMsg);
            notifyError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16 animate-in fade-in zoom-in duration-700">
                <div className="text-center">
                    <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-bounce">
                        <span className="text-6xl">🪙</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-none">Profile<br />Activated</h2>
                    <p className="text-lg font-bold text-[#86868b] tracking-tight">2 Bonus Coins have been added to your wallet.</p>
                </div>
            </div>
        );
    }

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

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] ml-4">
                                Choose Username
                            </label>
                            <input
                                id="complete-profile-username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-7 py-4 text-black outline-none focus:ring-2 focus:ring-black/10 transition-all font-bold text-base placeholder:text-black/20"
                                placeholder="coolguy99"
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
