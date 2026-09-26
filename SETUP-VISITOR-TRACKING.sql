-- Create visitor tracking table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  referrer TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  country TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_ip_hash ON page_views(ip_hash);

-- Enable RLS (but allow inserts from anyone for tracking)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert page views (for tracking)
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view page views
CREATE POLICY "Admins can view page views"
  ON page_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to clean old page views (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_page_views()
RETURNS void AS $$
BEGIN
  DELETE FROM page_views 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean old data (run manually or via cron)
-- SELECT cleanup_old_page_views();
