-- ======================================
-- AASHA MEDIX - Hotfix: FK alignment & admin_users schema guard
-- Run this in Supabase SQL Editor (project: wyytvrukflhphukmltvn)
-- Purpose:
-- 1) Ensure public.staff.user_id and public.patients.user_id reference auth.users(id)
-- 2) Ensure admin_users table exists with expected columns
-- ======================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Fix Foreign Keys to reference auth.users(id)
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_user_id_fkey;
ALTER TABLE public.staff
  ADD CONSTRAINT staff_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.patients DROP CONSTRAINT IF EXISTS patients_user_id_fkey;
ALTER TABLE public.patients
  ADD CONSTRAINT patients_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Optional: quick verification queries (uncomment to check)
-- SELECT COUNT(*) AS staff_invalid_refs
-- FROM public.staff s
-- LEFT JOIN auth.users u ON u.id = s.user_id
-- WHERE u.id IS NULL;
-- 
-- SELECT COUNT(*) AS patients_invalid_refs
-- FROM public.patients p
-- LEFT JOIN auth.users u ON u.id = p.user_id
-- WHERE u.id IS NULL;

-- 2) Ensure admin_users table exists and is compatible with Setup.jsx upserts
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add missing columns if schema differs (safe-adds)
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Indexes for performance (id/email/user_id)
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_users_email ON public.admin_users(email);

-- Note: The app code no longer uses can_change_password; no need to add this column.
-- If desired, you may add it with:
-- ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS can_change_password BOOLEAN DEFAULT TRUE;

-- End of hotfix
