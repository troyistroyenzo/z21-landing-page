-- =================================================================
-- Z21 Platform Complete Database Setup
-- Run this single file to set up everything in the correct order
-- =================================================================

-- Step 1: Create all base tables if they don't exist
-- =================================================================

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(100),
  referrer TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- CTA Responses Table
CREATE TABLE IF NOT EXISTS cta_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Form fields
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  current_role VARCHAR(100) NOT NULL,
  biggest_challenge VARCHAR(100) NOT NULL,
  time_commitment VARCHAR(50) NOT NULL,
  specific_goal TEXT NOT NULL,
  urgency VARCHAR(50) NOT NULL,
  
  -- Tracking fields
  source_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Onboarding Intake Table
CREATE TABLE IF NOT EXISTS onboarding_intake (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Personal Info
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  website VARCHAR(500),
  profile_link VARCHAR(500),
  
  -- Intake Responses
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Tracking
  source VARCHAR(100),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Admin fields
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by VARCHAR(255)
);

-- AI Resources Table
CREATE TABLE IF NOT EXISTS ai_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tool', 'article', 'video', 'prompt-library', 'course', 'forum')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  thumbnail TEXT,
  submitted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add tracking columns to AI Resources
-- =================================================================
ALTER TABLE ai_resources 
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS engagement_score DECIMAL DEFAULT 0;

-- Update existing rows to have default values
UPDATE ai_resources 
SET click_count = COALESCE(click_count, 0),
    view_count = COALESCE(view_count, 0),
    engagement_score = COALESCE(engagement_score, 0);

-- Step 3: Create search logging table
-- =================================================================
CREATE TABLE IF NOT EXISTS resource_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  searched_at TIMESTAMPTZ DEFAULT NOW(),
  user_session TEXT,
  results_count INTEGER DEFAULT 0,
  selected_resource_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create helper functions
-- =================================================================

