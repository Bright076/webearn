-- Debug why commission approval is failing
-- Run this in Supabase SQL Editor

-- Check if commissions table exists and has data
SELECT 
  id,
  affiliate_id,
  client_request_id as request_id,
  amount,
  status,
  created_at
FROM commissions
ORDER BY created_at DESC
LIMIT 5;

-- Check if there's a column name mismatch
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'commissions'
ORDER BY ordinal_position;

-- Check RLS policies on commissions
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN qual ILIKE '%user_roles%' THEN '⚠️ HAS user_roles REFERENCE'
    ELSE '✅ OK'
  END as recursion_check
FROM pg_policies
WHERE tablename = 'commissions';
