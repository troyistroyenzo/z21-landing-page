# Database Migrations Guide

## ✅ Current Migrations (KEEP THESE)

Your `supabase/migrations/` folder contains the complete history of your database schema:

```
supabase/migrations/
├── 00_complete_setup.sql                    # Initial database setup
├── create_onboarding_intake.sql             # Onboarding intake table
├── create_newsletter_subscribers.sql        # Newsletter subscribers
├── create_ai_resources.sql                  # AI resources catalog
├── create_page_views.sql                    # Analytics page views
├── add_applicant_scoring.sql                # Applicant scoring system
├── add_cta_scoring.sql                      # CTA scoring
├── add_resource_tracking.sql                # Resource usage tracking
├── add_rich_content_to_resources.sql        # Enhanced resource content
├── add_rls_policies.sql                     # Row level security (v1)
├── add_rls_policies_fixed.sql               # Row level security (v2)
├── add_search_logging.sql                   # Search analytics
├── set_featured_resources.sql               # Featured resources setup
├── 2025-11-01_drop_not_null_profile_link.sql  # Profile link fix
└── safe_additive_setup.sql                  # Safety checks
```

**Total: 15 migration files** ✅

## 🗑️ Cleaned Up (Test Files Removed)

The following test/diagnostic files were removed from `supabase/` root:
- ❌ `diagnose_existing_schema.sql`
- ❌ `test_migration.sql`
- ❌ `minimal_safe_migration.sql`
- ❌ `migrate_ai_onboarding.sql`
- ❌ `add_new_vibe_check_fields.sql`
- ❌ `create_cta_table.sql`

These were one-off test files and are no longer needed since the actual migrations are in the `migrations/` folder.

## 📋 Best Practices

### When to Create a New Migration

Create a new migration file when you need to:
1. Add a new table
2. Modify an existing table structure
3. Add/remove columns
4. Change data types
5. Update indexes
6. Modify RLS policies
7. Add new functions or triggers

### Migration Naming Convention

Use descriptive names with prefixes:
```
create_[table_name].sql       # Creating new tables
add_[feature_name].sql        # Adding features/columns
update_[what_changed].sql     # Modifying existing structure
fix_[issue_description].sql   # Bug fixes
YYYY-MM-DD_[description].sql  # Date-prefixed for important changes
```

### How to Create a New Migration

```bash
# 1. Create the file
touch supabase/migrations/add_new_feature.sql

# 2. Write your SQL
# Always include rollback comments if needed

# 3. Test locally first
# Use Supabase Studio or CLI to test

# 4. Apply to production
# Via Supabase dashboard or CLI
```

### Migration Template

```sql
-- Description: What this migration does
-- Author: Your Name
-- Date: YYYY-MM-DD

-- Migration
CREATE TABLE IF NOT EXISTS your_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  -- your columns here
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_your_table_field ON your_table(field);

-- RLS Policies
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Policy description"
ON your_table
FOR SELECT
TO authenticated
USING (true);

-- Rollback instructions (as comments)
-- To rollback: DROP TABLE your_table;
```

## 🔒 Important Rules

1. **NEVER delete migration files** - They're your database history
2. **NEVER edit applied migrations** - Create a new one to fix issues
3. **Always test locally first** - Before applying to production
4. **Keep migrations in order** - They run sequentially
5. **Commit to git** - Version control your schema changes
6. **Document breaking changes** - Add comments for major changes

## 🚀 Setting Up Fresh Database

If you ever need to set up the database from scratch:

```bash
# Option 1: Via Supabase CLI
supabase db reset

# Option 2: Manually apply migrations in order
# Run each file in alphabetical order from the migrations folder
```

## 📝 Next Migration Checklist

Before creating a new migration:
- [ ] Clearly understand what needs to change
- [ ] Plan backward compatibility if needed
- [ ] Write the SQL migration
- [ ] Test on local database
- [ ] Document any manual steps needed
- [ ] Review for security (RLS policies)
- [ ] Apply to staging first (if available)
- [ ] Apply to production
- [ ] Commit to git

## 🔍 Troubleshooting

### Migration Failed?
1. Check Supabase logs for error details
2. Review the SQL syntax
3. Check for missing dependencies (tables/columns)
4. Verify RLS policies don't conflict

### Need to Rollback?
1. Create a new migration to reverse changes
2. Don't delete the failed migration
3. Document why the rollback was needed

---

**Last Cleanup:** November 13, 2025
**Migration Count:** 15 files
**Status:** ✅ All test files removed, production migrations intact
