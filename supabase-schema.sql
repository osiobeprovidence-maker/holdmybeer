-- =========================================
-- 0) Extensions
-- =========================================
create extension if not exists "pgcrypto";

-- =========================================
-- 1) Enums
-- =========================================
do $$ begin
  create type public.user_role as enum ('organiser', 'vendor', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.vendor_category as enum (
    'MC (Master of Ceremony)', 'DJs', 'Live Bands', 'Saxophonists', 'Hype Men', 'Ushers', 'Comedians', 'Cultural Dancers', 'Choreographers', 'Kids Entertainers', 'Face Painters', 'Magicians', 'Spoken Word Artists', 'Celebrity Appearances',
    'Bouncers', 'Event Security Teams', 'VIP Bodyguards', 'Crowd Control Officers', 'Access Control Personnel', 'Ticket Checkers', 'Armed Escort',
    'Event Decorators', 'Balloon Artists', 'Floral Designers', 'Stage Designers', 'Lighting Designers', 'Backdrop Designers', 'Table Styling Experts', 'Throne Chair Rentals', 'Carpet & Rug Rentals', 'Themed Party Designers',
    'Tent Rentals', 'Chairs & Tables', 'Sound Systems', 'Public Address Systems', 'LED Screens', 'Projectors', 'Generators', 'Stage Platforms', 'Dance Floors', 'Cooling Fans', 'Air Conditioning Units', 'Extension & Cabling Services',
    'Ice Suppliers', 'Ice Trucks', 'Cooling Vans', 'Mobile Toilets', 'Mobile Bar Trucks', 'Equipment Delivery Vans', 'Movers & Setup Crew', 'Power Backup Services',
    'Caterers', 'Small Chops Vendors', 'Cocktail Mixologists', 'Bartenders', 'BBQ / Grill Vendors', 'Shawarma Stands', 'Food Trucks', 'Cake Vendors', 'Palm Wine Suppliers', 'Champagne Service', 'Mocktail Specialists',
    'Photographers', 'Videographers', 'Drone Operators', '360 Booth Rentals', 'Instant Photo Print Booths', 'Live Streaming Services', 'Event Content Creators', 'Red Carpet Interview Setup',
    'Makeup Artists', 'Bridal Makeup Specialists', 'Hairstylists', 'Barbers', 'Gele Tiers', 'Nail Technicians', 'Stylists', 'Fashion Rentals', 'Wardrobe Assistants', 'Groom Styling Experts',
    'Chauffeur Services', 'Luxury Car Rentals', 'Party Buses', 'Dispatch Riders', 'Valet Services',
    'Event Halls', 'Outdoor Spaces', 'Rooftop Venues', 'Beach Venues', 'Private Party Apartments', 'Conference Centers', 'Pop-up Event Spaces',
    'Event Planners', 'Proposal Planners', 'Surprise Setup Teams', 'Event Clean-up Crew', 'Waiters / Service Staff', 'Ticketing Services', 'Event Insurance', 'Stage Managers', 'Hostesses'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.unlock_tier as enum ('standard','urgent');
exception when duplicate_object then null;
end $$;

-- =========================================
-- 2) PROFILES (private user record)
-- One row per auth user
-- =========================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  email text,
  phone text,

  role public.user_role not null default 'organiser',
  avatar text,
  location text,

  -- keep KYC private (NOT publicly readable)
  kyc_verified boolean not null default false,
  kyc_status text not null default 'unverified',
  kyc_type text,
  kyc_number text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  coins integer not null default 0,
  is_paid boolean not null default false,
  is_pre_launch boolean not null default false,
  preferred_location text
);

alter table public.profiles enable row level security;

-- User can read own profile
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles for select
using (auth.uid() = id);

-- User can insert own profile
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

-- User can update own profile
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id);

