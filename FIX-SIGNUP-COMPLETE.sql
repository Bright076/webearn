-- Complete fix for signup issues
-- This ensures the trigger can insert into both profiles and user_roles
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- Step 1: Fix RLS policies to allow trigger inserts
-- ============================================

-- Drop and recreate profiles INSERT policy to allow trigger
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow anonymous inserts (for trigger during signup before auth is complete)
CREATE POLICY "Allow trigger to insert profiles"
  ON profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================
-- Step 2: Fix user_roles INSERT policy
-- ============================================

DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
DROP POLICY IF EXISTS "Allow trigger to insert roles" ON user_roles;

-- Allow trigger to insert roles
CREATE POLICY "Allow trigger to insert roles"
  ON user_roles FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Step 3: Recreate the trigger function
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, affiliate_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    upper(substring(md5(random()::text) from 1 for 8))
  );
  
  -- Insert into user_roles with default role 'affiliate'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'affiliate')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Step 4: Verify everything is set up
-- ============================================

-- Check trigger exists
SELECT 'Trigger exists: ' || tgname as status
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check policies on profiles
SELECT 'Profiles policies:' as info, policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- Check policies on user_roles
SELECT 'User_roles policies:' as info, policyname, cmd
FROM pg_policies
WHERE tablename = 'user_roles' AND cmd = 'INSERT';
