-- Create table for logging resource searches
CREATE TABLE IF NOT EXISTS resource_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  searched_at TIMESTAMPTZ DEFAULT NOW(),
  user_session TEXT,
  results_count INTEGER DEFAULT 0,
  selected_resource_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_resource_searches_query ON resource_searches(search_query);
CREATE INDEX IF NOT EXISTS idx_resource_searches_created_at ON resource_searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_searches_selected ON resource_searches(selected_resource_id);

-- Add engagement_score column to ai_resources for smart ranking
ALTER TABLE ai_resources 
ADD COLUMN IF NOT EXISTS engagement_score DECIMAL DEFAULT 0;

-- Create function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(
  p_click_count INTEGER,
  p_view_count INTEGER
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (p_click_count * 2.0) + (p_view_count * 0.5);
END;
$$ LANGUAGE plpgsql;

-- Update engagement scores for existing resources
UPDATE ai_resources 
SET engagement_score = calculate_engagement_score(
  COALESCE(click_count, 0),
  COALESCE(view_count, 0)
);
