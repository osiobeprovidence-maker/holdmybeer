
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
    key: 'pk_test_11335bd6d0816667b81537e476583a56b9700721', // Test Key
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
