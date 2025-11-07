-- =================================================================
-- Test script to verify the migration worked correctly
-- Run this AFTER running the 00_complete_setup.sql migration
-- =================================================================

-- Test 1: Check that all tables exist
SELECT 
  'newsletter_subscribers' as table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'newsletter_subscribers'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status

UNION ALL

SELECT 
  'cta_responses' as table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'cta_responses'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status

UNION ALL

SELECT 
  'onboarding_intake' as table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'onboarding_intake'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status

UNION ALL

SELECT 
  'ai_resources' as table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'ai_resources'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status

UNION ALL

SELECT 
  'resource_searches' as table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'resource_searches'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- Test 2: Check that RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS ENABLED' ELSE '❌ RLS DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename IN (
  'newsletter_subscribers', 
  'cta_responses', 
  'onboarding_intake', 
  'ai_resources', 
  'resource_searches'
)
ORDER BY tablename;

-- Test 3: Check that indexes were created
SELECT 
  indexname,
  tablename,
  '✅ INDEX EXISTS' as status
FROM pg_indexes 
WHERE tablename IN (
  'newsletter_subscribers', 
  'cta_responses', 
  'onboarding_intake', 
  'ai_resources', 
  'resource_searches'
)
ORDER BY tablename, indexname;

-- Test 4: Check that functions were created
SELECT 
  routinename,
  '✅ FUNCTION EXISTS' as status
FROM information_schema.routines 
WHERE routinename IN ('calculate_engagement_score', 'set_admin_emails', 'is_admin')
ORDER BY routinename;

-- Test 5: Check admin email configuration
SELECT 
  'Admin Email Configuration' as test_name,
  current_setting('app.admin_emails', true) as admin_email,
  CASE 
    WHEN current_setting('app.admin_emails', true) != '' 
    THEN '✅ CONFIGURED' 
    ELSE '❌ NOT SET' 
  END as status;

-- Test 6: Check table structures (sample columns)
SELECT 
  'cta_responses.current_role' as column_check,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cta_responses' AND column_name = 'current_role'
  ) THEN '✅ COLUMN EXISTS' ELSE '❌ COLUMN MISSING' END as status

UNION ALL

SELECT 
  'ai_resources.engagement_score' as column_check,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_resources' AND column_name = 'engagement_score'
  ) THEN '✅ COLUMN EXISTS' ELSE '❌ COLUMN MISSING' END as status;

-- Final Summary Message
SELECT 
  '🎉 MIGRATION TEST COMPLETE' as message,
  'If all tests show ✅, your database is ready!' as instructions;
