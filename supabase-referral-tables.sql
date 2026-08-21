-- Referral Clicks Table (tracks all affiliate link clicks)
CREATE TABLE IF NOT EXISTS referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Requests Table (website inquiry form submissions)
CREATE TABLE IF NOT EXISTS client_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  business_name TEXT,
  website_type TEXT NOT NULL,
  budget TEXT NOT NULL,
  project_description TEXT,
  affiliate_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'paid', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions Table (tracks affiliate earnings)
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_request_id UUID NOT NULL REFERENCES client_requests(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_commission_per_request UNIQUE (client_request_id)
);

-- Withdrawals Table (affiliate payout requests)
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  bank_account_name TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_clicks_affiliate ON referral_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_product ON referral_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_client_requests_affiliate ON client_requests(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_client_requests_status ON client_requests(status);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_affiliate ON withdrawals(affiliate_id);

-- Enable RLS
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Affiliates can view their own clicks"
  ON referral_clicks FOR SELECT
  TO authenticated
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Anyone can create client requests"
  ON client_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Affiliates can view requests from their referrals"
  ON client_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can view their own commissions"
  ON commissions FOR SELECT
  TO authenticated
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can view their own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can create withdrawal requests"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = affiliate_id);

-- Service role can do everything
CREATE POLICY "Service role can manage all referral data"
  ON referral_clicks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all requests"
  ON client_requests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all commissions"
  ON commissions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all withdrawals"
  ON withdrawals FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
