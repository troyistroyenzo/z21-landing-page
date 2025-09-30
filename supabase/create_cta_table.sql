-- Create CTA Responses table
CREATE TABLE IF NOT EXISTS cta_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Form fields
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  "current_role" VARCHAR(100) NOT NULL,
  biggest_challenge VARCHAR(100) NOT NULL,
  time_commitment VARCHAR(50) NOT NULL,
  specific_goal TEXT NOT NULL,
  urgency VARCHAR(50) NOT NULL,
  
  -- Tracking fields
  source_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cta_responses_email ON cta_responses(email);
CREATE INDEX IF NOT EXISTS idx_cta_responses_created_at ON cta_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_responses_current_role ON cta_responses("current_role");
CREATE INDEX IF NOT EXISTS idx_cta_responses_urgency ON cta_responses(urgency);

-- Enable Row Level Security (RLS)
ALTER TABLE cta_responses ENABLE ROW LEVEL SECURITY;

-- Create a policy for service role to have full access
CREATE POLICY "Service role has full access to cta_responses" 
  ON cta_responses 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Optional: Create a view for easier querying
CREATE OR REPLACE VIEW cta_responses_summary AS
SELECT 
  id,
  created_at,
  name,
  email,
  "current_role",
  biggest_challenge,
  time_commitment,
  specific_goal,
  urgency,
  source_url,
  metadata->>'ip' as ip_address,
  metadata->>'user_agent' as user_agent,
  metadata->>'submitted_at' as submitted_at
FROM cta_responses
ORDER BY created_at DESC;

-- Optional: Create a function to get response statistics
CREATE OR REPLACE FUNCTION get_cta_stats()
RETURNS TABLE(
  total_responses BIGINT,
  responses_today BIGINT,
  responses_this_week BIGINT,
  responses_this_month BIGINT,
  top_roles JSONB,
  top_challenges JSONB,
  urgency_breakdown JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_responses,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::BIGINT as responses_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as responses_this_week,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE))::BIGINT as responses_this_month,
    (
      SELECT jsonb_object_agg("current_role", count) 
      FROM (
        SELECT "current_role", COUNT(*) as count 
        FROM cta_responses 
        GROUP BY "current_role" 
        ORDER BY count DESC 
        LIMIT 5
      ) t
    ) as top_roles,
    (
      SELECT jsonb_object_agg(biggest_challenge, count) 
      FROM (
        SELECT biggest_challenge, COUNT(*) as count 
        FROM cta_responses 
        GROUP BY biggest_challenge 
        ORDER BY count DESC 
        LIMIT 5
      ) t
    ) as top_challenges,
    (
      SELECT jsonb_object_agg(urgency, count) 
      FROM (
        SELECT urgency, COUNT(*) as count 
        FROM cta_responses 
        GROUP BY urgency
      ) t
    ) as urgency_breakdown
  FROM cta_responses;
END;
$$;

-- Grant necessary permissions
GRANT ALL ON cta_responses TO service_role;
GRANT SELECT ON cta_responses_summary TO service_role;
GRANT EXECUTE ON FUNCTION get_cta_stats() TO service_role;