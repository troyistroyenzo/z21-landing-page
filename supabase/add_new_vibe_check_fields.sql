-- Migration: Add new vibe-check fields to cta_responses table
-- Run this in Supabase SQL Editor

-- Add new fields for updated vibe-check form
ALTER TABLE cta_responses 
  ADD COLUMN IF NOT EXISTS social_handle TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT,
  ADD COLUMN IF NOT EXISTS stuck_areas JSONB,
  ADD COLUMN IF NOT EXISTS monthly_revenue TEXT,
  ADD COLUMN IF NOT EXISTS sprint_goals JSONB,
  ADD COLUMN IF NOT EXISTS workflow_owner TEXT,
  ADD COLUMN IF NOT EXISTS investment_readiness TEXT;

-- Add comments for documentation
COMMENT ON COLUMN cta_responses.social_handle IS 'Main social media handle or website (@username or URL)';
COMMENT ON COLUMN cta_responses.phone IS 'Phone number with country code';
COMMENT ON COLUMN cta_responses.experience_level IS 'How long building business: 0-6, 6-24, 2-5, 5+';
COMMENT ON COLUMN cta_responses.stuck_areas IS 'Array of areas where stuck (manual_tasks, no_system, etc.)';
COMMENT ON COLUMN cta_responses.monthly_revenue IS 'Current monthly revenue band: pre_revenue, <2k, 2k-10k, 10k-50k, 50k+';
COMMENT ON COLUMN cta_responses.sprint_goals IS 'Array of top goals for sprint';
COMMENT ON COLUMN cta_responses.workflow_owner IS 'Who will own workflows: me, team, not_sure';
COMMENT ON COLUMN cta_responses.investment_readiness IS 'Investment status: ready, installment, tight';

-- Success message
SELECT 'Migration completed successfully! 8 new columns added to cta_responses table.' AS status;
