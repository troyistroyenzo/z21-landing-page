# 🗄️ Database Setup Instructions

## 🚀 Quick Setup (Recommended)

### Single Migration File
Run **just this one file** in your Supabase SQL Editor:

```
supabase/migrations/00_complete_setup.sql
```

This single file will:
✅ Create all required tables  
✅ Add all indexes for performance  
✅ Enable Row Level Security  
✅ Set up all security policies  
✅ Configure admin permissions  
✅ Add tracking columns  
✅ Set featured resources  

### Steps:
1. **Open Supabase Dashboard** → SQL Editor
2. **Copy & paste** the entire `00_complete_setup.sql` file
3. **Click "Run"**
4. **Verify success** - you should see completion messages

## ✅ What Gets Created

### Tables:
- `newsletter_subscribers` - Email signups
- `cta_responses` - Form submissions  
- `onboarding_intake` - Application data
- `ai_resources` - Resource library
- `resource_searches` - Search analytics

### Security:
- Row Level Security enabled on all tables
- Admin-only access to sensitive data
- Public access to appropriate endpoints

### Performance:
- All necessary indexes created
- Engagement scoring for resources
- Optimized queries

## 🔧 Post-Setup Configuration

### 1. Update Admin Email
In the migration file, change this line to your email:
```sql
SELECT set_admin_emails('your-email@example.com');
```

### 2. Verify Setup
Run this query to check everything worked:
```sql
-- Check table counts
SELECT 
  (SELECT COUNT(*) FROM newsletter_subscribers) as newsletter_subs,
  (SELECT COUNT(*) FROM cta_responses) as cta_responses,
  (SELECT COUNT(*) FROM onboarding_intake) as onboarding,
  (SELECT COUNT(*) FROM ai_resources) as ai_resources,
  (SELECT COUNT(*) FROM resource_searches) as searches,
  (SELECT COUNT(*) FROM ai_resources WHERE featured = true) as featured_resources;

-- Check admin email
SELECT current_setting('app.admin_emails', true) as admin_emails;
```

## 🚨 If You Get Errors

### "Table already exists"
✅ **This is fine!** The migration uses `CREATE TABLE IF NOT EXISTS` so it won't break existing tables.

### "Policy already exists" 
✅ **This is fine!** The migration drops and recreates policies safely.

### "Permission denied"
❌ **Check:** Make sure you're using the correct Supabase service role key and have admin permissions.

## 📊 Expected Results

After running the migration, you should see output like:
```
NOTICE: === Z21 Database Setup Complete ===
NOTICE: Tables created with RLS enabled:
NOTICE: - newsletter_subscribers: X
NOTICE: - cta_responses: X  
NOTICE: - onboarding_intake: X
NOTICE: - ai_resources: X
NOTICE: - resource_searches: X
NOTICE: Featured resources: X
NOTICE: Admin email configured: your-email@example.com
```

## 🔄 Alternative: Individual Migration Files

If you prefer to run migrations individually:

1. `create_newsletter_subscribers.sql`
2. `supabase/create_cta_table.sql`  
3. `create_onboarding_intake.sql`
4. `create_ai_resources.sql`
5. `add_resource_tracking.sql`
6. `add_search_logging.sql`
7. `add_rls_policies_fixed.sql`
8. `set_featured_resources.sql`

**But the single file approach is much easier and safer!**

## 🆘 Need Help?

If anything goes wrong:
1. Check the Supabase logs for detailed error messages
2. Make sure your database has sufficient permissions
3. Verify your internet connection is stable
4. Try running the migration in smaller chunks if needed

---

**✨ Once complete, your database will be production-ready with enterprise-grade security!**
