-- Fix notifications RLS policy - remove the problematic INSERT policy that causes infinite recursion
-- This happens because the policy checks user_roles, which itself has RLS policies

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can insert notifications for anyone" ON notifications;

-- Add a DELETE policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Users can delete their own notifications'
  ) THEN
    CREATE POLICY "Users can delete their own notifications"
      ON notifications FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Admins will use the service role (admin client) to insert notifications
-- This bypasses RLS entirely and avoids the recursion issue
