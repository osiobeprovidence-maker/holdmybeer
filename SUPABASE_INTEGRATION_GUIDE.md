# Supabase Integration Guide

I have set up the foundation for connecting your **HoldMyBeer** app to Supabase. This will allow you to transition from mocked local files to a live real-time database!

Here are the manual steps you need to take to complete the process:

## Step 1: Create a Supabase Project
1. Go to [https://supabase.com/](https://supabase.com/).
2. Click **Start your project** and sign in.
3. Create a new project (name it **HoldMyBeer**).
4. Once created, navigate to **Project Settings** > **API**.
5. Copy both the **Project URL** and the **anon key**.

## Step 2: Add Environment Variables
1. Create a `.env.local` file at the root of your project (or update your existing one).
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 3: Run the SQL Schema
In your codebase, I just created a file called `supabase-schema.sql`.
1. Go to your **Supabase Dashboard** > **SQL Editor**.
2. Click **New Query**.
3. Copy all the contents of `supabase-schema.sql` and paste them into the SQL Editor.
4. Hit **Run**. This will create the `profiles` and `service_requests` tables, as well as the Row Level Security policies you need.

## Step 4: Swap Local State for Supabase
Inside `services/supabaseClient.ts`, I've created the connection variable initialized securely. 
Inside your `App.tsx` (and component pages), you'll gradually transition from:
```tsx
const [users, setUsers] = useState<User[]>(MOCK_USERS);
```
To fetching from Supabase inside a `useEffect`:
```tsx
import { supabase } from './services/supabaseClient';

useEffect(() => {
  const fetchVendors = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
  };
  fetchVendors();
}, []);
```

You can now use `supabase.from('profiles').insert({...})` to register users, or use `supabase.auth` for user logins!
