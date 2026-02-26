
import React from 'react';
import { initializePaystack } from '../services/paymentService';
import { User } from '../types';

interface CoinMarketProps {
    currentUser: User | null;
    onPurchaseSuccess: (coins: number) => void;
    onClose: () => void;
}

const CoinMarket: React.FC<CoinMarketProps> = ({ currentUser, onPurchaseSuccess, onClose }) => {
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, []);

    const regularPackages = [
        { coins: 5, price: 5000, label: 'Starter Pack', description: 'Perfect for quick contacts' },
        { coins: 10, price: 9000, label: 'Value Pack', description: 'Most popular among planners', popular: true },
        { coins: 20, price: 16000, label: 'Pro Pack', description: 'Best value for frequent users' },
    ];

    const showSignUpPack = currentUser && !currentUser.hasPurchasedSignUpPack;
    const signUpPack = { coins: 3, price: 2500, label: 'Welcome Pack', description: 'One-time signup offer', special: true };

    const handlePurchase = (pkg: any) => {
        if (!currentUser) {
            alert("Please login to purchase coins.");
            return;
        }

        initializePaystack({
            email: currentUser.email,
            amount: pkg.price,
            metadata: {
                type: 'coin_purchase',
                coins: pkg.coins,
                user_id: currentUser.id
            },
            onSuccess: (reference) => {
                onPurchaseSuccess(pkg.coins);
                alert(`Success! ${pkg.coins} coins added to your protocol balance.`);
            },
            onClose: () => {
                console.log('Payment window closed');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center md:p-10 touch-none">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl" onClick={onClose} />

            <div className="relative bg-white w-full h-full md:h-auto md:max-w-5xl md:rounded-[60px] overflow-hidden apple-shadow-2xl border border-black/5 flex flex-col md:flex-row animate-in zoom-in-95 duration-500 touch-auto">

                {/* Left Side: Branding */}
                <div className="w-full md:w-2/5 bg-[#f5f5f7] p-8 md:p-16 flex flex-col justify-between shrink-0">
                    <div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-2xl flex items-center justify-center mb-6 md:mb-10 shadow-lg">
                            <span className="text-white font-black text-lg">₿</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black uppercase mb-4 md:mb-6 leading-[0.9]">
                            Coin<br />Market
                        </h2>
                        <p className="text-[10px] md:text-[11px] font-bold text-[#86868b] uppercase tracking-[0.4em] leading-relaxed max-w-[200px]">
                            The protocol currency for unlocking premium export signals.
                        </p>
                    </div>

                    <div className="hidden md:block mt-12 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px]">✓</div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Fast Handshakes</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px]">✓</div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">No Expiry Date</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px]">✓</div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Verified Contacts</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Packages */}
                <div className="w-full md:w-3/5 p-6 md:p-16 bg-white overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-center mb-8 md:mb-12">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Select Package</h3>
                            <p className="text-[#86868b] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Current Balance: {currentUser?.coins || 0} Coins</p>
                        </div>
                        <button onClick={onClose} className="p-2 md:p-3 bg-[#f5f5f7] rounded-full hover:scale-110 transition-transform">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid gap-4 md:gap-6">
                        {showSignUpPack && (
                            <button
                                onClick={() => handlePurchase(signUpPack)}
                                className="group relative flex items-center justify-between p-6 md:p-8 rounded-[32px] border-2 border-orange-500 bg-orange-50 text-black hover:scale-[1.02] transition-all shadow-xl"
                            >
                                <div className="flex items-center gap-4 md:gap-6 text-left">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg md:text-xl font-black bg-orange-500 text-white">
                                        {signUpPack.coins}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base md:text-lg uppercase tracking-tight">{signUpPack.label}</h4>
                                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-orange-600 opacity-60">
                                            {signUpPack.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl font-black tracking-tighter text-orange-600">₦{signUpPack.price.toLocaleString()}</p>
                                </div>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg">
                                    New User Deal
                                </div>
                            </button>
                        )}

                        {regularPackages.map((pkg) => (
                            <button
                                key={pkg.coins}
                                onClick={() => handlePurchase(pkg)}
                                className={`group relative flex items-center justify-between p-6 md:p-8 rounded-[32px] border-2 transition-all ${pkg.popular ? 'border-black bg-black text-white' : 'border-[#f5f5f7] bg-[#f5f5f7] text-black hover:border-black/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4 md:gap-6 text-left">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg md:text-xl font-black ${pkg.popular ? 'bg-white text-black' : 'bg-black text-white'
                                        }`}>
                                        {pkg.coins}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base md:text-lg uppercase tracking-tight">{pkg.label}</h4>
                                        <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60 ${pkg.popular ? 'text-white' : 'text-[#86868b]'}`}>
                                            {pkg.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl font-black tracking-tighter">₦{pkg.price.toLocaleString()}</p>
                                </div>

                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg">
                                        Best Value
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 md:mt-12 p-6 md:p-8 rounded-[32px] bg-[#f5f5f7] text-center border border-black/5">
                        <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] mb-4">How it works</p>
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                            <div>
                                <p className="text-lg md:text-xl font-black">1 Coin</p>
                                <p className="text-[8px] md:text-[9px] font-bold text-[#86868b] uppercase tracking-widest">Normal Unlock</p>
                            </div>
                            <div>
                                <p className="text-lg md:text-xl font-black">2 Coins</p>
                                <p className="text-[8px] md:text-[9px] font-bold text-[#86868b] uppercase tracking-widest">Panic Unlock</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinMarket;
