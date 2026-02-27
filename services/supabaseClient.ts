import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdoqgtzclfedakbwgnbi.supabase.co';
const supabaseAnonKey = 'sb_publishable_bSSuEaFN0MwdebDI0KsZUA_3e_HOu74';

// Production Supabase client with session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,         // Keep session across refreshes
        autoRefreshToken: true,       // Auto-renew token before expiry
        detectSessionInUrl: true,     // Handle magic link / OTP callbacks
        storageKey: 'hmb-auth-token', // Unique storage key for this app
    }
});
