-- Enable Row Level Security on all tables (with correct table names)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_responses ENABLE ROW LEVEL SECURITY;  -- Fixed: was cta_submissions
ALTER TABLE onboarding_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_searches ENABLE ROW LEVEL SECURITY;

-- Newsletter Subscribers Policies
-- Only authenticated admin users can read
CREATE POLICY "Admin users can view newsletter subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Public can insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can delete
CREATE POLICY "Admin users can delete newsletter subscribers"
  ON newsletter_subscribers
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- CTA Responses Policies (Fixed table name)
-- Only authenticated admin users can read
CREATE POLICY "Admin users can view CTA responses"
  ON cta_responses
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Public can insert (submit)
CREATE POLICY "Anyone can submit CTA"
  ON cta_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can delete
CREATE POLICY "Admin users can delete CTA responses"
  ON cta_responses
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Onboarding Intake Policies
-- Only authenticated admin users can read
CREATE POLICY "Admin users can view onboarding intake"
  ON onboarding_intake
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Public can insert (submit)
CREATE POLICY "Anyone can submit onboarding"
  ON onboarding_intake
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can update
CREATE POLICY "Admin users can update onboarding intake"
  ON onboarding_intake
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Admins can delete
CREATE POLICY "Admin users can delete onboarding intake"
  ON onboarding_intake
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- AI Resources Policies
-- Everyone can read AI resources
CREATE POLICY "Anyone can view AI resources"
  ON ai_resources
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can insert resources
CREATE POLICY "Admin users can create AI resources"
  ON ai_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Only admins can update resources
CREATE POLICY "Admin users can update AI resources"
  ON ai_resources
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Only admins can delete resources
CREATE POLICY "Admin users can delete AI resources"
  ON ai_resources
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Resource Searches Policies
-- Anyone can insert search logs
CREATE POLICY "Anyone can log searches"
  ON resource_searches
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read search logs
CREATE POLICY "Admin users can view search logs"
  ON resource_searches
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Create function to set admin emails config
CREATE OR REPLACE FUNCTION set_admin_emails(emails text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.admin_emails', emails, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set default admin emails (update these with your actual admin emails)
SELECT set_admin_emails('yortozne@gmail.com');

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email IN (
    SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance (with correct table names)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_cta_responses_email ON cta_responses(email);  -- Fixed: was cta_submissions
CREATE INDEX IF NOT EXISTS idx_onboarding_intake_email ON onboarding_intake(email);
CREATE INDEX IF NOT EXISTS idx_ai_resources_featured ON ai_resources(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_ai_resources_category ON ai_resources(category);
CREATE INDEX IF NOT EXISTS idx_ai_resources_type ON ai_resources(type);
