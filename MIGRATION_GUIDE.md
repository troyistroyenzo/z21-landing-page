# Database Migration Guide - AI Onboarding Form

## 🔴 Issue
The form is failing because the database schema hasn't been updated yet. You're getting this error:
```
"Could not find the 'additional_info' column of 'cta_responses' in the schema cache"
```

## ✅ Solution: Run the Migration

Follow these steps to update your database:

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (z21-v2 or your project name)

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New query"** button (or press the "+" icon)

### Step 3: Copy the Migration SQL
1. Open the file: `supabase/migrate_ai_onboarding.sql` in your project
2. Select ALL the contents (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 4: Execute the Migration
1. Paste the SQL into the Supabase SQL Editor
2. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
3. Wait for the query to complete (should take 2-5 seconds)
4. You should see a success message

### Step 5: Verify Migration
After running the migration, you should see:
- ✅ "Success. No rows returned"
- OR table names like `cta_responses`, `ai_onboarding_applicants`, etc. in the success message

### Step 6: Test the Form
1. Go back to your app at `http://localhost:3000/cta-demo`
2. Fill out the form completely
3. Submit the form
4. It should now work! 🎉

## 📋 What the Migration Does

The migration will:
1. **Drop the old table** (WARNING: This deletes existing test data)
2. **Create a new table** with all 20 AI Onboarding question fields
3. **Add indexes** for better query performance
4. **Create views** for easy querying of strong fit candidates
5. **Add SQL functions** for automatic scoring calculation
6. **Set up permissions** (Row Level Security)

## ⚠️ Important Notes

### Data Loss Warning
The migration includes `DROP TABLE IF EXISTS cta_responses CASCADE` which will delete any existing data in the `cta_responses` table. 

**If you have important data you want to keep:**
1. Don't run the migration yet
2. Export your data first from Supabase (Table Editor → Export to CSV)
3. Then run the migration
4. Re-import your data if needed

### If Migration Fails

If you get an error like "permission denied" or "role does not exist":
1. Make sure you're logged in as the project owner
2. Try running the SQL in the Supabase dashboard (not via API)
3. Contact Supabase support if issues persist

## 🎯 After Migration

Once migration is complete, the form will:
- ✅ Save all 20 questions properly
- ✅ Calculate fit scores automatically
- ✅ Flag knockout answers
- ✅ Classify applicants (strong_fit, conditional, not_qualified)

### Querying Applicants

After collecting submissions, you can query them:

**See all AI Onboarding applicants:**
```sql
SELECT * FROM ai_onboarding_applicants
ORDER BY created_at DESC;
```

**See only strong fit candidates:**
```sql
SELECT * FROM strong_fit_candidates;
```

**Get statistics:**
```sql
SELECT * FROM get_ai_onboarding_stats();
```

## 🆘 Need Help?

If you encounter any issues:
1. Check the error message in Supabase SQL Editor
2. Verify your Supabase environment variables are set correctly in `.env.local`
3. Make sure you have the correct permissions in your Supabase project

---

**Ready?** Follow the steps above to run your migration! 🚀
