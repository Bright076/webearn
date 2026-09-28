-- ============================================
-- FIX CLIENT REQUESTS STATUS CONSTRAINT
-- ============================================
-- This fixes the error: "new row violates check constraint client_requests_status_check"
-- 
-- CRITICAL: Run this in Supabase SQL Editor IMMEDIATELY!
-- Without this, the "Get a Website" form will fail!
-- ============================================

-- Step 1: Check current constraint (for debugging)
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'client_requests'::regclass 
AND conname LIKE '%status%';

-- Step 2: Drop the old constraint
ALTER TABLE client_requests DROP CONSTRAINT IF EXISTS client_requests_status_check;

-- Step 3: Add the correct constraint that includes ALL valid statuses used in the app
ALTER TABLE client_requests 
ADD CONSTRAINT client_requests_status_check 
CHECK (status IN (
  'pending',      -- Initial state when form is submitted
  'contacted',    -- Admin reached out to client
  'negotiating',  -- In discussion with client
  'paid',         -- Client paid (triggers commission)
  'in_progress',  -- Work is being done
  'delivered',    -- Project completed and delivered
  'cancelled',    -- Request was cancelled
  'refunded'      -- Payment was refunded (optional future use)
));

-- Step 4: Verify the new constraint is correct
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'client_requests'::regclass 
AND conname = 'client_requests_status_check';

-- Expected output should show:
-- CHECK (status IN ('pending', 'contacted', 'negotiating', 'paid', 'in_progress', 'delivered', 'cancelled', 'refunded'))

-- ============================================
-- VERIFICATION TEST
-- ============================================
-- Try inserting a test row to verify it works:
-- INSERT INTO client_requests (
--   full_name, 
--   whatsapp_number, 
--   website_type, 
--   budget, 
--   status
-- ) VALUES (
--   'Test User',
--   '+1234567890',
--   'business',
--   'under-500',
--   'pending'
-- );
-- 
-- Then delete it:
-- DELETE FROM client_requests WHERE full_name = 'Test User' AND whatsapp_number = '+1234567890';