-- =========================================
-- 3) VENDOR_PROFILES (public listing + locked contacts)
-- vendors only
-- =========================================
create table if not exists public.vendor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,

  business_name text not null,
  category public.vendor_category[] not null,
  city text not null,

  bio text,
  price_min integer,
  price_max integer,

  instagram text,
  tiktok text,

  -- LOCKED contact info (never expose publicly)
  contact_phone text,
  contact_email text,
  whatsapp_link text,

  -- urgency + reliability signals
  available_today boolean not null default false,
  available_this_week boolean not null default false,
  response_time_mins integer,

  verification_status text not null default 'pending', -- pending/verified/rejected
  is_suspended boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vendor_profiles_user_idx on public.vendor_profiles(user_id);
create index if not exists vendor_profiles_city_idx on public.vendor_profiles(city);
create index if not exists vendor_profiles_category_gin_idx on public.vendor_profiles using gin(category);
create index if not exists vendor_profiles_available_today_idx on public.vendor_profiles(available_today);

alter table public.vendor_profiles enable row level security;

-- Vendor can read their own vendor profile (includes contacts)
drop policy if exists "vendor_profiles_read_own" on public.vendor_profiles;
create policy "vendor_profiles_read_own"
on public.vendor_profiles for select
using (auth.uid() = user_id);

-- Vendor can insert their own
drop policy if exists "vendor_profiles_insert_own" on public.vendor_profiles;
create policy "vendor_profiles_insert_own"
on public.vendor_profiles for insert
with check (auth.uid() = user_id);

-- Vendor can update their own
drop policy if exists "vendor_profiles_update_own" on public.vendor_profiles;
create policy "vendor_profiles_update_own"
on public.vendor_profiles for update
using (auth.uid() = user_id);

-- =========================================
-- 4) PUBLIC VIEW (Discovery uses this)
-- no contact_phone/email/whatsapp
-- =========================================
create or replace view public.vendor_profiles_public as
select
  id,
  user_id,
  business_name,
  category,
  city,
  bio,
  price_min,
  price_max,
  instagram,
  tiktok,
  available_today,
  available_this_week,
  response_time_mins,
  verification_status,
  is_suspended,
  created_at,
  updated_at
from public.vendor_profiles
where is_suspended = false;

-- =========================================
-- 5) VENDOR PORTFOLIO (public)
-- =========================================
create table if not exists public.vendor_portfolio (
  id uuid primary key default gen_random_uuid(),
  vendor_profile_id uuid not null references public.vendor_profiles(id) on delete cascade,
  type text not null default 'image', -- image/link
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.vendor_portfolio enable row level security;

-- Public can read portfolio
drop policy if exists "portfolio_public_read" on public.vendor_portfolio;
create policy "portfolio_public_read"
on public.vendor_portfolio for select
using (true);

-- Only vendor owner can write portfolio items
drop policy if exists "portfolio_vendor_insert" on public.vendor_portfolio;
create policy "portfolio_vendor_insert"
on public.vendor_portfolio for insert
with check (
  exists (
    select 1 from public.vendor_profiles vp
    where vp.id = vendor_profile_id
      and vp.user_id = auth.uid()
  )
);

drop policy if exists "portfolio_vendor_update" on public.vendor_portfolio;
create policy "portfolio_vendor_update"
on public.vendor_portfolio for update
using (
  exists (
    select 1 from public.vendor_profiles vp
    where vp.id = vendor_profile_id
      and vp.user_id = auth.uid()
  )
);

drop policy if exists "portfolio_vendor_delete" on public.vendor_portfolio;
create policy "portfolio_vendor_delete"
on public.vendor_portfolio for delete
using (
  exists (
    select 1 from public.vendor_profiles vp
    where vp.id = vendor_profile_id
      and vp.user_id = auth.uid()
  )
);

-- =========================================
-- 6) PAYMENTS (Paystack references)
-- Client inserts pending; server/webhook should mark success
-- =========================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'paystack',
  reference text not null unique,
  amount integer not null,
  currency text not null default 'NGN',
  status text not null default 'pending', -- pending/success/failed
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

drop policy if exists "payments_read_own" on public.payments;
create policy "payments_read_own"
on public.payments for select
using (auth.uid() = user_id);

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own"
on public.payments for insert
with check (auth.uid() = user_id);

-- NOTE: do not allow client updates on payments in MVP.
-- Updates should be done by Edge Function (service role).

