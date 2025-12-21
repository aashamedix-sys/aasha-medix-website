-- ======================================
-- AASHA MEDIX - Complete Booking Management System
-- Database Migration Script
-- Run this entire script in Supabase SQL Editor
-- ======================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================
-- CORE TABLE: BOOKINGS
-- Create the main bookings table first (required by all other tables)
-- ======================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  booking_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Payment Pending',
  
  -- Appointment details
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  booking_date TIMESTAMP DEFAULT now(),
  
  -- Patient contact info
  mobile VARCHAR(15),
  email VARCHAR(255),
  address TEXT,
  
  -- Service-specific IDs
  test_ids UUID[],
  medicine_ids JSONB,
  doctor_id UUID,
  
  -- Payment details
  total_amount DECIMAL(10, 2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending',
  
  -- Notes
  notes TEXT,
  special_notes TEXT,
  staff_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  -- Additional fields (will be added/modified by migrations below)
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES auth.users(id),
  rejected_at TIMESTAMP,
  rejected_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  rescheduled_at TIMESTAMP,
  payment_confirmed_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create indexes for bookings table
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_patient_id ON bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference_number ON bookings(reference_number);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = patient_id);

DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() = patient_id);

DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = patient_id);

-- Staff/Admin broad access policies for bookings (guarded)
DO $$
BEGIN
  -- Staff: view all bookings
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'staff'
  ) THEN
    DROP POLICY IF EXISTS "Staff can view all bookings" ON bookings;
    CREATE POLICY "Staff can view all bookings"
      ON bookings FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.staff s 
          WHERE s.user_id = auth.uid() AND COALESCE(s.status, 'Active') = 'Active'
        )
      );

    -- Staff: update all bookings (for approvals/reschedules)
    DROP POLICY IF EXISTS "Staff can update all bookings" ON bookings;
    CREATE POLICY "Staff can update all bookings"
      ON bookings FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.staff s 
          WHERE s.user_id = auth.uid() AND COALESCE(s.status, 'Active') = 'Active'
        )
      );
  END IF;

  -- Admins: view/update all bookings
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'admin_users'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
    CREATE POLICY "Admins can view all bookings"
      ON bookings FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users a 
          WHERE a.user_id = auth.uid()
        )
      );

    DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;
    CREATE POLICY "Admins can update all bookings"
      ON bookings FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users a 
          WHERE a.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ======================================
-- PHASE 2: APPROVAL SYSTEM & NOTIFICATIONS
-- ======================================

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- 2. Create booking_status_history table
CREATE TABLE IF NOT EXISTS booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking_id ON booking_status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_history_created_at ON booking_status_history(created_at);

-- 3. Create staff_approvals table
CREATE TABLE IF NOT EXISTS staff_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES auth.users(id),
  action VARCHAR(20) NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_approvals_booking_id ON staff_approvals(booking_id);
CREATE INDEX IF NOT EXISTS idx_staff_approvals_staff_id ON staff_approvals(staff_id);

-- 4. Add new columns to bookings table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='approved_at') THEN
        ALTER TABLE bookings ADD COLUMN approved_at TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='approved_by') THEN
        ALTER TABLE bookings ADD COLUMN approved_by UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='rejected_at') THEN
        ALTER TABLE bookings ADD COLUMN rejected_at TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='rejected_by') THEN
        ALTER TABLE bookings ADD COLUMN rejected_by UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='rejection_reason') THEN
        ALTER TABLE bookings ADD COLUMN rejection_reason TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='rescheduled_at') THEN
        ALTER TABLE bookings ADD COLUMN rescheduled_at TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='payment_confirmed_at') THEN
        ALTER TABLE bookings ADD COLUMN payment_confirmed_at TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='completed_at') THEN
        ALTER TABLE bookings ADD COLUMN completed_at TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='staff_notes') THEN
        ALTER TABLE bookings ADD COLUMN staff_notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='special_notes') THEN
        ALTER TABLE bookings ADD COLUMN special_notes TEXT;
    END IF;
END $$;

