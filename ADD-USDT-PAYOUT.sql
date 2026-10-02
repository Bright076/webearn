-- Add USDT payout support for worldwide affiliates
-- Run this in Supabase SQL Editor

-- Add USDT wallet columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS usdt_wallet_address TEXT,
ADD COLUMN IF NOT EXISTS usdt_network TEXT DEFAULT 'TRC20',
ADD COLUMN IF NOT EXISTS preferred_payout_method TEXT DEFAULT 'usdt' CHECK (preferred_payout_method IN ('usdt', 'bank'));

-- Add payout method columns to withdrawals
ALTER TABLE withdrawals 
ADD COLUMN IF NOT EXISTS payout_method TEXT NOT NULL DEFAULT 'usdt' CHECK (payout_method IN ('usdt', 'bank')),
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS network TEXT;

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name IN ('usdt_wallet_address', 'usdt_network', 'preferred_payout_method');

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'withdrawals' 
AND column_name IN ('payout_method', 'wallet_address', 'network');
