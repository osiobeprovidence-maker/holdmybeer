
import React, { useState, useEffect } from 'react';

interface Step {
    title: string;
    description: string;
    icon: string;
    targetId: string;
}

const steps: Step[] = [
    {
        title: 'Protocol Retrieval',
        description: 'Use our AI retrieval engine to find verified specialists. Just type what you need and we do the hard part.',
        icon: '⚡️',
        targetId: 'home-hero'
    },
    {
        title: 'Panic Response',
        description: 'Activate Panic Mode for immediate bookings. This filters for experts ready to execute within the next 24 hours.',
        icon: '🚨',
        targetId: 'panic-toggle'
    },
    {
        title: 'Precision Zones',
        description: 'Set your Rec. Zone to Ikeja, Lekki, or Surulere. We boost local experts to the top of your results.',
        icon: '📍',
        targetId: 'rec-zone'
    },
    {
        title: 'Direct Handshake',
        description: 'New users get 2 free coins. Use them to unlock verified WhatsApp and phone numbers instantly.',
        icon: '₿',
        targetId: 'coin-balance'
    }
];

interface ProductTourProps {
    isLoggedIn: boolean;
}

export const ProductTour: React.FC<ProductTourProps> = ({ isLoggedIn }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isPointerVisible, setIsPointerVisible] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            const hasSeenTour = localStorage.getItem('hmb_tour_seen');
            if (!hasSeenTour) {
                const timer = setTimeout(() => setIsVisible(true), 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [isLoggedIn]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setIsPointerVisible(false);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('hmb_tour_seen', 'true');
    };

    const showMe = () => {
        setIsPointerVisible(true);
        const element = document.getElementById(steps[currentStep].targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-4', 'ring-black', 'ring-offset-4', 'duration-500');
            setTimeout(() => {
                element.classList.remove('ring-4', 'ring-black', 'ring-offset-4');
            }, 3000);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 sm:p-10 pointer-events-none">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md pointer-events-auto" onClick={handleClose} />

            <div className="relative w-full max-w-md bg-white rounded-[48px] p-10 md:p-14 apple-shadow-2xl border border-black/5 animate-in zoom-in-95 duration-700 pointer-events-auto overflow-hidden">
                {/* Progress header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-1.5">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-black' : 'w-2 bg-black/10'}`}
                            />
                        ))}
                    </div>
                    <button onClick={handleClose} className="text-[#86868b] hover:text-black transition-colors font-bold text-[10px] uppercase tracking-widest">Skip</button>
                </div>

                {/* Content */}
                <div className="text-center animate-in slide-in-from-right-10 duration-500" key={currentStep}>
                    <div className="w-20 h-20 bg-[#f5f5f7] rounded-[28px] flex items-center justify-center text-4xl mx-auto mb-10">
                        {steps[currentStep].icon}
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-black">{steps[currentStep].title}</h2>
                    <p className="text-[#86868b] text-sm md:text-base font-medium leading-relaxed mb-12">
                        {steps[currentStep].description}
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleNext}
                        className="w-full bg-black text-white py-6 rounded-[24px] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {currentStep === steps.length - 1 ? 'Finish Discovery' : 'Continue'}
                    </button>
                    <button
                        onClick={showMe}
                        className="w-full bg-[#f5f5f7] text-[#86868b] py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.15em] hover:text-black transition-colors"
                    >
                        Show me where
                    </button>
                </div>

                {/* Background Accent */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    );
};
