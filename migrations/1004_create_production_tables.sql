-- ========================================
-- AASHA MEDIX PRODUCTION DATABASE SCHEMA  
-- Migration 1004: Complete Backend Tables
-- Date: December 25, 2025
-- VERSION: 1.2 (Fixed - policies drop after tables exist)
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- GLOBAL POLICY CLEANUP (drop all existing public policies)
-- ========================================
DO $$ DECLARE r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.' || r.tablename;
    END LOOP;
END $$;

-- ========================================
-- 1️⃣ DOCTORS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    qualification TEXT,
    experience_years INTEGER,
    fee NUMERIC(10, 2),
    phone TEXT,
    email TEXT,
    is_available BOOLEAN DEFAULT true,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure doctors columns exist (repair if partially created)
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS fee NUMERIC(10, 2);
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.doctors
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_available ON public.doctors(is_available);

-- ========================================
-- 2️⃣ TESTS TABLE (Diagnostic Tests)
-- ========================================
CREATE TABLE IF NOT EXISTS public.tests (
    id TEXT PRIMARY KEY, -- Using text ID as per frontend (e.g., 'CBC', 'LFT')
    test_name TEXT NOT NULL,
    category TEXT,
    price NUMERIC(10, 2), -- Discounted price
    mrp NUMERIC(10, 2), -- Maximum Retail Price
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill compatibility: ensure status column exists if table already existed
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS test_name TEXT;
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2);
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.tests
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure tests.id is TEXT (repair if previously BIGINT/UUID)
DO $$
DECLARE v_type text;
BEGIN
    SELECT data_type INTO v_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'tests' AND column_name = 'id';

    IF v_type IS NOT NULL AND v_type <> 'text' THEN
        ALTER TABLE public.tests ALTER COLUMN id TYPE TEXT USING id::text;
    END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_tests_category ON public.tests(category);
CREATE INDEX IF NOT EXISTS idx_tests_status ON public.tests(status);
CREATE INDEX IF NOT EXISTS idx_tests_id ON public.tests(id);

-- ========================================
-- 3️⃣ BOOKINGS TABLE (Diagnostic Test Bookings)
-- ========================================
-- Note: This table already exists, but let's ensure proper structure
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(user_id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    patient_email TEXT,
    patient_phone TEXT,
    test_ids TEXT[], -- Array of test IDs
    address TEXT,
    city TEXT,
    pincode TEXT,
    booking_date DATE,
    time_slot TEXT,
    total_amount NUMERIC(10, 2),
    payment_status TEXT DEFAULT 'pending',
    booking_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill compatibility: ensure booking columns exist if table already existed
ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS booking_status TEXT DEFAULT 'pending';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_bookings_patient ON public.bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);

