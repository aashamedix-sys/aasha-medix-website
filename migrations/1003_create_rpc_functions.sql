-- ======================================
-- RPC Functions for Admin Seeding
-- Purpose: Support Setup.jsx idempotent operations
-- ======================================

-- Function 1: Get user_id by email (for admin seeding)
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

-- Function 2: Confirm user email (mark as confirmed for login)
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

-- Verify functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_user_id_by_email', 'confirm_user_email')
ORDER BY routine_name;
