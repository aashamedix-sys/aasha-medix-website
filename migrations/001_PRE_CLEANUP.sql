-- ======================================
-- PRE-MIGRATION CLEANUP
-- Run this BEFORE 000_RUN_ALL_MIGRATIONS.sql if you get type/constraint errors
-- This handles cases where previous migrations were partially run
-- ======================================

-- Drop custom types if they exist (to avoid "type already exists" errors)
DO $$ 
BEGIN
    -- Drop staff_role type if exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'staff_role') THEN
        DROP TYPE staff_role CASCADE;
        RAISE NOTICE 'Dropped existing staff_role type';
    END IF;
    
    -- Drop any other custom types that might conflict
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        DROP TYPE booking_status CASCADE;
        RAISE NOTICE 'Dropped existing booking_status type';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        DROP TYPE payment_status CASCADE;
        RAISE NOTICE 'Dropped existing payment_status type';
    END IF;
END $$;

-- Note: This script is safe to run multiple times
-- It only drops types if they exist
