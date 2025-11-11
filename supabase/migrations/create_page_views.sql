-- Create page_views table for self-hosted analytics
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  referrer VARCHAR(255),
  user_agent TEXT,
  session_id VARCHAR(100),
  ip_hash VARCHAR(64), -- Hashed IP for privacy
  country VARCHAR(2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_date ON page_views(DATE(created_at));

-- Create daily aggregated stats view for faster queries
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_page_stats AS
SELECT 
  DATE(created_at) as date,
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_visitors
FROM page_views
GROUP BY DATE(created_at), page_path
WITH DATA;

-- Create index on the materialized view
CREATE INDEX idx_daily_stats_date ON daily_page_stats(date DESC);
CREATE INDEX idx_daily_stats_page_path ON daily_page_stats(page_path);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_daily_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_page_stats;
END;
$$;

-- Enable RLS (Row Level Security)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (track views)
CREATE POLICY "Anyone can track page views" ON page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only admins can read analytics data
CREATE POLICY "Only admins can read page views" ON page_views
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(
      COALESCE(current_setting('app.admin_emails', true), ''),
      ','
    ))
  ));

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON page_views TO anon, authenticated;
GRANT SELECT ON page_views TO authenticated;
GRANT SELECT ON daily_page_stats TO authenticated;
