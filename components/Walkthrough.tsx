
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

    const updatePosition = () => {
        const targetElement = document.getElementById(steps[currentStep].target);
        if (targetElement && isVisible) {
            const rect = targetElement.getBoundingClientRect();
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

            // Check if target is in a sticky/fixed container (like the Navbar)
            const isSticky = steps[currentStep].target === 'coin-balance';

            let top = 0;
            let left = rect.left + scrollX + (rect.width / 2) - 150;

            if (isSticky) {
                // For sticky elements, we don't add scrollY because the element moves with the viewport
                top = rect.bottom + 20;
            } else {
                top = rect.bottom + scrollY + 20;
            }

            if (steps[currentStep].position === 'top') {
                top = (isSticky ? rect.top : rect.top + scrollY) - 200;
            }

            // Keep inside screen width-wise
            left = Math.max(10, Math.min(window.innerWidth - 310, left));

            // Handle vertical overflow (mobile)
            if (top + 250 > window.innerHeight + scrollY && !isSticky) {
                top = (isSticky ? rect.top : rect.top + scrollY) - 220;
            }

            setCoords({ top, left });

            if (!isSticky) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    useEffect(() => {
        const hasSeenWalkthrough = localStorage.getItem('hmb_walkthrough_seen');
        if (!hasSeenWalkthrough) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition);
            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition);
            };
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

    const isStickyStep = steps[currentStep].target === 'coin-balance';

    return (
        <div className={`fixed inset-0 z-[2000] pointer-events-none`}>
            <div
                className={`${isStickyStep ? 'fixed' : 'absolute'} w-[280px] sm:w-[300px] bg-black text-white p-6 sm:p-8 rounded-[32px] shadow-2xl pointer-events-auto animate-in zoom-in-95 fade-in duration-500 border border-white/10`}
                style={{
                    top: coords.top,
                    left: coords.left,
                    transition: 'all 0.3s ease-out'
                }}
            >
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Step {currentStep + 1} of {steps.length}</span>
                    <button onClick={handleClose} className="text-white/20 hover:text-white transition-colors p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-3 sm:mb-4">{steps[currentStep].title}</h3>
                <p className="text-xs sm:text-sm font-bold text-white/60 leading-relaxed mb-6 sm:mb-8">{steps[currentStep].content}</p>

                <button
                    onClick={handleNext}
                    className="w-full bg-white text-black py-4 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                    {currentStep === steps.length - 1 ? 'Start Protocol' : 'Forward'}
                </button>

                <div
                    className={`absolute w-4 h-4 bg-black rotate-45 border border-white/10 ${steps[currentStep].position === 'top' ? '-bottom-2 left-1/2 -translate-x-1/2' : '-top-2 left-1/2 -translate-x-1/2'}`}
                    style={{
                        clipPath: steps[currentStep].position === 'top' ? 'polygon(0% 100%, 100% 100%, 100% 0%)' : 'polygon(0% 0%, 100% 0%, 0% 100%)',
                        left: '50%'
                    }}
                />
            </div>
        </div>
    );
};