-- ========================================
-- 4️⃣ DOCTOR_BOOKINGS TABLE (Doctor Consultation Bookings)
-- ========================================
CREATE TABLE IF NOT EXISTS public.doctor_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(user_id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    patient_email TEXT,
    patient_phone TEXT,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    consultation_fee NUMERIC(10, 2),
    symptoms TEXT,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill compatibility: ensure doctor_bookings columns exist if table already existed
ALTER TABLE public.doctor_bookings
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.doctor_bookings
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_patient ON public.doctor_bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_doctor ON public.doctor_bookings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_status ON public.doctor_bookings(status);
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_date ON public.doctor_bookings(appointment_date);

-- ========================================
-- 5️⃣ LEADS TABLE (CRM - Customer Leads)
-- ========================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT, -- What service they're interested in
    source TEXT, -- How they found us (Google, Facebook, etc.)
    status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
    notes TEXT,
    assigned_to UUID REFERENCES public.staff(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill compatibility: ensure leads.status exists if table already existed
ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(assigned_to);

-- ========================================
-- 6️⃣ ANALYTICS TABLE (Dashboard Metrics)
-- ========================================
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric TEXT NOT NULL, -- e.g., 'daily_bookings', 'revenue', 'new_patients'
    value NUMERIC(15, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    metadata JSONB, -- Additional data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON public.analytics(metric);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(date);

-- ========================================
-- 7️⃣ REPORTS TABLE (Patient Medical Reports)
-- ========================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(user_id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id),
    report_type TEXT, -- 'diagnostic', 'consultation', 'prescription'
    report_name TEXT NOT NULL,
    file_url TEXT, -- S3/Storage URL
    status TEXT DEFAULT 'pending', -- pending, ready, delivered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill compatibility: ensure reports.status exists if table already existed
ALTER TABLE public.reports
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_reports_patient ON public.reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_booking ON public.reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ========================================
-- RLS POLICIES: ENABLE ROW LEVEL SECURITY
-- ========================================

-- Clean up existing policies first (now that tables exist)
DROP POLICY IF EXISTS "Admin full access to doctors" ON public.doctors;
DROP POLICY IF EXISTS "Staff can read and modify doctors" ON public.doctors;
DROP POLICY IF EXISTS "Patients can view available doctors" ON public.doctors;
DROP POLICY IF EXISTS "Public can view available doctors" ON public.doctors;

DROP POLICY IF EXISTS "Admin full access to tests" ON public.tests;
DROP POLICY IF EXISTS "Staff can read and modify tests" ON public.tests;
DROP POLICY IF EXISTS "Patients can view active tests" ON public.tests;
DROP POLICY IF EXISTS "Public can view active tests" ON public.tests;

DROP POLICY IF EXISTS "Admin full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Patients can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Patients can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Patients can update own pending bookings" ON public.bookings;

DROP POLICY IF EXISTS "Admin full access to doctor_bookings" ON public.doctor_bookings;
DROP POLICY IF EXISTS "Staff can manage doctor bookings" ON public.doctor_bookings;
DROP POLICY IF EXISTS "Patients can view own doctor bookings" ON public.doctor_bookings;
DROP POLICY IF EXISTS "Patients can create doctor bookings" ON public.doctor_bookings;

DROP POLICY IF EXISTS "Admin full access to leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can manage leads" ON public.leads;

DROP POLICY IF EXISTS "Admin full access to analytics" ON public.analytics;
DROP POLICY IF EXISTS "Staff can view analytics" ON public.analytics;

DROP POLICY IF EXISTS "Admin full access to reports" ON public.reports;
DROP POLICY IF EXISTS "Staff can manage reports" ON public.reports;
DROP POLICY IF EXISTS "Patients can view own reports" ON public.reports;

-- Enable RLS on all tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DOCTORS TABLE POLICIES
-- ========================================
-- Create policies safely with IF NOT EXISTS via DO blocks
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Admin full access to doctors'
    ) THEN
        CREATE POLICY "Admin full access to doctors"
        ON public.doctors FOR ALL
        USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Staff can read and modify doctors'
    ) THEN
        CREATE POLICY "Staff can read and modify doctors"
        ON public.doctors FOR ALL
        USING (EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid()));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Patients can view available doctors'
    ) THEN
        CREATE POLICY "Patients can view available doctors"
        ON public.doctors FOR SELECT
        USING (is_available = true AND EXISTS (
            SELECT 1 FROM public.patients WHERE user_id = auth.uid()
        ));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Public can view available doctors'
    ) THEN
        CREATE POLICY "Public can view available doctors"
        ON public.doctors FOR SELECT USING (is_available = true);
    END IF;
END $$;

-- ========================================
-- TESTS TABLE POLICIES
-- ========================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Admin full access to tests') THEN
        CREATE POLICY "Admin full access to tests"
        ON public.tests FOR ALL
        USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Staff can read and modify tests') THEN
        CREATE POLICY "Staff can read and modify tests"
        ON public.tests FOR ALL
        USING (EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid()));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Patients can view active tests') THEN
        CREATE POLICY "Patients can view active tests"
        ON public.tests FOR SELECT
        USING (status = 'active' AND EXISTS (
            SELECT 1 FROM public.patients WHERE user_id = auth.uid()
        ));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND policyname='Public can view active tests') THEN
        CREATE POLICY "Public can view active tests"
        ON public.tests FOR SELECT USING (status = 'active');
    END IF;
END $$;

-- ========================================
-- BOOKINGS TABLE POLICIES
-- ========================================

-- Admin: Full access
CREATE POLICY "Admin full access to bookings"
ON public.bookings
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Staff: Read and modify all bookings
CREATE POLICY "Staff can manage all bookings"
ON public.bookings
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.staff
        WHERE user_id = auth.uid()
    )
);

