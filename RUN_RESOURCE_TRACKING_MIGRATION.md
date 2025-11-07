# Resource Tracking Migration

## What This Does

This migration adds tracking capabilities to your AI resources:
- Click counting
- View counting
- Publisher tracking ("by Z21 Bot")
- Last clicked timestamp

## Run the Migration

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/kldpzpnipovkkwzvstrm
   - Navigate to SQL Editor

2. **Run This SQL:**

```sql
-- Add tracking fields to ai_resources table for popularity tracking
ALTER TABLE ai_resources 
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS submitted_by TEXT DEFAULT 'Z21 Bot',
ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMPTZ;

-- Create an index for better query performance on frequently accessed columns
CREATE INDEX IF NOT EXISTS idx_ai_resources_click_count ON ai_resources(click_count DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resources_created_at ON ai_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resources_last_clicked ON ai_resources(last_clicked_at DESC NULLS LAST);

-- Update existing resources to have proper default values
UPDATE ai_resources 
SET submitted_by = 'Z21 Bot' 
WHERE submitted_by IS NULL;
```

## Verify Your n8n-MCP Resource

After running the migration, check if your resource exists:

```sql
SELECT * FROM ai_resources WHERE id = 'n8n-mcp';
```

## Test The New Page

1. Visit: http://localhost:3001/ai-resources
2. You should see:
   - GitHub-style feed layout
   - Trending/Popular/New tabs
   - Click and view counts
   - "by Z21 Bot" publisher info
   - Your n8n-MCP resource (if it exists in the database)

## What Changed

✅ **Fixed**: Resources now load from database, not static file
✅ **Added**: Click/view tracking
✅ **Added**: GitHub-style feed design
✅ **Added**: Real-time updates
✅ **Added**: Popularity sorting

The page will now show ALL resources from your database, including ones added through the admin panel!
