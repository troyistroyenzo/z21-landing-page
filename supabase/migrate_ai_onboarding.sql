-- Migration: Update CTA Responses table for AI Onboarding Sprint
-- This migration adds all new fields required for the AI Onboarding questions

-- Drop the old table (WARNING: This will delete existing data)
-- If you want to preserve data, use ALTER TABLE instead
DROP TABLE IF EXISTS cta_responses CASCADE;

-- Create updated CTA Responses table
CREATE TABLE cta_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic Info (Q1-Q5)
  name VARCHAR(255) NOT NULL,
  work_description TEXT NOT NULL,
  profile_link TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  referral_source VARCHAR(100) NOT NULL,
  
  -- Path Choice (Q6)
  sprint_type VARCHAR(50) NOT NULL, -- 'ai_onboarding' or 'personal_branding'
  
  -- AI Onboarding Path (Q7-Q20) - All nullable since they depend on sprint_type
  ai_motivation TEXT,
  role_description VARCHAR(100),
  time_commitment VARCHAR(50),
  start_timeline VARCHAR(50),
  ai_readiness INTEGER, -- 0-10 scale
  tool_stack JSONB, -- array of selected tools
  focus_areas JSONB, -- array of focus areas (2-3 items)
  sample_data VARCHAR(10), -- 'yes' or 'no'
  dwy_confirmation VARCHAR(10), -- 'yes' or 'no'
  preferred_format VARCHAR(50),
  success_metrics JSONB, -- array of metrics (up to 3)
  budget_readiness VARCHAR(50),
  additional_info TEXT,
  confirmations JSONB, -- array of 4 confirmed items
  
  -- Scoring & Qualification
  fit_score INTEGER,
  has_knockout BOOLEAN DEFAULT false,
  qualification_status VARCHAR(50), -- 'strong_fit', 'conditional', 'not_qualified'
  
  -- Tracking fields
  source_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT chk_sprint_type CHECK (sprint_type IN ('ai_onboarding', 'personal_branding')),
  CONSTRAINT chk_ai_readiness CHECK (ai_readiness IS NULL OR (ai_readiness >= 0 AND ai_readiness <= 10)),
  CONSTRAINT chk_qualification CHECK (qualification_status IN ('strong_fit', 'conditional', 'not_qualified', NULL))
);

-- Create indexes for better query performance
CREATE INDEX idx_cta_responses_email ON cta_responses(email);
CREATE INDEX idx_cta_responses_created_at ON cta_responses(created_at DESC);
CREATE INDEX idx_cta_responses_sprint_type ON cta_responses(sprint_type);
CREATE INDEX idx_cta_responses_qualification ON cta_responses(qualification_status);
CREATE INDEX idx_cta_responses_fit_score ON cta_responses(fit_score DESC);
CREATE INDEX idx_cta_responses_has_knockout ON cta_responses(has_knockout);

-- Enable Row Level Security (RLS)
ALTER TABLE cta_responses ENABLE ROW LEVEL SECURITY;

-- Create a policy for service role to have full access
CREATE POLICY "Service role has full access to cta_responses" 
  ON cta_responses 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Create view for AI Onboarding applicants only
CREATE OR REPLACE VIEW ai_onboarding_applicants AS
SELECT 
  id,
  created_at,
  name,
  email,
  work_description,
  profile_link,
  referral_source,
  ai_motivation,
  role_description,
  time_commitment,
  start_timeline,
  ai_readiness,
  tool_stack,
  focus_areas,
  sample_data,
  dwy_confirmation,
  preferred_format,
  success_metrics,
  budget_readiness,
  additional_info,
  confirmations,
  fit_score,
  has_knockout,
  qualification_status,
  source_url,
  metadata->>'ip' as ip_address,
  metadata->>'user_agent' as user_agent
FROM cta_responses
WHERE sprint_type = 'ai_onboarding'
ORDER BY created_at DESC;

-- Create view for strong fit candidates
CREATE OR REPLACE VIEW strong_fit_candidates AS
SELECT 
  *,
  CASE 
    WHEN fit_score >= 12 THEN 'excellent'
    WHEN fit_score >= 10 THEN 'very_good'
    WHEN fit_score >= 8 THEN 'good'
    ELSE 'needs_review'
  END as fit_category
FROM ai_onboarding_applicants
WHERE qualification_status = 'strong_fit' AND has_knockout = false
ORDER BY fit_score DESC, created_at DESC;

-- Create function to calculate fit score
CREATE OR REPLACE FUNCTION calculate_fit_score(
  p_time_commitment VARCHAR,
  p_start_timeline VARCHAR,
  p_ai_readiness INTEGER,
  p_focus_areas JSONB,
  p_sample_data VARCHAR,
  p_dwy_confirmation VARCHAR,
  p_budget_readiness VARCHAR,
  p_confirmations JSONB
)
RETURNS TABLE(score INTEGER, has_knockout BOOLEAN, status VARCHAR) 
LANGUAGE plpgsql
AS $$
DECLARE
  v_score INTEGER := 0;
  v_knockout BOOLEAN := false;
  v_status VARCHAR;
