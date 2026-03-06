import React, { useState } from 'react';
import { useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useNotification } from "../components/NotificationProvider";

interface AuthProps {
  onLogin?: (user: any) => void;
  onNavigate?: (view: string) => void;
  isSignup?: boolean;
}

const Auth: React.FC<AuthProps> = ({ onNavigate, isSignup }) => {
  const { success, error: notifyError, info } = useNotification();
  const sendOTP = useAction(api.auth.sendOTP);
  const verifyOTP = useMutation(api.auth.verifyOTP);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer logic
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Step 1: Send OTP to email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await sendOTP({ email });
      setCooldown(60); // 60 seconds cooldown
      setStep('code');
      success(`Login code sent to ${email}`);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("wait")) {
        const match = msg.match(/\d+/);
        if (match) setCooldown(parseInt(match[0]));
      }
      const errorMessage = err.message || "Failed to send code. Please try again.";
      setErrorMsg(errorMessage);
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP code — Now using HTTP endpoint for cookie support
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      let siteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
      if (!siteUrl) {
        const cloudUrl = import.meta.env.VITE_CONVEX_URL;
        siteUrl = cloudUrl?.replace(".cloud", ".site");
      }

      const referralCode = typeof window !== 'undefined' ? localStorage.getItem('hmb_referral') || undefined : undefined;
      const response = await fetch(`${siteUrl}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, referralCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid or expired code.");
      }

      const result = await response.json();
      if (result.sessionToken) {
        localStorage.setItem("hmb_session_id", result.sessionToken);
        success("Welcome! You're signed in.");
      }

      // Force navigation or reload upon successful session creation
      if (onNavigate) {
        onNavigate('dashboard');
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Invalid or expired code. Please try again.";
      setErrorMsg(errorMessage);
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-24 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 md:px-6">
      <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[56px] apple-shadow-lg border border-black/[0.03] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        {step === 'email' ? (
          <>
            <div className="mb-12">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] mb-3">
                {isSignup ? "Join Protocol" : "Passwordless Access"}
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter text-black uppercase">
                {isSignup ? "Create Account" : "Sign In"}
              </h2>
              {typeof window !== 'undefined' && localStorage.getItem('hmb_referral') && (
                <div className="mb-4 inline-block bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-amber-100">
                  🎁 Referral Code Applied: <span className="text-black">{localStorage.getItem('hmb_referral')}</span>
                </div>
              )}
              <p className="text-[#86868b] font-medium text-sm leading-relaxed">
                Enter your email and we'll send you a 6-digit login code. No password needed.
              </p>
            </div>

            <form onSubmit={handleSendCode} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] ml-4">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f5f5f7] border-none rounded-3xl px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-lg placeholder:text-black/20"
                  placeholder="name@company.com"
                  autoFocus
                />
              </div>

              <button
                id="auth-send-code"
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 rounded-3xl mt-4 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[13px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : 'Send Login Code'}
              </button>
            </form>

            <div className="mt-12 pt-10 border-t border-black/[0.03] text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b]">
                Passwordless · One-Time Code · Secure
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-12">
              <button
                onClick={() => { setStep('email'); setErrorMsg(''); setCode(''); }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868b] hover:text-black transition-colors mb-8 flex items-center gap-2"
              >
                ← Back
              </button>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#86868b] mb-3">Check Your Email</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter text-black uppercase">Enter Code</h2>
              <p className="text-[#86868b] font-medium text-sm leading-relaxed">
                We sent a 6-digit code to <strong className="text-black">{email}</strong>.
                Enter it below to sign in.
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] ml-4">6-Digit Code</label>
                <input
                  id="auth-otp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-[#f5f5f7] border-none rounded-3xl px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-black text-3xl tracking-[0.5em] text-center placeholder:text-black/20 placeholder:font-bold placeholder:text-lg placeholder:tracking-normal"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              <button
                id="auth-verify-code"
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-black text-white py-6 rounded-3xl mt-4 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[13px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading || cooldown > 0}
                className="w-full text-[11px] font-bold text-[#86868b] hover:text-black transition-colors uppercase tracking-widest py-2 disabled:opacity-50"
              >
                {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
