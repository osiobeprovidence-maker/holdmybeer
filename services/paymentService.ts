
export const initializePaystack = (options: {
  email: string;
  amount: number;
  metadata?: any;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) => {
  const PaystackPop = (window as any).PaystackPop;
  if (!PaystackPop) {
    console.error('Paystack SDK not loaded');
    return;
  }

  const handler = PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
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