BEGIN
  -- Q9: Time commitment (weight: 2)
  IF p_time_commitment = '4-6' THEN
    v_score := v_score + 2;
  ELSIF p_time_commitment = '2-3' THEN
    v_score := v_score + 1;
  END IF;
  
  -- Q10: Start timeline (weight: 2)
  IF p_start_timeline = 'within_14' THEN
    v_score := v_score + 2;
  ELSIF p_start_timeline = '15-30' THEN
    v_score := v_score + 1;
  END IF;
  
  -- Q11: AI readiness (weight: 2)
  IF p_ai_readiness >= 8 THEN
    v_score := v_score + 2;
  ELSIF p_ai_readiness >= 5 THEN
    v_score := v_score + 1;
  END IF;
  
  -- Q13: Focus areas (weight: 2 if has selections)
  IF jsonb_array_length(p_focus_areas) > 0 THEN
    v_score := v_score + 2;
  END IF;
  
  -- Q14: Sample data (weight: 2, knockout if 'no')
  IF p_sample_data = 'yes' THEN
    v_score := v_score + 2;
  ELSIF p_sample_data = 'no' THEN
    v_knockout := true;
  END IF;
  
  -- Q15: DWY confirmation (weight: 2, knockout if 'no')
  IF p_dwy_confirmation = 'yes' THEN
    v_score := v_score + 2;
  ELSIF p_dwy_confirmation = 'no' THEN
    v_knockout := true;
  END IF;
  
  -- Q18: Budget readiness (weight: 2)
  IF p_budget_readiness = 'ready' THEN
    v_score := v_score + 2;
  ELSIF p_budget_readiness = 'payment_plan' THEN
    v_score := v_score + 1;
  END IF;
  
  -- Q20: Confirmations (weight: 2, knockout if not all 4 checked)
  IF jsonb_array_length(p_confirmations) = 4 THEN
    v_score := v_score + 2;
  ELSE
    v_knockout := true;
  END IF;
  
  -- Determine status
  IF v_knockout THEN
    v_status := 'not_qualified';
  ELSIF v_score >= 8 THEN
    v_status := 'strong_fit';
  ELSIF v_score >= 6 THEN
    v_status := 'conditional';
  ELSE
    v_status := 'not_qualified';
  END IF;
  
  RETURN QUERY SELECT v_score, v_knockout, v_status;
END;
$$;

-- Create function to get application statistics
CREATE OR REPLACE FUNCTION get_ai_onboarding_stats()
RETURNS TABLE(
  total_applications BIGINT,
  applications_today BIGINT,
  applications_this_week BIGINT,
  applications_this_month BIGINT,
  strong_fit_count BIGINT,
  conditional_count BIGINT,
  not_qualified_count BIGINT,
  avg_fit_score NUMERIC,
  top_focus_areas JSONB,
  avg_ai_readiness NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_applications,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::BIGINT as applications_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as applications_this_week,
    COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))::BIGINT as applications_this_month,
    COUNT(*) FILTER (WHERE qualification_status = 'strong_fit')::BIGINT as strong_fit_count,
    COUNT(*) FILTER (WHERE qualification_status = 'conditional')::BIGINT as conditional_count,
    COUNT(*) FILTER (WHERE qualification_status = 'not_qualified')::BIGINT as not_qualified_count,
    ROUND(AVG(fit_score), 2) as avg_fit_score,
    (
      SELECT jsonb_agg(DISTINCT elem)
      FROM cta_responses, jsonb_array_elements(focus_areas) elem
      WHERE sprint_type = 'ai_onboarding'
      LIMIT 10
    ) as top_focus_areas,
    ROUND(AVG(ai_readiness), 2) as avg_ai_readiness
  FROM cta_responses
  WHERE sprint_type = 'ai_onboarding';
END;
$$;

-- Grant necessary permissions
GRANT ALL ON cta_responses TO service_role;
GRANT SELECT ON ai_onboarding_applicants TO service_role;
GRANT SELECT ON strong_fit_candidates TO service_role;
GRANT EXECUTE ON FUNCTION calculate_fit_score TO service_role;
GRANT EXECUTE ON FUNCTION get_ai_onboarding_stats TO service_role;

-- Add comment for documentation
COMMENT ON TABLE cta_responses IS 'Stores CTA form responses for both AI Onboarding and Personal Branding sprints';
COMMENT ON COLUMN cta_responses.fit_score IS 'Calculated score based on weighted questions (0-16 points possible)';
COMMENT ON COLUMN cta_responses.qualification_status IS 'strong_fit: >=8 points no knockouts, conditional: 6-7 points, not_qualified: <=5 or has knockouts';
