-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'unknown', -- 'ai-resources', 'footer', 'homepage', etc.
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for email lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Add index for source analytics
CREATE INDEX idx_newsletter_source ON newsletter_subscribers(source);

-- Add RLS policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from public (no auth required for newsletter)
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON newsletter_subscribers 
  FOR INSERT 
  WITH CHECK (true);

-- Only service role can read subscriber data
CREATE POLICY "Service role can read subscribers" 
  ON newsletter_subscribers 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND auth.jwt() ->> 'role' = 'service_role');

-- Comment
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscriber list with source tracking';
