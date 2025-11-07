-- Add scoring columns to cta_responses table
-- This migration adds fit_tier and score_breakdown for the new 100-point scoring system

-- Add fit_tier column (STRONG_FIT, GOOD_FIT, MAYBE, NOT_NOW)
ALTER TABLE cta_responses
ADD COLUMN IF NOT EXISTS fit_tier TEXT;

-- Add score_breakdown column (stores detailed scoring)
ALTER TABLE cta_responses
ADD COLUMN IF NOT EXISTS score_breakdown JSONB DEFAULT '{}'::jsonb;

-- Note: fit_score already exists in this table, we'll just update it from 20-point to 100-point scale

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_cta_fit_score 
ON cta_responses(fit_score DESC);

CREATE INDEX IF NOT EXISTS idx_cta_fit_tier 
ON cta_responses(fit_tier);

-- Add comments
COMMENT ON COLUMN cta_responses.fit_tier IS 'Fit tier: STRONG_FIT, GOOD_FIT, MAYBE, or NOT_NOW';
COMMENT ON COLUMN cta_responses.score_breakdown IS 'Detailed scoring breakdown with revenue, AI, timeline, and commitment scores';

SELECT 'CTA scoring columns added successfully' AS status;
