-- Fix withdrawal statuses to match what the app actually uses
-- The app uses: pending, approved, paid, rejected
-- But the old schema had: pending, processing, completed, rejected
-- Run this in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE withdrawals 
DROP CONSTRAINT IF EXISTS withdrawals_status_check;

-- Add the correct constraint with statuses that match the app
ALTER TABLE withdrawals 
ADD CONSTRAINT withdrawals_status_check 
CHECK (status IN ('pending', 'approved', 'paid', 'rejected'));

-- Migrate any old 'completed' or 'processing' statuses (if any exist)
UPDATE withdrawals 
SET status = 'paid' 
WHERE status = 'completed';

UPDATE withdrawals 
SET status = 'approved' 
WHERE status = 'processing';

-- Verify the constraint
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'withdrawals_status_check';

-- Check current withdrawal statuses
SELECT status, COUNT(*) as count
FROM withdrawals
GROUP BY status
ORDER BY status;
