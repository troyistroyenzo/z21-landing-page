-- Migration: Make profile_link nullable (legacy column)
-- Run this in Supabase SQL Editor when convenient.

ALTER TABLE cta_responses
  ALTER COLUMN profile_link DROP NOT NULL;

-- Optional follow-up (after verifying nothing depends on it):
-- ALTER TABLE cta_responses DROP COLUMN profile_link;

COMMENT ON COLUMN cta_responses.profile_link IS 'Legacy field kept for backward compatibility; use social_handle instead.';

SELECT 'profile_link column is now nullable' AS status;
