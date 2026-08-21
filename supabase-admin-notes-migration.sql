-- Add admin_notes field to client_requests table
ALTER TABLE client_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update existing requests to have null admin_notes
UPDATE client_requests SET admin_notes = NULL WHERE admin_notes IS NULL;
