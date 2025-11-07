-- =================================================================
-- MINIMAL SAFE MIGRATION - Works with ANY existing schema
-- Only adds missing elements, doesn't recreate anything
-- =================================================================

-- Step 1: Add missing tracking columns to ai_resources (safe)
-- =================================================================
DO $$ 
BEGIN
    -- Only add columns if they don't already exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_resources' AND column_name = 'click_count') THEN
        ALTER TABLE ai_resources ADD COLUMN click_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_resources' AND column_name = 'view_count') THEN
        ALTER TABLE ai_resources ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_resources' AND column_name = 'last_clicked_at') THEN
        ALTER TABLE ai_resources ADD COLUMN last_clicked_at TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_resources' AND column_name = 'engagement_score') THEN
        ALTER TABLE ai_resources ADD COLUMN engagement_score DECIMAL DEFAULT 0;
    END IF;
    
    RAISE NOTICE '✅ AI Resources columns checked/added';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️ Could not modify ai_resources: %', SQLERRM;
END $$;

-- Step 2: Create resource_searches table (safe)
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

-- Step 3: Create helper functions (always safe)
-- =================================================================
CREATE OR REPLACE FUNCTION calculate_engagement_score(
  p_click_count INTEGER,
  p_view_count INTEGER
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (COALESCE(p_click_count, 0) * 2.0) + (COALESCE(p_view_count, 0) * 0.5);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_admin_emails(emails text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.admin_emails', emails, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Add indexes safely (skip if they fail)
-- =================================================================
DO $$ 
BEGIN
    -- AI Resources indexes
    CREATE INDEX IF NOT EXISTS idx_ai_resources_featured ON ai_resources(featured) WHERE featured = true;
    CREATE INDEX IF NOT EXISTS idx_ai_resources_category ON ai_resources(category);
    CREATE INDEX IF NOT EXISTS idx_ai_resources_type ON ai_resources(type);
    
    -- Only try tracking indexes if columns exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_resources' AND column_name = 'click_count') THEN
        CREATE INDEX IF NOT EXISTS idx_ai_resources_click_count ON ai_resources(click_count DESC);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_resources' AND column_name = 'last_clicked_at') THEN
        CREATE INDEX IF NOT EXISTS idx_ai_resources_last_clicked_at ON ai_resources(last_clicked_at DESC);
    END IF;
    
    -- Newsletter subscribers indexes
    CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
    CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);
    
    -- Onboarding intake indexes
    CREATE INDEX IF NOT EXISTS idx_onboarding_intake_email ON onboarding_intake(email);
    CREATE INDEX IF NOT EXISTS idx_onboarding_intake_created_at ON onboarding_intake(created_at DESC);
    
    -- Resource searches indexes
    CREATE INDEX IF NOT EXISTS idx_resource_searches_query ON resource_searches(search_query);
    CREATE INDEX IF NOT EXISTS idx_resource_searches_created_at ON resource_searches(created_at DESC);
    
    RAISE NOTICE '✅ Indexes created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️ Some indexes may have failed: %', SQLERRM;
END $$;

-- Step 5: Enable RLS (safe - won't break if already enabled)
-- =================================================================
DO $$
BEGIN
    ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE cta_responses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE onboarding_intake ENABLE ROW LEVEL SECURITY;
    ALTER TABLE ai_resources ENABLE ROW LEVEL SECURITY;
    ALTER TABLE resource_searches ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE '✅ RLS enabled on all tables';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️ RLS may already be enabled: %', SQLERRM;
END $$;

-- Step 6: Simple policies (avoid complex JWT checks for now)
-- =================================================================
DO $$
BEGIN
    -- Simple read policy for AI resources (public)
    DROP POLICY IF EXISTS "Public read access" ON ai_resources;
    CREATE POLICY "Public read access" ON ai_resources FOR SELECT TO anon, authenticated USING (true);
    
    -- Simple write policy for newsletter
    DROP POLICY IF EXISTS "Public insert newsletter" ON newsletter_subscribers;
    CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
    
    -- Simple write policy for cta responses
    DROP POLICY IF EXISTS "Public insert cta" ON cta_responses;
    CREATE POLICY "Public insert cta" ON cta_responses FOR INSERT TO anon, authenticated WITH CHECK (true);
    
    -- Simple write policy for onboarding
    DROP POLICY IF EXISTS "Public insert onboarding" ON onboarding_intake;
    CREATE POLICY "Public insert onboarding" ON onboarding_intake FOR INSERT TO anon, authenticated WITH CHECK (true);
    
    -- Simple policy for resource searches
    DROP POLICY IF EXISTS "Public insert searches" ON resource_searches;
    CREATE POLICY "Public insert searches" ON resource_searches FOR INSERT TO anon, authenticated WITH CHECK (true);
    
    RAISE NOTICE '✅ Basic policies created';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️ Policy creation failed: %', SQLERRM;
END $$;

-- Step 7: Set featured resources (safe)
-- =================================================================
DO $$
BEGIN
    UPDATE ai_resources SET featured = false;
    
    UPDATE ai_resources 
    SET featured = true 
    WHERE title IN ('n8n-MCP', 'Yupp.ai', 'Open LLM Leaderboard', 'Z.AI Chat');
    
    RAISE NOTICE '✅ Featured resources updated';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️ Featured update failed: %', SQLERRM;
END $$;

-- Step 8: Configure admin email
-- =================================================================
SELECT set_admin_emails('yortozne@gmail.com');

-- Final verification
-- =================================================================
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    RAISE NOTICE '=== MINIMAL MIGRATION COMPLETE ===';
    
    -- Safe counts
    BEGIN
        SELECT COUNT(*) INTO table_count FROM ai_resources;
        RAISE NOTICE 'AI resources: %', table_count;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'AI resources: table not accessible';
    END;
    
    BEGIN
        SELECT COUNT(*) INTO table_count FROM cta_responses;
        RAISE NOTICE 'CTA responses: %', table_count;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'CTA responses: table not accessible';
    END;
    
    RAISE NOTICE '✅ Migration completed - check your app now!';
END $$;