-- =========================================
-- 7) UNLOCKS (this replaces your service_requests)
-- THIS is the fix for your error: UUIDs match UUIDs
-- =========================================
create table if not exists public.unlocks (
  id uuid primary key default gen_random_uuid(),
  organiser_id uuid not null references public.profiles(id) on delete cascade,
  vendor_profile_id uuid not null references public.vendor_profiles(id) on delete cascade,

  tier public.unlock_tier not null,
  payment_reference text not null references public.payments(reference),
  amount integer not null,
  status text not null default 'success',

  created_at timestamptz not null default now(),
  unique (organiser_id, vendor_profile_id)
);

alter table public.unlocks enable row level security;

-- organiser reads own unlocks
drop policy if exists "unlocks_read_own" on public.unlocks;
create policy "unlocks_read_own"
on public.unlocks for select
using (auth.uid() = organiser_id);

-- vendor can read unlocks made on them (optional but useful for analytics)
drop policy if exists "unlocks_vendor_read" on public.unlocks;
create policy "unlocks_vendor_read"
on public.unlocks for select
using (
  exists (
    select 1 from public.vendor_profiles vp
    where vp.id = vendor_profile_id
      and vp.user_id = auth.uid()
  )
);

-- organiser inserts own unlock (better: do via webhook Edge Function)
drop policy if exists "unlocks_insert_own" on public.unlocks;
create policy "unlocks_insert_own"
on public.unlocks for insert
with check (auth.uid() = organiser_id);

-- =========================================
-- 8) RESPONSE CHECKS (NOT ratings)
-- “Did vendor respond?” yes/no
-- =========================================
create table if not exists public.response_checks (
  id uuid primary key default gen_random_uuid(),
  unlock_id uuid not null references public.unlocks(id) on delete cascade,
  organiser_id uuid not null references public.profiles(id) on delete cascade,
  vendor_profile_id uuid not null references public.vendor_profiles(id) on delete cascade,
  did_respond boolean,
  created_at timestamptz not null default now(),
  unique (unlock_id)
);

alter table public.response_checks enable row level security;

drop policy if exists "response_checks_read_own" on public.response_checks;
create policy "response_checks_read_own"
on public.response_checks for select
using (auth.uid() = organiser_id);

drop policy if exists "response_checks_insert_own" on public.response_checks;
create policy "response_checks_insert_own"
on public.response_checks for insert
with check (auth.uid() = organiser_id);

-- =========================================
-- 9) SECURE RPC: Reveal contacts only if unlocked
-- Discovery uses vendor_profiles_public, NOT vendor_profiles
-- =========================================
create or replace function public.get_vendor_contact(p_vendor_profile_id uuid)
returns table (contact_phone text, contact_email text, whatsapp_link text)
language plpgsql
security definer
as $$
begin
  -- vendor owner
  if exists (
    select 1 from public.vendor_profiles vp
    where vp.id = p_vendor_profile_id
      and vp.user_id = auth.uid()
  ) then
    return query
    select vp.contact_phone, vp.contact_email, vp.whatsapp_link
    from public.vendor_profiles vp
    where vp.id = p_vendor_profile_id;
    return;
  end if;

  -- unlocked organiser
  if exists (
    select 1 from public.unlocks u
    where u.vendor_profile_id = p_vendor_profile_id
      and u.organiser_id = auth.uid()
      and u.status = 'success'
  ) then
    return query
    select vp.contact_phone, vp.contact_email, vp.whatsapp_link
    from public.vendor_profiles vp
    where vp.id = p_vendor_profile_id;
    return;
  end if;

  -- else: return nothing
  return;
end;
$$;

revoke all on function public.get_vendor_contact(uuid) from public;
grant execute on function public.get_vendor_contact(uuid) to authenticated;

-- =========================================
-- 10) updated_at trigger (optional but recommended)
-- =========================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists vendor_profiles_set_updated_at on public.vendor_profiles;
create trigger vendor_profiles_set_updated_at
before update on public.vendor_profiles
for each row execute procedure public.set_updated_at();
