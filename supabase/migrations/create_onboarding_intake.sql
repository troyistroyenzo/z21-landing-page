-- Create onboarding_intake table for Z21 Launchpad intake form
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS onboarding_intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Section 1: About You & Business
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  website_link TEXT,
  business_description TEXT NOT NULL,
  target_customers TEXT NOT NULL,
  
  -- Section 2: Current Setup
  current_tools JSONB, -- array of tool selections
  lead_contact_method TEXT,
  follow_up_process TEXT,
  
  -- Section 3: Goals
  top_priorities TEXT, -- stored as formatted text
  success_definition TEXT,
  ai_familiarity TEXT, -- newbie, beginner, intermediate, advanced
  
  -- Section 4: Logistics
  preferred_schedule JSONB, -- array of schedule preferences
  timezone TEXT,
  team_members TEXT,
  existing_workflows TEXT,
  
  -- Section 5: Optional
  case_study_consent TEXT, -- yes, maybe, no
  additional_notes TEXT,
  
  -- Metadata
  source_url TEXT,
  metadata JSONB
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_email ON onboarding_intake(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_onboarding_created ON onboarding_intake(created_at DESC);

-- Add comment
COMMENT ON TABLE onboarding_intake IS 'Stores client intake form submissions for Z21 onboarding process';

-- Enable Row Level Security
ALTER TABLE onboarding_intake ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role can manage onboarding_intake"
  ON onboarding_intake
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users cannot access (prevents API leaks)
CREATE POLICY "No public access to onboarding_intake"
  ON onboarding_intake
  FOR SELECT
  TO authenticated, anon
  USING (false);

SELECT 'onboarding_intake table created with RLS enabled' AS status;
