-- Phase 4: Payment Integration & Invoice System Migration
-- This migration adds comprehensive payment tracking and invoice generation

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
  payment_method VARCHAR(50), -- 'card', 'upi', 'netbanking', 'wallet', etc.
  payment_gateway VARCHAR(50), -- 'razorpay', 'stripe', etc.
  transaction_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded'
  invoice_number VARCHAR(50) UNIQUE,
  invoice_generated BOOLEAN DEFAULT FALSE,
  payment_metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_reason TEXT,
  INDEX idx_booking_id (booking_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_created_at (created_at)
);

-- 2. Create payment_history table for audit trail
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  INDEX idx_payment_id (payment_id),
  INDEX idx_created_at (created_at)
);

-- 3. Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
  refund_transaction_id VARCHAR(255),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  completed_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  INDEX idx_payment_id (payment_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- 4. Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Enable RLS on payment_history
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for payment_history
CREATE POLICY "Users can view their payment history"
  ON payment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payments 
      WHERE payments.id = payment_history.payment_id 
      AND payments.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all payment history"
  ON payment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
    )
  );

-- 8. Enable RLS on refunds table
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for refunds
CREATE POLICY "Users can view their own refunds"
  ON refunds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create refund requests"
  ON refunds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view and update all refunds"
  ON refunds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can update refunds"
  ON refunds FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM staff WHERE staff.user_id = auth.uid()
    )
  );

-- 10. Create function to handle payment status changes
CREATE OR REPLACE FUNCTION handle_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO payment_history (payment_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
    
    -- Update booking payment_confirmed_at when payment is completed
    IF NEW.status = 'completed' THEN
      UPDATE bookings
      SET payment_confirmed_at = now()
      WHERE id = NEW.booking_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger for payment status changes
DROP TRIGGER IF EXISTS payment_status_change_trigger ON payments;
CREATE TRIGGER payment_status_change_trigger
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION handle_payment_status_change();

-- 12. Create function to generate invoice number
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

-- 13. Create trigger for invoice number generation
DROP TRIGGER IF EXISTS generate_invoice_number_trigger ON payments;
CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_number();

-- 14. Create function to send payment notification
CREATE OR REPLACE FUNCTION notify_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'payment_completed',
      'Payment Successful',
      'Your payment of ₹' || NEW.total_amount || ' has been successfully processed.',
      jsonb_build_object(
        'payment_id', NEW.id,
        'booking_id', NEW.booking_id,
        'amount', NEW.total_amount,
        'invoice_number', NEW.invoice_number
      )
    );
  END IF;
  
  IF NEW.status = 'failed' AND OLD.status != 'failed' THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'payment_failed',
      'Payment Failed',
      'Your payment of ₹' || NEW.total_amount || ' could not be processed. Please try again.',
      jsonb_build_object(
        'payment_id', NEW.id,
        'booking_id', NEW.booking_id,
        'amount', NEW.total_amount
      )
    );
  END IF;
  
  IF NEW.status = 'refunded' AND OLD.status != 'refunded' THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'payment_refunded',
      'Refund Processed',
      'A refund of ₹' || NEW.total_amount || ' has been processed to your account.',
      jsonb_build_object(
        'payment_id', NEW.id,
        'booking_id', NEW.booking_id,
        'amount', NEW.total_amount
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create trigger for payment notifications
DROP TRIGGER IF EXISTS payment_notification_trigger ON payments;
CREATE TRIGGER payment_notification_trigger
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_status();

-- 16. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_refunds_user_status ON refunds(user_id, status);

-- Phase 4 migration complete
COMMIT;
