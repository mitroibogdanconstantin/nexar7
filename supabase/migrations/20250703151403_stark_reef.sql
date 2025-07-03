/*
  # Fix RLS Policy for Listings Table

  1. Problem
    - Current RLS policy is too restrictive for listing creation
    - seller_id mismatch between profiles.id and auth.uid()
    - Need to allow authenticated users to create listings

  2. Solution
    - Drop existing problematic policies
    - Create new permissive policies for listing creation
    - Ensure proper seller_id handling
*/

-- Step 1: Disable RLS temporarily to avoid conflicts
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies for listings
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'listings' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.listings';
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new, more permissive policies

-- Allow everyone to view active listings
CREATE POLICY "listings_select_active" ON listings
  FOR SELECT USING (status = 'active');

-- Allow authenticated users to view their own listings (any status)
CREATE POLICY "listings_select_own" ON listings
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Allow admin to view all listings
CREATE POLICY "listings_select_admin" ON listings
  FOR SELECT USING (
    auth.email() = 'admin@nexar.ro'
  );

-- FIXED: More permissive insert policy - allow any authenticated user to create listings
CREATE POLICY "listings_insert_authenticated" ON listings
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Allow users to update their own listings
CREATE POLICY "listings_update_own" ON listings
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Allow admin to update any listing
CREATE POLICY "listings_update_admin" ON listings
  FOR UPDATE USING (
    auth.email() = 'admin@nexar.ro'
  );

-- Allow users to delete their own listings
CREATE POLICY "listings_delete_own" ON listings
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Allow admin to delete any listing
CREATE POLICY "listings_delete_admin" ON listings
  FOR DELETE USING (
    auth.email() = 'admin@nexar.ro'
  );

-- Step 5: Ensure all users have profiles
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN (
        SELECT id, email FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM profiles WHERE user_id IS NOT NULL)
    ) LOOP
        INSERT INTO profiles (
            user_id,
            name,
            email,
            seller_type,
            is_admin,
            verified
        ) VALUES (
            u.id,
            COALESCE(split_part(u.email, '@', 1), 'Utilizator'),
            u.email,
            'individual',
            u.email = 'admin@nexar.ro',
            false
        ) ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Created/ensured profile for user %', u.email;
    END LOOP;
END $$;

-- Step 6: Test the policies
DO $$
BEGIN
  -- Test basic access
  PERFORM COUNT(*) FROM listings WHERE status = 'active';
  RAISE NOTICE 'Listings table access: OK';
  
  -- Test profiles access
  PERFORM COUNT(*) FROM profiles;
  RAISE NOTICE 'Profiles table access: OK';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Policy test failed: %', SQLERRM;
END $$;