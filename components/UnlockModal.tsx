
import React, { useState } from 'react';
import { Vendor } from '../types';

declare const PaystackPop: any;

interface UnlockModalProps {
  vendor: Vendor;
  userEmail?: string;
  onClose: () => void;
  onSuccess: (vendorId: string, amount: number, type: 'standard' | 'urgent') => void;
}

const UnlockModal: React.FC<UnlockModalProps> = ({ vendor, userEmail, onClose, onSuccess }) => {
  const [step, setStep] = useState<'confirm' | 'paying' | 'success'>('confirm');
  const amount = vendor.availableToday ? 5000 : 2500;
  const type = vendor.availableToday ? 'urgent' : 'standard';

  const handlePay = () => {
    const handler = PaystackPop.setup({
      key: 'pk_test_11335bd6d0816667b81537e476583a56b9700721',
      email: userEmail || 'guest@holdmybeer.ng',
      amount: amount * 100, // Paystack works in Kobo
      currency: 'NGN',
      metadata: {
        vendor_id: vendor.id,
        connection_type: type
      },
      callback: function(response: any) {
        setStep('paying');
        setTimeout(() => {
          setStep('success');
          setTimeout(() => {
            onSuccess(vendor.id, amount, type);
          }, 1500);
        }, 1000);
      },
      onClose: function() {
        console.log('Payment window closed');
      }
    });
    handler.openIframe();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative bg-white p-12 md:p-20 rounded-[60px] apple-shadow-lg w-full max-w-lg text-center animate-in zoom-in-95 duration-500 border border-black/5">
        {step === 'confirm' && (
          <div>
            <div className="w-20 h-20 bg-black flex items-center justify-center rounded-[28px] mx-auto mb-8">
              <span className="text-4xl text-white">🔓</span>
            </div>
            <h2 className="text-4xl font-extrabold mb-4 tracking-tighter text-black uppercase">Direct Access</h2>
            <p className="text-[#86868b] font-bold uppercase text-[11px] tracking-widest mb-10 leading-relaxed">
              Authorizing immediate retrieval of <br />
              <span className="text-black font-black">{vendor.businessName}</span>
            </p>
            
            <div className="bg-[#f5f5f7] p-8 rounded-[32px] mb-10 text-left">
              <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-4">Instance Includes:</p>
              <ul className="space-y-3 text-[12px] font-bold text-black uppercase tracking-tight">
                <li className="flex items-center gap-3">✓ Verified Mobile</li>
                <li className="flex items-center gap-3">✓ Official WhatsApp Hub</li>
                <li className="flex items-center gap-3">✓ One-Time Handshake</li>
              </ul>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handlePay}
                className="w-full btn-apple py-6 text-lg !font-extrabold"
              >
                Pay ₦{amount.toLocaleString()}
              </button>
              <button 
                onClick={onClose}
                className="w-full text-[#86868b] hover:text-black transition-colors font-bold text-[11px] uppercase tracking-widest pt-4"
              >
                Cancel Handshake
              </button>
            </div>
          </div>
        )}

        {step === 'paying' && (
          <div className="py-20">
            <div className="w-16 h-16 border-[4px] border-[#f5f5f7] border-t-black rounded-full animate-spin mx-auto mb-10"></div>
            <h2 className="text-2xl font-extrabold mb-2 tracking-tight uppercase">Processing...</h2>
            <p className="text-[#86868b] font-bold uppercase tracking-widest text-[10px]">Verifying transfer</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-20 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-black flex items-center justify-center rounded-[28px] mx-auto mb-10">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-black uppercase">Handshake Complete</h2>
            <p className="text-[#86868b] font-bold uppercase tracking-widest text-[10px] mt-4">Accessing History...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnlockModal;
