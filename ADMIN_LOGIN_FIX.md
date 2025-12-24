# Admin Login Fix - Setup Instructions

## What Was Fixed:

✅ **Auto-Email Confirmation**: Setup now marks emails as confirmed during admin seeding (allows login)  
✅ **Existing User Linking**: If auth.users exists but profile is missing, setup now links them  
✅ **Admin Role Assignment**: Forced `role = 'admin'` for admin users (prevents null role errors)  
✅ **Idempotent Operations**: Can run setup multiple times safely without duplicate errors  
✅ **Schema-Resilient**: Handles missing columns gracefully with better error messages  

## Required Steps:

### Step 1: Create RPC Functions (2 minutes)

Run this in **Supabase SQL Editor**:

```sql
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id_result uuid;
BEGIN
  SELECT id INTO user_id_result
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;
  
  RETURN user_id_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_user_email(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = user_id
    AND email_confirmed_at IS NULL;
  
  RETURN FOUND;
END;
$$;
```

### Step 2: Confirm Existing Emails (1 minute)

Still in SQL Editor:

```sql
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email IN (
    'care@aashamedix.com',
    'staff@aashamedix.com', 
    'staff1@aashamedix.com',
    'staff2@aashamedix.com',
    'patient1@aashamedix.com',
    'patient2@aashamedix.com'
)
AND email_confirmed_at IS NULL;

-- Verify
SELECT email, email_confirmed_at FROM auth.users 
WHERE email IN ('care@aashamedix.com', 'staff@aashamedix.com', 'staff1@aashamedix.com', 
                'staff2@aashamedix.com', 'patient1@aashamedix.com', 'patient2@aashamedix.com')
ORDER BY email;
```

All 6 emails should show a timestamp in `email_confirmed_at` column.

### Step 3: Ensure Admin Row Exists (1 minute)

If care@aashamedix.com is NOT in admin_users, run:

```sql
INSERT INTO public.admin_users (user_id, email, password_hash, full_name, role, status)
SELECT u.id, u.email, '', u.email, 'admin', 'Active'
FROM auth.users u
WHERE u.email = 'care@aashamedix.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admin_users a 
  WHERE a.user_id = u.id
);

-- Verify
SELECT email, role, status FROM admin_users WHERE email = 'care@aashamedix.com';
```

### Step 4: Deploy & Test (2 minutes)

Deployed: **Commit dffd75e** → Cloudflare auto-deploying now  
Wait 2 minutes for deployment to complete.

Then:
1. Visit: **https://aashamedix.com/admin-login**
2. Enter:
   - Email: `care@aashamedix.com`
   - Password: `Care@123456`
3. Click **AUTHENTICATE**

Expected: ✅ Redirect to admin dashboard (no "Access Denied" error)

---

## What Happens in Improved Setup:

When you run setup now:

```
✓ Created auth user: care@aashamedix.com
✓ Email confirmed for care@aashamedix.com
✓ Profile linked: AASHA MEDIX Care Admin (admin)
✓ Created auth user: staff@aashamedix.com
✓ Email confirmed for staff@aashamedix.com
✓ Profile linked: AASHA MEDIX Staff (staff)
... (and so on for all users)

📊 Setup Complete!
✓ Successful: 6
⊘ Skipped (existing): 0
✗ Failed: 0
```

---

## Troubleshooting:

### Still getting "Access Denied"?

Check:
```sql
-- 1. Is auth user confirmed?
SELECT email, email_confirmed_at FROM auth.users 
WHERE email = 'care@aashamedix.com';

-- 2. Is profile linked?
SELECT email, role FROM admin_users 
WHERE email = 'care@aashamedix.com';

-- 3. Is role set to 'admin'?
SELECT email, role FROM admin_users 
WHERE email = 'care@aashamedix.com' AND role = 'admin';
```

All three should return data. If any is missing, run the corresponding Step above.

### RPC functions not found?

Make sure you're running the CREATE FUNCTION statements in Supabase SQL Editor, not your local terminal.

---

## Files Updated:

- ✅ `src/pages/Setup.jsx` - Idempotent admin seeding with auto-confirmation
- ✅ `migrations/1002_confirm_all_emails.sql` - Email confirmation for all setup users
- ✅ `migrations/1003_create_rpc_functions.sql` - RPC functions for Setup.jsx
- ✅ `dist/` - Production bundle rebuilt and deployed (commit dffd75e)

## Next: Test all logins (Admin, Staff, Patient)
