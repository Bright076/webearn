-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- NOTE: We don't add an INSERT policy here because admins will use the service role
-- to bypass RLS when sending notifications. This avoids the infinite recursion issue.

-- Function to create notification when client request is created
CREATE OR REPLACE FUNCTION notify_affiliate_on_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if there's an affiliate_id
  IF NEW.affiliate_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      NEW.affiliate_id,
      'New Lead Generated! 🎉',
      'A client just used your referral link and submitted a request. Check your leads page for details.',
      'success',
      '/dashboard/leads'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new client requests
DROP TRIGGER IF EXISTS notify_affiliate_on_new_request ON client_requests;
CREATE TRIGGER notify_affiliate_on_new_request
  AFTER INSERT ON client_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_affiliate_on_lead();

-- Function to notify affiliate when commission is approved
CREATE OR REPLACE FUNCTION notify_affiliate_on_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify when status changes to 'approved' or 'paid'
  IF NEW.status IN ('approved', 'paid') AND OLD.status = 'pending' THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      NEW.affiliate_id,
      'Commission Approved! 💰',
      'Your commission of $' || NEW.amount || ' has been approved and added to your balance.',
      'success',
      '/dashboard/earnings'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for commission status changes
DROP TRIGGER IF EXISTS notify_affiliate_on_commission_update ON commissions;
CREATE TRIGGER notify_affiliate_on_commission_update
  AFTER UPDATE ON commissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_affiliate_on_commission();

-- Function to notify affiliate when withdrawal is processed
CREATE OR REPLACE FUNCTION notify_affiliate_on_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify when withdrawal is approved
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      NEW.affiliate_id,
      'Withdrawal Approved ✓',
      'Your withdrawal request of $' || NEW.amount || ' has been approved and will be processed shortly.',
      'info',
      '/dashboard/withdrawals'
    );
  END IF;
  
  -- Notify when withdrawal is paid
  IF NEW.status = 'paid' AND OLD.status = 'approved' THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      NEW.affiliate_id,
      'Payment Sent! 💵',
      'Your withdrawal of $' || NEW.amount || ' has been processed and sent to your bank account.',
      'success',
      '/dashboard/withdrawals'
    );
  END IF;
  
  -- Notify when withdrawal is rejected
  IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      NEW.affiliate_id,
      'Withdrawal Rejected',
      'Your withdrawal request was rejected. Reason: ' || COALESCE(NEW.rejection_reason, 'No reason provided'),
      'error',
      '/dashboard/withdrawals'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for withdrawal status changes
DROP TRIGGER IF EXISTS notify_affiliate_on_withdrawal_update ON withdrawals;
CREATE TRIGGER notify_affiliate_on_withdrawal_update
  AFTER UPDATE ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION notify_affiliate_on_withdrawal();
