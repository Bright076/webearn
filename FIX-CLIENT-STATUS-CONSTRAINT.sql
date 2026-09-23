-- Fix client_requests status constraint to match the correct allowed values
-- This fixes the "violates check constraint client_requests_status_check" error

-- First, drop the existing constraint
ALTER TABLE client_requests DROP CONSTRAINT IF EXISTS client_requests_status_check;

-- Add the correct constraint with all valid status values
ALTER TABLE client_requests 
  ADD CONSTRAINT client_requests_status_check 
  CHECK (status IN ('pending', 'contacted', 'quoted', 'paid', 'completed', 'cancelled'));

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'client_requests'::regclass 
AND conname = 'client_requests_status_check';
