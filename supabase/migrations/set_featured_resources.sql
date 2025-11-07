-- Set all resources to NOT featured first
UPDATE ai_resources 
SET featured = false;

-- Set only the 4 specified resources as featured
-- Note: Update the titles below to match your actual resource names
UPDATE ai_resources 
SET featured = true 
WHERE title IN (
  'n8n-MCP',
  'Yupp.ai',
  'Open LLM Leaderboard',
  'Z.AI Chat'
);

-- Alternative: If you know the exact IDs, use this instead:
-- UPDATE ai_resources 
-- SET featured = true 
-- WHERE id IN (
--   'n8n-mcp',
--   'yupp-ai',
--   'open-llm-leaderboard',
--   'chat-z-ai'
-- );

-- Verify the changes
SELECT id, title, featured, category
FROM ai_resources 
WHERE featured = true
ORDER BY title;
