-- ============================================================
-- HoldMyBeer – Production Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES (already exists – extend it)
-- Make sure coins column exists with default 0
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_purchased_sign_up_pack BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS panic_mode_opt_in BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS panic_mode_price INTEGER DEFAULT 0;

-- 2. WALLETS TABLE
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRANSACTIONS TABLE  
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT CHECK (type IN ('credit', 'debit')) NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UNLOCKS TABLE (may already exist – ensure proper structure)
CREATE TABLE IF NOT EXISTS unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organiser_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vendor_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier TEXT CHECK (tier IN ('standard', 'urgent')) DEFAULT 'standard',
  amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'unlocked',
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
DROP POLICY IF EXISTS "wallets_select_own" ON wallets;
DROP POLICY IF EXISTS "wallets_insert_own" ON wallets;
DROP POLICY IF EXISTS "transactions_select_own" ON transactions;
DROP POLICY IF EXISTS "transactions_insert_own" ON transactions;
DROP POLICY IF EXISTS "unlocks_insert_own" ON unlocks;
DROP POLICY IF EXISTS "unlocks_select_own" ON unlocks;

-- PROFILES: public read (for vendor discovery), own write
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- WALLETS: own read only
CREATE POLICY "wallets_select_own" ON wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wallets_insert_own" ON wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TRANSACTIONS: own read only
CREATE POLICY "transactions_select_own" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UNLOCKS: insert by authenticated users
CREATE POLICY "unlocks_insert_own" ON unlocks
  FOR INSERT WITH CHECK (auth.uid() = organiser_id);

CREATE POLICY "unlocks_select_own" ON unlocks
  FOR SELECT USING (auth.uid() = organiser_id OR auth.uid() = vendor_profile_id);

-- ============================================================
-- FUNCTION: Auto-create profile + wallet on new user signup
-- This fires automatically via Supabase Auth trigger
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile row
  INSERT INTO public.profiles (id, email, name, coins, kyc_status, kyc_verified, is_creator, is_suspended, reliability_score, avatar, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    2, -- 2 free coins on signup
    'unverified',
    false,
    false,
    false,
    70,
    'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'name', 'User') || '&background=000&color=fff',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create wallet row
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 2)
  ON CONFLICT (user_id) DO NOTHING;

  -- Log signup bonus transaction
  INSERT INTO public.transactions (user_id, amount, type, description, reference)
  VALUES (NEW.id, 2, 'credit', 'New User Free Coins', 'signup-bonus');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: Deduct coins (server-side validation)
-- Call this via Supabase RPC: supabase.rpc('deduct_coins', ...)
-- ============================================================

CREATE OR REPLACE FUNCTION deduct_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_reference TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Check user owns this operation
  IF auth.uid() != p_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Get current balance from profiles
  SELECT coins INTO v_current_balance
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE; -- lock row during transaction

  IF v_current_balance IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient coins', 'balance', v_current_balance);
  END IF;

  v_new_balance := v_current_balance - p_amount;

  -- Deduct from profile
  UPDATE profiles SET coins = v_new_balance WHERE id = p_user_id;

  -- Sync wallet balance
  UPDATE wallets SET balance = v_new_balance WHERE user_id = p_user_id;

  -- Log transaction
  INSERT INTO transactions (user_id, amount, type, description, reference)
  VALUES (p_user_id, p_amount, 'debit', p_description, p_reference);

  RETURN json_build_object('success', true, 'new_balance', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: Credit coins (for purchases)
-- ============================================================

CREATE OR REPLACE FUNCTION credit_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_reference TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  IF auth.uid() != p_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  UPDATE profiles
  SET coins = coins + p_amount
  WHERE id = p_user_id
  RETURNING coins INTO v_new_balance;

  UPDATE wallets SET balance = v_new_balance WHERE user_id = p_user_id;

  INSERT INTO transactions (user_id, amount, type, description, reference)
  VALUES (p_user_id, p_amount, 'credit', p_description, p_reference);

  RETURN json_build_object('success', true, 'new_balance', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
