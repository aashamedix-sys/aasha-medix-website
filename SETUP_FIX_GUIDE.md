# CRITICAL: Fix Setup Errors

## Issues Found:

### 1. Schema Mismatch - admin_users missing 'role' column
**Error:** `Could not find the 'role' column of 'admin_users'`
**Cause:** Migration 999 may not have fully applied or table exists with old schema

### 2. Email Validation Errors
**Error:** `Email address "staff@aashamedix.com" is invalid`
**Cause:** Supabase email validation settings blocking the domain or email format

---

## IMMEDIATE FIX STEPS:

### Step 1: Run Schema Fix Migration (2 minutes)

Go to Supabase SQL Editor and run this file:
```
migrations/1000_verify_and_fix_schema.sql
```

This will:
- ✅ Ensure admin_users has 'role' column
- ✅ Add missing columns to all tables
- ✅ Disable RLS temporarily
- ✅ Show current schema structure

### Step 2: Fix Email Validation in Supabase (3 minutes)

**Option A: Disable Email Validation (Recommended for setup)**

1. Go to: https://supabase.com/dashboard/project/wyytvrukflhphukmltvn
2. Settings → Authentication
3. Find "Email Auth" section
4. **Disable:** "Confirm email" checkbox
5. **Disable:** "Email validation" or any domain restrictions
6. Click "Save"

**Option B: Use Gmail Addresses for Testing**

If Supabase blocks @aashamedix.com domain, use Gmail:
- Change emails in Setup.jsx to:
  - care@aashamedix.com → your-email+care@gmail.com
  - staff@aashamedix.com → your-email+staff@gmail.com
  - staff1@aashamedix.com → your-email+staff1@gmail.com
  - etc.

Gmail's `+` addressing allows multiple addresses to same inbox.

### Step 3: Check Supabase Email Provider Settings

1. Go to: Authentication → Providers → Email
2. Verify settings:
   - ✅ Enable Email Provider: ON
   - ✅ Confirm Email: OFF (during setup)
   - ✅ Secure Email Change: OFF (during setup)
   - ❌ Double Confirm Email Change: OFF

### Step 4: Verify Auth Settings

1. Go to: Authentication → Settings
2. Check "Site URL": Should be https://aashamedix.com
3. Check "Redirect URLs": Add:
   - https://aashamedix.com/*
   - https://www.aashamedix.com/*
   - http://localhost:3000/*

### Step 5: Re-run Setup

1. Wait 2 minutes for Cloudflare deployment
2. Visit: https://aashamedix.com/setup
3. Click "Initialize System Users"
4. Check logs - should now show:
   - ✓ Created auth user
   - ✓ Profile linked (no column errors)

---

## Verification Queries (Run in Supabase SQL Editor):

```sql
-- Check if admin_users has role column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_users' AND table_schema = 'public';

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'staff', 'patients');

-- Check if any users exist
SELECT 'admin_users' as table_name, COUNT(*) as count FROM admin_users
UNION ALL
SELECT 'staff', COUNT(*) FROM staff
UNION ALL
SELECT 'patients', COUNT(*) FROM patients;
```

---

## Root Cause Analysis:

1. **Migration 999 may have failed silently** - The CREATE TABLE IF NOT EXISTS might have created the table without some columns if it already existed with old schema

2. **Supabase email validation** - Default Supabase settings may block custom domains or require email confirmation even when disabled in UI

3. **Solution:** Run comprehensive schema fix (1000_verify_and_fix_schema.sql) which adds columns safely with `ADD COLUMN IF NOT EXISTS`

---

## After Setup Succeeds:

1. Re-enable RLS:
```sql
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
```

2. Re-enable email confirmation in Supabase Auth settings

3. Test logins for all roles
