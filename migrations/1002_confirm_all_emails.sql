-- ======================================
-- Confirm all admin/staff emails in Supabase Auth
-- Purpose: Mark all setup users as email-confirmed so they can login
-- ======================================

-- This allows authenticated users to login even without confirming their email
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

-- Verify confirmation
SELECT email, email_confirmed_at, confirmed_at 
FROM auth.users 
WHERE email IN (
    'care@aashamedix.com',
    'staff@aashamedix.com', 
    'staff1@aashamedix.com',
    'staff2@aashamedix.com',
    'patient1@aashamedix.com',
    'patient2@aashamedix.com'
)
ORDER BY email;
