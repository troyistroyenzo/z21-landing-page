-- Add tracking columns to ai_resources table
ALTER TABLE ai_resources 
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMPTZ;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ai_resources_last_clicked_at ON ai_resources(last_clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resources_click_count ON ai_resources(click_count DESC);

-- Update existing rows to have default values
UPDATE ai_resources 
SET click_count = 0 
WHERE click_count IS NULL;

UPDATE ai_resources 
SET view_count = 0 
WHERE view_count IS NULL;
