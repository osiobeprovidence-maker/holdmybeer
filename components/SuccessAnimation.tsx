import React, { useEffect, useState } from 'react';

export interface SuccessAnimationProps {
    isVisible: boolean;
    actionText: string;
    balance: number;
    deducted?: number;
    onComplete: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible, actionText, balance, deducted, onComplete }) => {
    const [phase, setPhase] = useState<'hidden' | 'entry' | 'pause' | 'text' | 'exit'>('hidden');

    useEffect(() => {
        if (isVisible) {
            setPhase('entry');

            const enterT = setTimeout(() => setPhase('pause'), 50);
            const textT = setTimeout(() => setPhase('text'), 1000);
            const exitT = setTimeout(() => setPhase('exit'), 2500);
            const completeT = setTimeout(() => {
                setPhase('hidden');
                onComplete();
            }, 2900);

            return () => {
                clearTimeout(enterT);
                clearTimeout(textT);
                clearTimeout(exitT);
                clearTimeout(completeT);
            };
        }
    }, [isVisible, onComplete]);

    if (!isVisible && phase === 'hidden') return null;

    return (
        <div className={`fixed inset-0 z-[4000] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-400 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center justify-center text-center w-full px-6">

                {/* White Symbol Animation */}
                <div
                    className={`w-28 h-28 md:w-36 md:h-36 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex items-center justify-center
                    ${phase === 'entry' ? 'scale-90 opacity-0 rotate-0' : 'scale-100 opacity-100 rotate-2'}
                    ${phase === 'pause' ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'drop-shadow-none'}
                    ${phase === 'exit' ? 'scale-95 opacity-0 duration-400' : ''}
                `}>
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
                        {/* Sharp Angular ZigZag (HMB Mark) */}
                        <path d="M8,70 L38,10 L58,45 L78,5 L102,50 L82,85 L65,50 L45,90 L25,35 L20,75 Z" />
                    </svg>
                </div>

                {/* Success Transition Elements */}
                <div className={`mt-16 transition-all duration-500 ease-out transform
                    ${(phase === 'text' || phase === 'exit') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}>
                    <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Payment Successful</p>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#34C759] uppercase tracking-tighter mb-12">{actionText}</h2>

                    {deducted ? (
                        <div className="flex flex-col items-center">
                            <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[11px] mb-2">{deducted} Coin{deducted !== 1 ? 's' : ''} Used</p>
                            <p className="text-white/40 font-bold uppercase tracking-widest text-[12px]">
                                Remaining: <span className="text-white font-black">{balance} Coins</span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-white/40 font-bold uppercase tracking-widest text-[12px]">
                                Wallet Balance: <span className="text-white font-black">{balance} Coins</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
