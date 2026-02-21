import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests for security
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Note Allowed' });
    }

    const { reference } = req.body;

    if (!reference) {
        return res.status(400).json({ error: 'Reference is required' });
    }

    // Use the secret key securely from Vercel's environment variables
    // This code runs on the Server, so the secret is NEVER sent to the browser
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ error: 'Paystack Secret Key is missing from the environment' });
    }

    try {
        // Call the Paystack API using the Secret Key
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            // Payment was successfully verified by Paystack's server
            return res.status(200).json({ success: true, verified: true, data: data.data });
        } else {
            // The transaction was NOT successful
            return res.status(400).json({ success: false, verified: false, message: data.message });
        }
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to verify transaction', details: error.message });
    }
}
