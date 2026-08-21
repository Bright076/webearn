-- CHECK COMMISSION TYPE CONSTRAINT
-- Run this in Supabase SQL Editor

-- Check the constraint definition
SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'products'
  AND con.contype = 'c'
  AND con.conname LIKE '%commission_type%';

-- Check current products data
SELECT id, name, commission_type FROM products LIMIT 5;

-- Try inserting a test product to see the exact error
-- (This will fail but shows us what's wrong)
INSERT INTO products (name, slug, price, commission_type, commission_value)
VALUES ('Test Product', 'test-product-123', 100, 'fixed', 30)
RETURNING *;
