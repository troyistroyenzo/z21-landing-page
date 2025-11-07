-- =================================================================
-- Z21 Platform - SAFE Additive Migration
-- Works with existing tables - only adds missing elements
-- =================================================================

-- Step 1: Add missing columns to existing tables (safe operations)
-- =================================================================

-- Add tracking columns to AI Resources (if they don't exist)
ALTER TABLE ai_resources 
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS engagement_score DECIMAL DEFAULT 0;

-- Set default values for any existing rows
UPDATE ai_resources 
SET click_count = COALESCE(click_count, 0),
    view_count = COALESCE(view_count, 0),
    engagement_score = COALESCE(engagement_score, 0);

-- Step 2: Create helper functions (safe to recreate)
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

-- Step 3: Add indexes (safe - IF NOT EXISTS)
-- =================================================================

-- Indexes for newsletter_subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);

-- Indexes for cta_responses (use existing column name with quotes)
CREATE INDEX IF NOT EXISTS idx_cta_responses_email ON cta_responses(email);
CREATE INDEX IF NOT EXISTS idx_cta_responses_created_at ON cta_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_responses_current_role ON cta_responses("current_role");

-- Indexes for onboarding_intake
CREATE INDEX IF NOT EXISTS idx_onboarding_intake_email ON onboarding_intake(email);
CREATE INDEX IF NOT EXISTS idx_onboarding_intake_created_at ON onboarding_intake(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_intake_status ON onboarding_intake(status);

-- Indexes for ai_resources
CREATE INDEX IF NOT EXISTS idx_ai_resources_featured ON ai_resources(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_ai_resources_category ON ai_resources(category);
CREATE INDEX IF NOT EXISTS idx_ai_resources_type ON ai_resources(type);
CREATE INDEX IF NOT EXISTS idx_ai_resources_last_clicked_at ON ai_resources(last_clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resources_click_count ON ai_resources(click_count DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resources_engagement_score ON ai_resources(engagement_score DESC);

-- Indexes for resource_searches
CREATE INDEX IF NOT EXISTS idx_resource_searches_query ON resource_searches(search_query);
CREATE INDEX IF NOT EXISTS idx_resource_searches_created_at ON resource_searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_searches_selected ON resource_searches(selected_resource_id);

-- Step 4: Enable Row Level Security (safe if already enabled)
-- =================================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_searches ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies (drop existing first to avoid conflicts)
-- =================================================================

-- Newsletter Subscribers Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Service role has full access to newsletter_subscribers" ON newsletter_subscribers;
    DROP POLICY IF EXISTS "Admin users can view newsletter subscribers" ON newsletter_subscribers;
    DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
    DROP POLICY IF EXISTS "Admin users can delete newsletter subscribers" ON newsletter_subscribers;
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignore errors if policies don't exist
END $$;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can view newsletter subscribers"
  ON newsletter_subscribers FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- CTA Responses Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Service role has full access to cta_responses" ON cta_responses;
    DROP POLICY IF EXISTS "Admin users can view CTA responses" ON cta_responses;
    DROP POLICY IF EXISTS "Anyone can submit CTA" ON cta_responses;
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignore errors if policies don't exist
END $$;

CREATE POLICY "Anyone can submit CTA"
  ON cta_responses FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can view CTA responses"
  ON cta_responses FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- Onboarding Intake Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admin users can view onboarding intake" ON onboarding_intake;
    DROP POLICY IF EXISTS "Anyone can submit onboarding" ON onboarding_intake;
    DROP POLICY IF EXISTS "Admin users can update onboarding intake" ON onboarding_intake;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can submit onboarding"
  ON onboarding_intake FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can view onboarding intake"
  ON onboarding_intake FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

CREATE POLICY "Admin users can update onboarding intake"
  ON onboarding_intake FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- AI Resources Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view AI resources" ON ai_resources;
    DROP POLICY IF EXISTS "Admin users can create AI resources" ON ai_resources;
    DROP POLICY IF EXISTS "Admin users can update AI resources" ON ai_resources;
    DROP POLICY IF EXISTS "Admin users can delete AI resources" ON ai_resources;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

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

-- Resource Searches Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can log searches" ON resource_searches;
    DROP POLICY IF EXISTS "Admin users can view search logs" ON resource_searches;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can log searches"
  ON resource_searches FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can view search logs"
  ON resource_searches FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  ));

-- Step 6: Set featured resources (update existing data)
-- =================================================================
-- Reset all to not featured first
UPDATE ai_resources SET featured = false WHERE featured IS NOT NULL;

-- Set specific resources as featured
UPDATE ai_resources 
SET featured = true 
WHERE title IN (
  'n8n-MCP',
  'Yupp.ai', 
  'Open LLM Leaderboard',
  'Z.AI Chat'
);

-- Step 7: Configure admin access
-- =================================================================
SELECT set_admin_emails('yortozne@gmail.com');

-- Step 8: Update engagement scores for existing resources
-- =================================================================
UPDATE ai_resources 
SET engagement_score = calculate_engagement_score(
  COALESCE(click_count, 0),
  COALESCE(view_count, 0)
)
WHERE engagement_score IS NOT NULL;

-- Verification: Show what we have
-- =================================================================
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  RAISE NOTICE '=== Z21 Safe Migration Complete ===';
  
  -- Count existing data
  SELECT COUNT(*) INTO table_count FROM newsletter_subscribers;
  RAISE NOTICE 'Newsletter subscribers: %', table_count;
  
  SELECT COUNT(*) INTO table_count FROM cta_responses;
  RAISE NOTICE 'CTA responses: %', table_count;
  
  SELECT COUNT(*) INTO table_count FROM onboarding_intake;
  RAISE NOTICE 'Onboarding intake: %', table_count;
  
  SELECT COUNT(*) INTO table_count FROM ai_resources;
  RAISE NOTICE 'AI resources: %', table_count;
  
  SELECT COUNT(*) INTO table_count FROM ai_resources WHERE featured = true;
  RAISE NOTICE 'Featured resources: %', table_count;
  
  RAISE NOTICE 'Admin email: %', current_setting('app.admin_emails', true);
  RAISE NOTICE '✅ All existing data preserved!';
END $$;
