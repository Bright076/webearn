-- Drop the 3 policies causing infinite recursion
-- Run this in Supabase SQL Editor NOW

-- Drop admin policies on profiles that check user_roles
DROP POLICY IF EXISTS "Admins read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins update all profiles" ON profiles;

-- Drop admin policy on user_roles that checks itself
DROP POLICY IF EXISTS "Admins manage roles" ON user_roles;

-- Verify they're gone
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
