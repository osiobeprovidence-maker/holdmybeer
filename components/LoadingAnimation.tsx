import React, { useState, useEffect } from 'react';

const words = [
    'Be Ready.',
    'Be Booked.',
    'Stay Sharp.',
    'Direct Access.',
    'No Middleman.',
    'Move Fast.',
    'Secure Action.'
];

export const LoadingAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setWordIndex(prev => (prev + 1) % words.length);
        }, 800);
        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[5000] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-full max-w-md px-12 relative flex flex-col items-center justify-center">

                {/* The Medical ECG Line */}
                <div className="w-full h-24 flex items-center justify-center relative">
                    <div className="absolute inset-x-0 h-[1px] bg-[#1a1a1a]" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 bg-white flex items-center justify-center">
                        <svg width="96" height="96" viewBox="0 0 96 96" className="text-[#1a1a1a]" style={{ transformOrigin: 'center', animation: 'ecgPulse 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
                            {/* Y goes from 48 -> 20 -> 76 -> 48 to make an ECG spike */}
                            <path d="M0,48 L30,48 L38,20 L58,76 L66,48 L96,48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
                        </svg>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes ecgPulse {
                        0% { transform: scaleY(0.01); }
                        15% { transform: scaleY(1); }
                        30% { transform: scaleY(0.01); }
                        100% { transform: scaleY(0.01); }
                    }
                `}} />

                {/* Text below line */}
                <div className="mt-8 h-8 relative w-full flex justify-center">
                    {words.map((word, idx) => (
                        <p
                            key={word}
                            className={`absolute text-center text-[#1a1a1a] font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] transition-opacity duration-300 ${idx === wordIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {word}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};
