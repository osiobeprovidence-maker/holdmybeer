import React, { useEffect, useState } from 'react';

export interface SuccessAnimationProps {
    isVisible: boolean;
    actionText: string;
    balance: number;
    deducted?: number;
    onComplete: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible, actionText, balance, deducted, onComplete }) => {
    const [phase, setPhase] = useState<'hidden' | 'blank' | 'entry' | 'exit'>('hidden');

    useEffect(() => {
        if (isVisible) {
            setPhase('blank');

            // Wait 200ms with pure white screen (blank phase) to transition cleanly
            const entryT = setTimeout(() => setPhase('entry'), 200);
            const exitT = setTimeout(() => setPhase('exit'), 1800);
            const completeT = setTimeout(() => {
                setPhase('hidden');
                onComplete();
            }, 2200);

            return () => {
                clearTimeout(entryT);
                clearTimeout(exitT);
                clearTimeout(completeT);
            };
        }
    }, [isVisible, onComplete]);

    if (!isVisible && phase === 'hidden') return null;

    return (
        <div className={`fixed inset-0 z-[4000] flex items-center justify-center bg-white transition-opacity duration-400 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center justify-center text-center w-full px-6">

                {/* Subtle Checkmark */}
                <div className={`w-16 h-16 md:w-20 md:h-20 mb-8 rounded-full border border-black/5 bg-[#f5f5f7] flex items-center justify-center transition-all duration-500 transform ease-[cubic-bezier(0.2,0.8,0.2,1)] ${phase === 'entry' ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div className={`transition-all duration-500 ease-out transform ${phase === 'entry' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-[#86868b] font-black uppercase tracking-[0.3em] text-[10px] sm:text-[11px] mb-3 md:mb-4">Payment Successful</p>
                    <h2 className="text-xl md:text-3xl font-black text-black uppercase tracking-tighter mb-10">{actionText}</h2>

                    {deducted ? (
                        <div className="flex flex-col items-center">
                            <p className="text-black font-black uppercase tracking-[0.2em] text-[11px] mb-2">{deducted} Coin{deducted !== 1 ? 's' : ''} Used</p>
                            <p className="text-[#86868b] font-bold uppercase tracking-widest text-[11px] md:text-[12px]">
                                Balance: <span className="text-black font-black">{balance} Coins</span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-[#86868b] font-bold uppercase tracking-widest text-[11px] md:text-[12px]">
                                Balance: <span className="text-black font-black">{balance} Coins</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
