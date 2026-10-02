-- Check withdrawals table schema and foreign keys
-- Run this in Supabase SQL Editor

-- Check columns in withdrawals table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'withdrawals'
ORDER BY ordinal_position;

-- Check foreign key constraints
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='withdrawals';

-- Sample withdrawal data to see actual structure
SELECT 
  id,
  affiliate_id,
  amount,
  status,
  payout_method,
  wallet_address,
  network,
  bank_name,
  bank_account_name,
  bank_account_number,
  created_at
FROM withdrawals
ORDER BY created_at DESC
LIMIT 3;
