-- Add scoring columns to onboarding_intake table
-- This migration adds fit_score and score_breakdown for intelligent applicant scoring

-- Add fit_score column (0-100 score)
ALTER TABLE onboarding_intake
ADD COLUMN IF NOT EXISTS fit_score INTEGER DEFAULT 0;

-- Add score_breakdown column (stores detailed scoring)
ALTER TABLE onboarding_intake
ADD COLUMN IF NOT EXISTS score_breakdown JSONB DEFAULT '{}'::jsonb;

-- Add fit_tier column (STRONG_FIT, GOOD_FIT, MAYBE, NOT_NOW)
ALTER TABLE onboarding_intake
ADD COLUMN IF NOT EXISTS fit_tier TEXT DEFAULT 'NOT_NOW';

-- Add index on fit_score for faster sorting
CREATE INDEX IF NOT EXISTS idx_onboarding_fit_score 
ON onboarding_intake(fit_score DESC);

-- Add index on fit_tier for filtering
CREATE INDEX IF NOT EXISTS idx_onboarding_fit_tier 
ON onboarding_intake(fit_tier);

-- Add comment
COMMENT ON COLUMN onboarding_intake.fit_score IS 'Applicant fit score (0-100) based on revenue, AI familiarity, timeline, and commitment';
COMMENT ON COLUMN onboarding_intake.score_breakdown IS 'Detailed scoring breakdown with revenue, AI, timeline, and commitment scores';
COMMENT ON COLUMN onboarding_intake.fit_tier IS 'Fit tier: STRONG_FIT, GOOD_FIT, MAYBE, or NOT_NOW';

SELECT 'Scoring columns added successfully' AS status;
