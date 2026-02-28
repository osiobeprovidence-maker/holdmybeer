import React, { useState } from 'react';
import { User, Location } from '../types';
import { useAuthActions } from "@convex-dev/auth/react";

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { signIn } = useAuthActions();
  const [isSignup, setIsSignup] = useState(false);
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
        name: isSignup ? name : undefined,
        flow: isSignup ? "signUp" : "signIn"
      });

      // Note: App.tsx will naturally manage user state via Convex after this succeeds,
      // but we mock the initial pass back to satisfy the old App.tsx interface 
      // until we completely rewrite App.tsx to be reactive to Convex.
      onLogin({
        id: 'convex-auth-temp-id',
        name: name || 'Convex User',
        email: email,
        isCreator: false,
        location: Location.LAGOS_ISLAND,
        kycVerified: false,
        kycStatus: 'unverified',
        avatar: `https://ui-avatars.com/api/?name=${name || 'User'}&background=000&color=fff`,
        coins: isSignup ? 2 : 0, // Signup bonus preview
        totalUnlocks: 0,
        isSuspended: false,
        reliabilityScore: 70
      });
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-24 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 md:px-6">
      <div className="bg-white p-8 md:p-16 rounded-[40px] md:rounded-[56px] apple-shadow-lg border border-black/[0.03] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter text-black">
            {isSignup ? 'Create Protocol' : 'Sign In'}
          </h2>
          <p className="text-[#86868b] font-medium text-sm md:text-base leading-relaxed">
            Enter your credentials to access the elite expert retrieval layer via Convex.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100">
              {errorMsg}
            </div>
          )}

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

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] ml-4">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f5f5f7] border-none rounded-3xl px-8 py-5 text-black outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-lg placeholder:text-black/20"
              placeholder="••••••••"
              minLength={6}
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
              isSignup ? 'Generate Access' : 'Authenticate'
            )}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-black/[0.03] text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] hover:text-black transition-colors"
          >
            {isSignup ? 'Already have access? Sign in' : "New to the protocol? Create profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
