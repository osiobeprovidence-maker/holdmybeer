
import React, { useState } from 'react';
import { User, Location } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

import { supabase } from '../services/supabaseClient';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
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
      // Mock delay
      await new Promise(r => setTimeout(r, 1500));
    }

    setLoading(false);
    setStep('code');
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
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
        // Fetch or create profile info
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

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
          coins: profile.coins || 0
        } : {
          id: data.user.id,
          name: name || data.user.user_metadata?.name || 'Expert Client',
          email: data.user.email || email,
          isCreator: false,
          location: Location.LAGOS_ISLAND,
          kycVerified: false,
          kycStatus: 'unverified',
          avatar: `https://ui-avatars.com/api/?name=${name || 'Expert'}&background=000&color=fff`,
          coins: 0
        };

        onLogin(loggedInUser);
      }
    } else {
      setTimeout(() => {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name || 'Expert Client',
          email,
          isCreator: false,
          location: Location.LAGOS_ISLAND,
          kycVerified: false,
          kycStatus: 'unverified',
          avatar: `https://ui-avatars.com/api/?name=${name || 'Expert'}&background=000&color=fff`,
          coins: 0
        };
        onLogin(mockUser);
      }, 1000);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    if (!supabase) {
      alert("Infrastructure layer offline. OAuth requires stable connection.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-24 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 md:px-6">
      <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[56px] apple-shadow-lg border border-black/[0.03] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter text-black">
            {step === 'email' ? (isSignup ? 'Create Protocol' : 'Sign In') : 'Verify Identity'}
          </h2>
          <p className="text-[#86868b] font-medium text-sm md:text-base leading-relaxed">
            {step === 'email'
              ? 'Enter your credentials to access the elite expert retrieval layer.'
              : `We've sent a secure access code to ${email}`}
          </p>
        </div>

        {step === 'email' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleOAuthLogin('google')}
                className="w-full flex items-center justify-center gap-4 py-4 rounded-3xl border border-black/5 bg-white hover:bg-black hover:text-white transition-all font-bold text-[11px] uppercase tracking-widest"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
              <button
                onClick={() => handleOAuthLogin('apple')}
                className="w-full flex items-center justify-center gap-4 py-4 rounded-3xl bg-black text-white hover:opacity-80 transition-all font-bold text-[11px] uppercase tracking-widest"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.61-3.21 1.61-1.11 0-1.43-.67-2.76-.67-1.31 0-1.74.65-2.74.65-1.11 0-2.34-1.12-3.32-2.12C3.12 17.84 2 14.88 2 12.29c0-3.32 2.1-5.12 4.14-5.12 1.06 0 1.94.63 2.7.63.7 0 1.4-.63 2.68-.63 1.04 0 2.21.56 3.01 1.54-2.18 1.25-1.84 4.34.42 5.27-.85 1.91-1.97 4.38-2.9 6.3zm-3.08-14.73c.56-.7 1.02-1.63.85-2.55-.83.05-1.82.6-2.4 1.28-.53.6-.96 1.57-.75 2.44.91.07 1.77-.52 2.3-1.17z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-4 opacity-10">
              <div className="h-px bg-black flex-grow" />
              <span className="text-[10px] font-black uppercase">OR</span>
              <div className="h-px bg-black flex-grow" />
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {isSignup && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] ml-4">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f5f5f7] border-none rounded-3xl px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-lg placeholder:text-black/20"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] ml-4">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f5f5f7] border-none rounded-3xl px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-lg placeholder:text-black/20"
                  placeholder="name@company.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 rounded-3xl mt-4 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[14px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  isSignup ? 'Generate Access' : 'Continue'
                )}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] ml-4">Security Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#f5f5f7] border-none rounded-3xl px-8 py-6 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-3xl tracking-[0.5em] text-center placeholder:text-black/5"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-black text-white py-6 rounded-3xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[14px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : 'Authenticate'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] hover:text-black transition-colors"
            >
              Wrong email? Go back
            </button>
          </form>
        )}

        {step === 'email' && (
          <div className="mt-12 pt-10 border-t border-black/[0.03] text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] hover:text-black transition-colors"
            >
              {isSignup ? 'Already have access? Sign in' : "New to the protocol? Create profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
