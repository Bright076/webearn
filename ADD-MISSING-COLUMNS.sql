-- ADD MISSING COLUMNS TO PRODUCTS TABLE
-- Run this in Supabase SQL Editor

-- Check if delivery_days column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'delivery_days'
    ) THEN
        ALTER TABLE products ADD COLUMN delivery_days INTEGER;
    END IF;
END $$;

-- Check current products table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
