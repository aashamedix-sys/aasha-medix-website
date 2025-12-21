-- Phase 2: Staff Approval Workflow and Notification System
-- This migration adds support for staff approvals, rejections, rescheduling, and notifications

-- 1. Add approval-related columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending Approval',
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rescheduled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rescheduled_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMP;

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  INDEX idx_user_id (user_id),
  INDEX idx_read (read),
  INDEX idx_created_at (created_at)
);

-- 3. Create booking_status_history table for tracking changes
CREATE TABLE IF NOT EXISTS booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT now(),
  INDEX idx_booking_id (booking_id),
  INDEX idx_created_at (created_at)
);

-- 4. Create staff_approvals table for audit trail
CREATE TABLE IF NOT EXISTS staff_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES auth.users(id),
  action VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(booking_id, staff_id, action),
  INDEX idx_staff_id (staff_id),
  INDEX idx_booking_id (booking_id)
);

-- 5. Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Enable RLS on booking_status_history
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for booking_status_history
CREATE POLICY "Staff can view booking status history"
  ON booking_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
    )
  );

-- 9. Enable RLS on staff_approvals
ALTER TABLE staff_approvals ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for staff_approvals
CREATE POLICY "Staff can view all approvals"
  ON staff_approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can insert approvals"
  ON staff_approvals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
    ) AND staff_id = auth.uid()
  );

-- 11. Create function to handle booking status changes
CREATE OR REPLACE FUNCTION handle_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create trigger for booking status changes
DROP TRIGGER IF EXISTS booking_status_change_trigger ON bookings;
CREATE TRIGGER booking_status_change_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_booking_status_change();

-- 13. Create function to send notifications on booking approval
CREATE OR REPLACE FUNCTION notify_on_booking_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Approved' AND OLD.status != 'Approved' THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.patient_id,
      'booking_approved',
      'Booking Approved',
      'Your booking has been approved. Appointment: ' || NEW.appointment_date || ' at ' || NEW.appointment_time,
      jsonb_build_object('booking_id', NEW.id, 'reference_number', NEW.reference_number)
    );
  END IF;
  
  IF NEW.status = 'Rejected' AND OLD.status != 'Rejected' THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.patient_id,
      'booking_rejected',
      'Booking Rejected',
      'Your booking has been rejected. Reason: ' || COALESCE(NEW.rejection_reason, 'No reason provided'),
      jsonb_build_object('booking_id', NEW.id, 'reference_number', NEW.reference_number)
    );
  END IF;
  
  IF NEW.status = 'Rescheduled' AND OLD.status != 'Rescheduled' THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.patient_id,
      'booking_rescheduled',
      'Booking Rescheduled',
      'Your booking has been rescheduled. New appointment: ' || NEW.appointment_date || ' at ' || NEW.appointment_time,
      jsonb_build_object('booking_id', NEW.id, 'reference_number', NEW.reference_number)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create trigger for booking notifications
DROP TRIGGER IF EXISTS booking_notification_trigger ON bookings;
CREATE TRIGGER booking_notification_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_booking_approval();

-- 15. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_patient_id ON bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, read);

-- 16. Add comment/notes column to bookings for staff communication
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS staff_notes TEXT,
ADD COLUMN IF NOT EXISTS special_notes TEXT;

-- Phase 2 migration complete
COMMIT;
