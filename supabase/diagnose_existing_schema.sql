-- =================================================================
-- DIAGNOSTIC: Check Existing Table Structure  
-- Run this first to see what we're actually working with
-- =================================================================

-- Check what tables exist
SELECT 
  'TABLE EXISTS: ' || table_name as info,
  'schema: ' || table_schema as schema_info
FROM information_schema.tables 
WHERE table_name IN (
  'newsletter_subscribers', 
  'cta_responses', 
  'onboarding_intake', 
  'ai_resources', 
  'resource_searches'
)
ORDER BY table_name;

-- Check exact column structure for cta_responses
SELECT 
  'CTA_RESPONSES COLUMN: ' || column_name as column_info,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'cta_responses'
ORDER BY ordinal_position;

-- Check exact column structure for ai_resources
SELECT 
  'AI_RESOURCES COLUMN: ' || column_name as column_info,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'ai_resources'
ORDER BY ordinal_position;

-- Check what indexes already exist
SELECT 
  'INDEX: ' || indexname as index_info,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename IN (
  'newsletter_subscribers', 
  'cta_responses', 
  'onboarding_intake', 
  'ai_resources', 
  'resource_searches'
)
ORDER BY tablename, indexname;

-- Check what policies already exist
SELECT 
  'POLICY: ' || policyname as policy_info,
  tablename,
  permissive,
  roles
FROM pg_policies 
WHERE tablename IN (
  'newsletter_subscribers', 
  'cta_responses', 
  'onboarding_intake', 
  'ai_resources', 
  'resource_searches'
)
ORDER BY tablename, policyname;

-- Check RLS status
SELECT 
  'RLS STATUS: ' || tablename as table_info,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED' 
    ELSE '❌ DISABLED' 
  END as rls_status
FROM pg_tables 
WHERE tablename IN (
  'newsletter_subscribers', 
  'cta_responses', 
  'onboarding_intake', 
  'ai_resources', 
  'resource_searches'
)
ORDER BY tablename;

-- Final summary
SELECT '🔍 DIAGNOSIS COMPLETE - Now we know exactly what exists!' as summary;
