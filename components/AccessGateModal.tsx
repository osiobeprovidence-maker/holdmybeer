import React from 'react';

interface AccessGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUp: () => void;
    onLogin: () => void;
}

const AccessGateModal: React.FC<AccessGateModalProps> = ({ isOpen, onClose, onSignUp, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full md:max-w-md rounded-t-[40px] md:rounded-[40px] p-10 md:p-14 animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500 overflow-hidden">

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-black rounded-t-[40px]" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-7 right-7 w-9 h-9 bg-[#f5f5f7] rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Coin badge */}
                <div className="w-16 h-16 bg-black rounded-[20px] flex items-center justify-center mb-8">
                    <span className="text-3xl">🪙</span>
                </div>

                {/* Headline */}
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#86868b] mb-3">Unlock Access</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-black uppercase leading-none mb-6">
                    Activate<br />Your Free Coins.
                </h2>

                {/* Body copy */}
                <p className="text-[#86868b] font-medium text-sm leading-relaxed mb-3">
                    You need an account to activate your free coins.
                </p>
                <p className="text-black font-black text-sm mb-10">
                    New users receive{' '}
                    <span className="inline-block bg-black text-white rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-widest mx-1">
                        2 Free Coins
                    </span>
                    {' '}instantly.
                </p>

                {/* CTA Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onSignUp}
                        className="w-full bg-black text-white py-5 rounded-[28px] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                    >
                        <span>🪙</span>
                        Create Account & Activate 2 Free Coins
                    </button>
                    <button
                        onClick={onLogin}
                        className="w-full bg-[#f5f5f7] hover:bg-black/10 text-black py-5 rounded-[28px] text-[11px] font-black uppercase tracking-[0.2em] transition-colors"
                    >
                        Login
                    </button>
                </div>

                {/* Trust line */}
                <p className="text-center text-[10px] text-[#86868b] mt-6 font-medium tracking-wider">
                    No subscriptions. No hidden charges.
                </p>
            </div>
        </div>
    );
};

export default AccessGateModal;
