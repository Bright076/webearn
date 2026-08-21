-- FIX COMMISSION TYPE CONSTRAINT
-- Run this in Supabase SQL Editor

-- Drop the old constraint if it exists
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_commission_type_check;

-- Add the correct constraint
ALTER TABLE products 
ADD CONSTRAINT products_commission_type_check 
CHECK (commission_type IN ('fixed', 'percentage'));

-- Verify the constraint
SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'products'
  AND con.contype = 'c'
  AND con.conname LIKE '%commission_type%';
