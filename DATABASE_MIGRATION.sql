-- AASHA MEDIX Database Schema Migration
-- For Phone Authentication Support
-- Execute these SQL queries in Supabase SQL Editor

-- ============================================================================
-- STEP 1: Add Phone Column to Patients Table (if not exists)
-- ============================================================================

ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE;

-- Create index for phone lookups
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

-- ============================================================================
-- STEP 2: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view their own patient record" ON public.patients;
DROP POLICY IF EXISTS "Users can create their own patient record" ON public.patients;
DROP POLICY IF EXISTS "Users can update their own patient record" ON public.patients;
DROP POLICY IF EXISTS "Users can delete their own patient record" ON public.patients;
DROP POLICY IF EXISTS "Admins can view all patient records" ON public.patients;
DROP POLICY IF EXISTS "Staff can view all patient records" ON public.patients;

-- Policy: Users can view their own records
CREATE POLICY "Users can view their own patient record"
  ON public.patients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own record
CREATE POLICY "Users can create their own patient record"
  ON public.patients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own record
CREATE POLICY "Users can update their own patient record"
  ON public.patients
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all records
CREATE POLICY "Admins can view all patient records"
  ON public.patients
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Policy: Staff can view all records
CREATE POLICY "Staff can view all patient records"
  ON public.patients
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 3: Create Auto-Patient Creation Function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_patient_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user is already staff or admin
  IF EXISTS (SELECT 1 FROM staff WHERE user_id = NEW.id) THEN
    RETURN NEW;
  END IF;
  
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Create patient record for new auth user
  INSERT INTO public.patients (user_id, email, phone, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.phone),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    email = COALESCE(EXCLUDED.email, patients.email),
    phone = COALESCE(EXCLUDED.phone, patients.phone);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger (if any)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_patient_auth();

-- ============================================================================
-- STEP 4: Create Staff Table (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.staff (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  can_change_password BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);

-- ============================================================================
-- STEP 5: Create Admin Users Table (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  status TEXT DEFAULT 'Active',
  can_change_password BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ============================================================================
-- STEP 6: Enable RLS on Other Tables
-- ============================================================================

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Staff table policies
DROP POLICY IF EXISTS "Staff can view their own record" ON public.staff;
DROP POLICY IF EXISTS "Admins can view all staff" ON public.staff;

CREATE POLICY "Staff can view their own record"
  ON public.staff
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all staff"
  ON public.staff
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Admin users table policies
DROP POLICY IF EXISTS "Admins can view their own record" ON public.admin_users;

CREATE POLICY "Admins can view their own record"
  ON public.admin_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 7: Verify Schema
-- ============================================================================

-- Check patients table structure
-- SELECT * FROM information_schema.columns WHERE table_name = 'patients';

-- Check if phone column exists
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'patients' AND column_name = 'phone';

-- ============================================================================
-- STEP 8: Test Data (Optional - for testing only)
-- ============================================================================

-- Uncomment to add test patient record manually if needed:
/*
INSERT INTO public.patients (user_id, email, phone, full_name)
VALUES (
  'test-user-id-here',
  'test@aashamedix.com',
  '9876543210',
  'Test Patient'
)
ON CONFLICT DO NOTHING;
*/

-- ============================================================================
-- COMPLETION
-- ============================================================================
-- All migrations applied successfully!
-- Database is now ready for phone and OAuth authentication.