-- Patients: Own bookings only
CREATE POLICY "Patients can view own bookings"
ON public.bookings
FOR SELECT
USING (patient_id = auth.uid());

CREATE POLICY "Patients can create own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update own pending bookings"
ON public.bookings
FOR UPDATE
USING (patient_id = auth.uid() AND booking_status = 'pending');

-- ========================================
-- DOCTOR_BOOKINGS TABLE POLICIES
-- ========================================

-- Admin: Full access
CREATE POLICY "Admin full access to doctor_bookings"
ON public.doctor_bookings
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Staff: Full access
CREATE POLICY "Staff can manage doctor bookings"
ON public.doctor_bookings
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.staff
        WHERE user_id = auth.uid()
    )
);

-- Patients: Own bookings only
CREATE POLICY "Patients can view own doctor bookings"
ON public.doctor_bookings
FOR SELECT
USING (patient_id = auth.uid());

CREATE POLICY "Patients can create doctor bookings"
ON public.doctor_bookings
FOR INSERT
WITH CHECK (patient_id = auth.uid());

-- ========================================
-- LEADS TABLE POLICIES
-- ========================================

-- Admin: Full access
CREATE POLICY "Admin full access to leads"
ON public.leads
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Staff: Full access
CREATE POLICY "Staff can manage leads"
ON public.leads
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.staff
        WHERE user_id = auth.uid()
    )
);

-- ========================================
-- ANALYTICS TABLE POLICIES
-- ========================================

-- Admin: Full access
CREATE POLICY "Admin full access to analytics"
ON public.analytics
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Staff: Read only
CREATE POLICY "Staff can view analytics"
ON public.analytics
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.staff
        WHERE user_id = auth.uid()
    )
);

-- ========================================
-- REPORTS TABLE POLICIES
-- ========================================

-- Admin: Full access
CREATE POLICY "Admin full access to reports"
ON public.reports
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Staff: Full access
CREATE POLICY "Staff can manage reports"
ON public.reports
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.staff
        WHERE user_id = auth.uid()
    )
);

-- Patients: Own reports only
CREATE POLICY "Patients can view own reports"
ON public.reports
FOR SELECT
USING (patient_id = auth.uid());

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
    -- Check if admin
    IF EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) THEN
        RETURN 'admin';
    END IF;
    
    -- Check if staff
    IF EXISTS (SELECT 1 FROM public.staff WHERE user_id = auth.uid()) THEN
        RETURN 'staff';
    END IF;
    
    -- Check if patient
    IF EXISTS (SELECT 1 FROM public.patients WHERE user_id = auth.uid()) THEN
        RETURN 'patient';
    END IF;
    
    RETURN 'guest';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON public.tests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_bookings_updated_at BEFORE UPDATE ON public.doctor_bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Insert sample doctors (if none exist)
INSERT INTO public.doctors (full_name, specialty, qualification, experience_years, fee, phone, email, rating)
SELECT * FROM (VALUES
    ('Dr. Rajesh Kumar', 'General Physician', 'MBBS, MD', 15, 500.00, '9876543210', 'rajesh@aashamedix.com', 4.8),
    ('Dr. Priya Sharma', 'Cardiologist', 'MBBS, DM Cardiology', 12, 800.00, '9876543211', 'priya@aashamedix.com', 4.9),
    ('Dr. Amit Patel', 'Dermatologist', 'MBBS, MD Dermatology', 8, 600.00, '9876543212', 'amit@aashamedix.com', 4.7)
) AS v(full_name, specialty, qualification, experience_years, fee, phone, email, rating)
WHERE NOT EXISTS (SELECT 1 FROM public.doctors LIMIT 1);

-- Insert sample tests (if none exist)
INSERT INTO public.tests (id, test_name, category, price, mrp, description, status)
VALUES 
('CBC','Complete Blood Count','Pathology',300,500,'Blood analysis','active'),
('LFT','Liver Function Test','Pathology',400,600,'Liver profile','active')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Grant authenticated users access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT SELECT ON public.analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;

-- Grant anon users read access to public data
GRANT SELECT ON public.doctors TO anon;
GRANT SELECT ON public.tests TO anon;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================
-- Run this SQL in Supabase SQL Editor
-- Then verify with: SELECT tablename FROM pg_tables WHERE schemaname = 'public';
