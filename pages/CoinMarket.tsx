
import React from 'react';
import { initializePaystack } from '../services/paymentService';
import { User } from '../types';

interface CoinMarketProps {
    currentUser: User | null;
    onPurchaseSuccess: (coins: number) => void;
    onClose: () => void;
}

const packages = [
    { coins: 5, price: 5000, label: 'Starter Pack', description: 'Perfect for quick contacts' },
    { coins: 10, price: 9000, label: 'Value Pack', description: 'Most popular among planners', popular: true },
    { coins: 20, price: 16000, label: 'Pro Pack', description: 'Best value for frequent users' },
];

const CoinMarket: React.FC<CoinMarketProps> = ({ currentUser, onPurchaseSuccess, onClose }) => {
    const handlePurchase = (pkg: typeof packages[0]) => {
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
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl" onClick={onClose} />

            <div className="relative bg-white w-full max-w-5xl rounded-[40px] md:rounded-[60px] overflow-hidden apple-shadow-2xl border border-black/5 flex flex-col md:flex-row animate-in zoom-in-95 duration-500">

                {/* Left Side: Branding */}
                <div className="w-full md:w-2/5 bg-[#f5f5f7] p-10 md:p-16 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-10 shadow-lg">
                            <span className="text-white font-black text-xl">₿</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase mb-6 leading-[0.9]">
                            Coin<br />Market
                        </h2>
                        <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-[0.4em] leading-relaxed max-w-[200px]">
                            The protocol currency for unlocking premium export signals.
                        </p>
                    </div>

                    <div className="mt-12 space-y-6">
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
                <div className="w-full md:w-3/5 p-8 md:p-16 bg-white overflow-y-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Select Package</h3>
                            <p className="text-[#86868b] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Current Balance: {currentUser?.coins || 0} Coins</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-[#f5f5f7] rounded-full hover:scale-110 transition-transform">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {packages.map((pkg) => (
                            <button
                                key={pkg.coins}
                                onClick={() => handlePurchase(pkg)}
                                className={`group relative flex items-center justify-between p-8 rounded-[32px] border-2 transition-all ${pkg.popular ? 'border-black bg-black text-white' : 'border-[#f5f5f7] bg-[#f5f5f7] text-black hover:border-black/10'
                                    }`}
                            >
                                <div className="flex items-center gap-6 text-left">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${pkg.popular ? 'bg-white text-black' : 'bg-black text-white'
                                        }`}>
                                        {pkg.coins}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg uppercase tracking-tight">{pkg.label}</h4>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${pkg.popular ? 'text-white' : 'text-[#86868b]'}`}>
                                            {pkg.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black tracking-tighter">₦{pkg.price.toLocaleString()}</p>
                                </div>

                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg">
                                        Best Value
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 p-8 rounded-[32px] bg-[#f5f5f7] text-center border border-black/5">
                        <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] mb-4">How it works</p>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xl font-black">1 Coin</p>
                                <p className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest">Normal Unlock</p>
                            </div>
                            <div>
                                <p className="text-xl font-black">2 Coins</p>
                                <p className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest">Panic Unlock</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinMarket;
