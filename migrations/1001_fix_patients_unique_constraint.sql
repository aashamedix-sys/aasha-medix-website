-- ======================================
-- Fix: Add UNIQUE constraint to patients.user_id
-- Error: "there is no unique or exclusion constraint matching the ON CONFLICT specification"
-- ======================================

-- Add UNIQUE constraint to patients.user_id (needed for upsert operations)
ALTER TABLE public.patients 
  DROP CONSTRAINT IF EXISTS patients_user_id_key;

ALTER TABLE public.patients 
  ADD CONSTRAINT patients_user_id_key UNIQUE (user_id);

-- Verify constraint exists
SELECT 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'patients'
  AND tc.constraint_type IN ('UNIQUE', 'PRIMARY KEY')
ORDER BY tc.constraint_type, kcu.column_name;
