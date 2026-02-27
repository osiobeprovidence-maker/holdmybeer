
// Paystack public key — embedded directly because this app uses browser ESM (no Vite build step)
// import.meta.env is NOT processed when using importmap/ESM in index.html directly
const PAYSTACK_KEY = 'pk_test_11335bd6d0816667b81537e476583a56b9700721';

export const initializePaystack = (options: {
  email: string;
  amount: number;
  metadata?: any;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) => {
  const PaystackPop = (window as any).PaystackPop;
  if (!PaystackPop) {
    alert('Payment system not available. Please check your internet connection and refresh the page.');
    console.error('[HMB] Paystack SDK not loaded. Ensure https://js.paystack.co/v1/inline.js is in index.html');
    return;
  }

  if (!PAYSTACK_KEY || !PAYSTACK_KEY.startsWith('pk_')) {
    alert('Payment configuration error. Please contact support.');
    console.error('[HMB] Paystack public key is missing or invalid:', PAYSTACK_KEY);
    return;
  }

  console.log('[HMB] Initialising Paystack with key:', PAYSTACK_KEY.slice(0, 12) + '...');

  const handler = PaystackPop.setup({
    key: PAYSTACK_KEY,
    email: options.email,
    amount: options.amount * 100, // Convert to Kobo
    currency: 'NGN',
    metadata: options.metadata,
    callback: (response: any) => {
      options.onSuccess(response.reference);
    },
    onClose: () => {
      options.onClose();
    }
  });

  handler.openIframe();
};
