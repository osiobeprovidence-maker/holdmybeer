
import React, { useState, useEffect } from 'react';

interface Step {
    target: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

const steps: Step[] = [
    {
        target: 'home-hero',
        title: 'Find Experts Instantly',
        content: "Describe your event needs to our AI assistant and find the perfect vendor in seconds.",
        position: 'bottom'
    },
    {
        target: 'panic-toggle',
        title: 'Need someone NOW?',
        content: "Activate Panic Mode to see vendors available for immediate booking.",
        position: 'bottom'
    },
    {
        target: 'rec-zone',
        title: 'Set Your Zone',
        content: "Choose your preferred area in Lagos to see top-rated experts near you first.",
        position: 'top'
    },
    {
        target: 'coin-balance',
        title: 'Your Protocol Fuel',
        content: "New users get 2 free coins! Use them to unlock direct contact details of vendors.",
        position: 'bottom'
    }
];

export const Walkthrough: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const hasSeenWalkthrough = localStorage.getItem('hmb_walkthrough_seen');
        if (!hasSeenWalkthrough) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            const targetElement = document.getElementById(steps[currentStep].target);
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                const scrollY = window.scrollY;

                let top = rect.bottom + scrollY + 20;
                let left = rect.left + (rect.width / 2) - 150;

                if (steps[currentStep].position === 'top') {
                    top = rect.top + scrollY - 200;
                }

                // Keep inside screen
                left = Math.max(20, Math.min(window.innerWidth - 320, left));

                setCoords({ top, left });
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [isVisible, currentStep]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('hmb_walkthrough_seen', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
            <div
                className="absolute w-[300px] bg-black text-white p-8 rounded-[32px] shadow-2xl pointer-events-auto animate-in zoom-in-95 fade-in duration-500 border border-white/10"
                style={{ top: coords.top, left: coords.left }}
            >
                <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Step {currentStep + 1} of {steps.length}</span>
                    <button onClick={handleClose} className="text-white/20 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{steps[currentStep].title}</h3>
                <p className="text-sm font-bold text-white/60 leading-relaxed mb-8">{steps[currentStep].content}</p>

                <button
                    onClick={handleNext}
                    className="w-full bg-white text-black py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                >
                    {currentStep === steps.length - 1 ? 'Start Protocol' : 'Forward'}
                </button>

                {/* Arrow pointer */}
                <div
                    className={`absolute w-4 h-4 bg-black rotate-45 border border-white/10 ${steps[currentStep].position === 'top' ? '-bottom-2 left-1/2 -translate-x-1/2' : '-top-2 left-1/2 -translate-x-1/2'}`}
                    style={{ clipPath: steps[currentStep].position === 'top' ? 'polygon(0% 100%, 100% 100%, 100% 0%)' : 'polygon(0% 0%, 100% 0%, 0% 100%)' }}
                />
            </div>
        </div>
    );
};
