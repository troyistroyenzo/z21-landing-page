# Apply Page Views Migration to Supabase

## Quick Steps to Fix the Analytics Error

The analytics dashboard is failing because the `page_views` table doesn't exist in your Supabase database yet. Follow these steps to fix it:

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Copy and Run This SQL

Copy the entire SQL below and paste it into the SQL Editor, then click **Run**:

```sql
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
```

### Step 3: Verify Success

After running the SQL, you should see a success message. You can verify the table was created by:

1. Go to **Table Editor** in Supabase
2. Look for `page_views` in the tables list

### Step 4: Test Your Analytics Dashboard

1. Refresh your Next.js app (the dev server may need restarting)
2. Visit your site to generate some page views
3. Go to `/admin` and click the Analytics tab
4. You should now see the analytics dashboard working!

### What This Creates

- **page_views table**: Stores every page visit with metadata
- **Indexes**: For fast queries on common filters
- **daily_page_stats view**: Pre-aggregated daily stats for performance
- **RLS policies**: Security rules (anyone can track views, only admins can read them)
- **Permissions**: Proper grants for anon and authenticated users

### Troubleshooting

If you still see errors after running the migration:

1. **Restart your Next.js dev server**: `npm run dev`
2. **Check Supabase logs**: Look in the Supabase dashboard for any error messages
3. **Verify table exists**: Use the Table Editor to confirm `page_views` is there
4. **Check RLS policies**: Ensure your admin email matches what you use to log in

---

After completing these steps, your analytics dashboard should work perfectly! 🎉
