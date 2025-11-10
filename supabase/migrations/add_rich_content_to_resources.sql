-- Add rich_content field to ai_resources table for HTML from rich text editor
ALTER TABLE ai_resources 
  ADD COLUMN IF NOT EXISTS rich_content TEXT;

-- Add comment for documentation
COMMENT ON COLUMN ai_resources.rich_content IS 'Rich HTML content from TipTap editor. Plain text description is kept for SEO/search.';