-- 5. Enable RLS on new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_approvals ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ======================================
-- PHASE 3: CHAT SYSTEM
-- ======================================

-- 1. Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type VARCHAR(100),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_booking_id ON chat_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_recipient_id ON chat_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_read ON chat_messages(recipient_id, read) WHERE read = FALSE;

-- 2. Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  joined_at TIMESTAMP DEFAULT now(),
  last_read_at TIMESTAMP,
  UNIQUE(booking_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_participants_booking_id ON chat_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);

-- 3. Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for chat
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON chat_messages;
CREATE POLICY "Users can view messages they sent or received"
  ON chat_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update messages" ON chat_messages;
CREATE POLICY "Users can update messages"
  ON chat_messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- 5. Create storage bucket for chat attachments (if doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- ======================================
-- PHASE 4: PAYMENT SYSTEM
-- ======================================

-- 1. Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending',
  invoice_number VARCHAR(50) UNIQUE,
  invoice_generated BOOLEAN DEFAULT FALSE,
  payment_metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- 2. Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_history_payment_id ON payment_history(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);

-- 3. Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  refund_transaction_id VARCHAR(255),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  completed_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_booking_id ON refunds(booking_id);
CREATE INDEX IF NOT EXISTS idx_refunds_user_id ON refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- 4. Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for payments
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create payments" ON payments;
CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Staff/Admin view access policies for payments (guarded)
DO $$
BEGIN
  -- Staff can view all payments
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'staff'
  ) THEN
    DROP POLICY IF EXISTS "Staff can view all payments" ON payments;
    CREATE POLICY "Staff can view all payments"
      ON payments FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.staff s 
          WHERE s.user_id = auth.uid() AND COALESCE(s.status, 'Active') = 'Active'
        )
      );
  END IF;

  -- Admins can view all payments
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'admin_users'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
    CREATE POLICY "Admins can view all payments"
      ON payments FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users a 
          WHERE a.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ======================================
-- FUNCTIONS & TRIGGERS
-- ======================================

-- 1. Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  invoice_num VARCHAR(50);
  year_month VARCHAR(6);
  sequence_num INTEGER;
BEGIN
  IF NEW.invoice_number IS NULL THEN
    year_month := TO_CHAR(now(), 'YYYYMM');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 12) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM payments
    WHERE invoice_number LIKE 'INV-' || year_month || '-%';
    
    invoice_num := 'INV-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
    NEW.invoice_number := invoice_num;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger for invoice generation
DROP TRIGGER IF EXISTS generate_invoice_number_trigger ON payments;
CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_number();

-- 3. Function to notify on new message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    NEW.recipient_id,
    'new_message',
    'New Message',
    'You have a new message',
    jsonb_build_object(
      'booking_id', NEW.booking_id,
      'sender_id', NEW.sender_id,
      'message_id', NEW.id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger for new message notifications
DROP TRIGGER IF EXISTS new_message_notification_trigger ON chat_messages;
CREATE TRIGGER new_message_notification_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- ======================================
-- VERIFICATION
-- ======================================

-- List all created tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'notifications',
    'booking_status_history',
    'staff_approvals',
    'chat_messages',
    'chat_participants',
    'payments',
    'payment_history',
    'refunds'
  )
ORDER BY table_name;

-- Count RLS policies
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN (
  'notifications',
  'booking_status_history',
  'staff_approvals',
  'chat_messages',
  'chat_participants',
  'payments',
  'payment_history',
  'refunds'
)
GROUP BY schemaname, tablename
ORDER BY tablename;

-- ======================================
-- MIGRATION COMPLETE
-- ======================================

-- Grant permissions (if needed)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Commit transaction
COMMIT;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE 'Tables created: 8';
  RAISE NOTICE 'Indexes created: 20+';
  RAISE NOTICE 'RLS policies: Active';
  RAISE NOTICE 'Triggers: Active';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Verify storage bucket: chat-attachments';
  RAISE NOTICE '2. Test staff approval workflow';
  RAISE NOTICE '3. Test chat messaging';
  RAISE NOTICE '4. Test payment tracking';
END $$;