-- Engagement score calculation function
CREATE OR REPLACE FUNCTION calculate_engagement_score(
  p_click_count INTEGER,
  p_view_count INTEGER
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (COALESCE(p_click_count, 0) * 2.0) + (COALESCE(p_view_count, 0) * 0.5);
END;
$$ LANGUAGE plpgsql;

-- Admin email configuration functions
CREATE OR REPLACE FUNCTION set_admin_emails(emails text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.admin_emails', emails, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create all indexes
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cta_responses_email ON cta_responses(email);
CREATE INDEX IF NOT EXISTS idx_cta_responses_created_at ON cta_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_responses_current_role ON cta_responses(current_role);

CREATE INDEX IF NOT EXISTS idx_onboarding_intake_email ON onboarding_intake(email);
CREATE INDEX IF NOT EXISTS idx_onboarding_intake_created_at ON onboarding_intake(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_intake_status ON onboarding_intake(status);

CREATE INDEX IF NOT EXISTS idx_ai_resources_featured ON ai_resources(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_ai_resources_category ON ai_resources(category);
CREATE INDEX IF NOT EXISTS idx_ai_resources_type ON ai_resources(type);
CREATE INDEX IF NOT EXISTS idx_ai_resources_last_clicked_at ON ai_resources(last_clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resources_click_count ON ai_resources(click_count DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resources_engagement_score ON ai_resources(engagement_score DESC);

CREATE INDEX IF NOT EXISTS idx_resource_searches_query ON resource_searches(search_query);
CREATE INDEX IF NOT EXISTS idx_resource_searches_created_at ON resource_searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_searches_selected ON resource_searches(selected_resource_id);

-- Step 6: Enable Row Level Security
-- =================================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_searches ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS Policies
-- =================================================================

-- Newsletter Subscribers Policies
DROP POLICY IF EXISTS "Admin users can view newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin users can delete newsletter subscribers" ON newsletter_subscribers;

CREATE POLICY "Admin users can view newsletter subscribers"
  ON newsletter_subscribers FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can delete newsletter subscribers"
  ON newsletter_subscribers FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- CTA Responses Policies
DROP POLICY IF EXISTS "Admin users can view CTA responses" ON cta_responses;
DROP POLICY IF EXISTS "Anyone can submit CTA" ON cta_responses;
DROP POLICY IF EXISTS "Admin users can delete CTA responses" ON cta_responses;

CREATE POLICY "Admin users can view CTA responses"
  ON cta_responses FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

CREATE POLICY "Anyone can submit CTA"
  ON cta_responses FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can delete CTA responses"
  ON cta_responses FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- Onboarding Intake Policies
DROP POLICY IF EXISTS "Admin users can view onboarding intake" ON onboarding_intake;
DROP POLICY IF EXISTS "Anyone can submit onboarding" ON onboarding_intake;
DROP POLICY IF EXISTS "Admin users can update onboarding intake" ON onboarding_intake;
DROP POLICY IF EXISTS "Admin users can delete onboarding intake" ON onboarding_intake;

CREATE POLICY "Admin users can view onboarding intake"
  ON onboarding_intake FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

CREATE POLICY "Anyone can submit onboarding"
  ON onboarding_intake FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update onboarding intake"
  ON onboarding_intake FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

CREATE POLICY "Admin users can delete onboarding intake"
  ON onboarding_intake FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- AI Resources Policies
DROP POLICY IF EXISTS "Anyone can view AI resources" ON ai_resources;
DROP POLICY IF EXISTS "Admin users can create AI resources" ON ai_resources;
DROP POLICY IF EXISTS "Admin users can update AI resources" ON ai_resources;
DROP POLICY IF EXISTS "Admin users can delete AI resources" ON ai_resources;

CREATE POLICY "Anyone can view AI resources"
  ON ai_resources FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin users can create AI resources"
  ON ai_resources FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

CREATE POLICY "Admin users can update AI resources"
  ON ai_resources FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

CREATE POLICY "Admin users can delete AI resources"
  ON ai_resources FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- Resource Searches Policies
DROP POLICY IF EXISTS "Anyone can log searches" ON resource_searches;
DROP POLICY IF EXISTS "Admin users can view search logs" ON resource_searches;

CREATE POLICY "Anyone can log searches"
  ON resource_searches FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can view search logs"
  ON resource_searches FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- Step 8: Set featured resources (optional - update titles as needed)
-- =================================================================
UPDATE ai_resources SET featured = false;

UPDATE ai_resources 
SET featured = true 
WHERE title IN (
  'n8n-MCP',
  'Yupp.ai',
  'Open LLM Leaderboard',
  'Z.AI Chat'
);

-- Step 9: Set admin emails (IMPORTANT: Update with your actual email)
-- =================================================================
SELECT set_admin_emails('yortozne@gmail.com');

-- Step 10: Update engagement scores for existing resources
-- =================================================================
UPDATE ai_resources 
SET engagement_score = calculate_engagement_score(
  COALESCE(click_count, 0),
  COALESCE(view_count, 0)
);

-- Verification: Show setup results
-- =================================================================
DO $$
BEGIN
  RAISE NOTICE '=== Z21 Database Setup Complete ===';
  RAISE NOTICE 'Tables created with RLS enabled:';
  RAISE NOTICE '- newsletter_subscribers: %', (SELECT COUNT(*) FROM newsletter_subscribers);
  RAISE NOTICE '- cta_responses: %', (SELECT COUNT(*) FROM cta_responses);
  RAISE NOTICE '- onboarding_intake: %', (SELECT COUNT(*) FROM onboarding_intake);
  RAISE NOTICE '- ai_resources: %', (SELECT COUNT(*) FROM ai_resources);
  RAISE NOTICE '- resource_searches: %', (SELECT COUNT(*) FROM resource_searches);
  RAISE NOTICE 'Featured resources: %', (SELECT COUNT(*) FROM ai_resources WHERE featured = true);
  RAISE NOTICE 'Admin email configured: %', current_setting('app.admin_emails', true);
END $$;
