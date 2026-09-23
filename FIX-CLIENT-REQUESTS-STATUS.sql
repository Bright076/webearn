-- Fix the client_requests status constraint to allow 'pending'
-- Drop the old constraint
ALTER TABLE client_requests DROP CONSTRAINT IF EXISTS client_requests_status_check;

-- Add the correct constraint that includes all valid statuses
ALTER TABLE client_requests 
ADD CONSTRAINT client_requests_status_check 
CHECK (status IN ('pending', 'contacted', 'in_progress', 'paid', 'cancelled', 'refunded'));

-- Update any existing records if needed (optional)
-- UPDATE client_requests SET status = 'pending' WHERE status = 'submitted';
