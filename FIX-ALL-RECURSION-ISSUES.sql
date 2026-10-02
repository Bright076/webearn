-- Complete fix for infinite recursion errors
-- This fixes ALL tables that might have circular RLS policies
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- Step 1: Fix user_roles table (source of recursion)
-- ============================================

ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Simple policies with NO recursion
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all roles"
  ON user_roles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Step 2: Fix profiles table
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Simple policies with NO user_roles checks
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can manage profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Step 3: Verify all policies are fixed
-- ============================================

SELECT 
  tablename, 
  policyname, 
  cmd,
  CASE 
    WHEN qual ILIKE '%user_roles%' THEN '⚠️ STILL HAS user_roles REFERENCE'
    ELSE '✅ OK'
  END as status
FROM pg_policies
WHERE tablename IN ('user_roles', 'profiles')
ORDER BY tablename, policyname;
