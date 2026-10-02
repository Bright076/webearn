-- Fix infinite recursion in user_roles table
-- The recursion happens when user_roles policies reference themselves
-- Run this in Supabase SQL Editor

-- First, DISABLE RLS temporarily to break the recursion
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

-- Re-enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create ONLY the minimal policy - no recursion possible
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can do everything (bypass RLS)
CREATE POLICY "Service role can manage all roles"
  ON user_roles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_roles';
