
import React, { useState } from 'react';
import { User, Location } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Object literal may only specify known properties. 'walletBalance' does not exist in type 'User'.
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Demo User',
      email,
      isCreator: false,
      location: Location.LAGOS,
      kycVerified: false,
      kycStatus: 'unverified',
      avatar: `https://ui-avatars.com/api/?name=${name || 'Demo'}`
    };
    onLogin(mockUser);
  };

  return (
    <div className="py-24 max-w-md mx-auto animate-in fade-in duration-700 px-6">
      <div className="bg-white p-12 md:p-16 rounded-[48px] apple-shadow-lg border border-black/5">
        <h2 className="text-5xl font-extrabold mb-6 tracking-tighter uppercase">{isSignup ? 'Register' : 'Sign In'}</h2>
        <p className="text-[#86868b] mb-12 font-bold uppercase tracking-widest text-[11px] opacity-60">Direct access to the expert list.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {isSignup && (
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#86868b] ml-4">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-8 py-5 text-black outline-none focus:bg-[#ebebe7] transition-all font-bold text-lg"
                placeholder="Your name"
              />
            </div>
          )}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#86868b] ml-4">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f5f5f7] border-none rounded-[28px] px-8 py-5 text-black outline-none focus:bg-[#ebebe7] transition-all font-bold text-lg"
              placeholder="email@example.com"
            />
          </div>
          <button type="submit" className="w-full btn-apple py-6 rounded-[28px] mt-6 shadow-2xl transition-all hover:scale-105 text-[14px] uppercase tracking-[0.3em] font-black">
            {isSignup ? 'Get Started' : 'Enter'}
          </button>
        </form>

        <div className="mt-16 pt-10 border-t border-black/5 text-center">
          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#86868b] hover:text-black transition-colors"
          >
            {isSignup ? 'Already registered? Sign in' : "New here? Create profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
