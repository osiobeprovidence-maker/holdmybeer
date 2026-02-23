
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
