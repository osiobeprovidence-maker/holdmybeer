-- SQL Schema for HoldMyBeer Supabase
-- Run this in your Supabase SQL Editor

-- 1. Create Users Table (extends auth.users functionality)
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text not null,
  email text not null,
  is_creator boolean default false,
  avatar text,
  location text,
  kyc_verified boolean default false,
  kyc_status text default 'unverified',
  phone text,
  kyc_type text,
  kyc_number text,
  
  -- Professional Details
  business_name text,
  category text,
  bio text,
  portfolio jsonb default '[]'::jsonb,
  price_range jsonb, 
  available_today boolean default false,
  available_days jsonb default '["Mon", "Tue", "Wed", "Thu", "Fri"]'::jsonb,
  is_verified boolean default false,
  reliability_score integer default 70,
  total_unlocks integer default 0,
  infrastructural_rank integer default 0,
  rating_avg float default 0.0,
  is_suspended boolean default false,
  trial_start_date bigint,
  is_paid boolean default false,
  
  -- Work Page Fields
  completed_jobs integer default 0,
  avg_delivery_time text,
  top_skills jsonb default '[]'::jsonb,
  services jsonb default '[]'::jsonb,
  experience text,
  industries jsonb default '[]'::jsonb,
  social_links jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for public.profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. Create Service Requests Table
create table public.service_requests (
  id text primary key,
  client_id text not null,
  creator_id text not null references public.profiles(id),
  status text default 'unlocked',
  amount numeric not null,
  payment_type text not null,
  timestamp bigint not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for service_requests
alter table public.service_requests enable row level security;

create policy "Anyone can view service requests."
  on service_requests for select
  using ( true );

create policy "Anyone can insert service requests (e.g. guest checkouts)."
  on service_requests for insert
  with check ( true );
