-- Phase 3: Real-time Chat System Migration
-- This migration adds chat functionality between patients and staff for each booking

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
  updated_at TIMESTAMP DEFAULT now(),
  INDEX idx_booking_id (booking_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_created_at (created_at),
  INDEX idx_read (read)
);

-- 2. Create chat_participants table (for group chats in future)
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'patient', 'staff', 'admin'
  joined_at TIMESTAMP DEFAULT now(),
  last_read_at TIMESTAMP,
  UNIQUE(booking_id, user_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_user_id (user_id)
);

-- 3. Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for chat_messages
CREATE POLICY "Users can view messages they sent or received"
  ON chat_messages FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
  );

CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
  ON chat_messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- 5. Enable RLS on chat_participants
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for chat_participants
CREATE POLICY "Users can view their own participant records"
  ON chat_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join chats"
  ON chat_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Create storage policy for chat attachments
CREATE POLICY "Users can upload chat attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view chat attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-attachments');

-- 9. Create function to notify on new message
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
      'message_id', NEW.id,
      'message_preview', LEFT(NEW.message, 50)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger for new message notifications
DROP TRIGGER IF EXISTS new_message_notification_trigger ON chat_messages;
CREATE TRIGGER new_message_notification_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- 11. Create function to update last_read_at
CREATE OR REPLACE FUNCTION update_last_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read = TRUE AND OLD.read = FALSE THEN
    UPDATE chat_participants
    SET last_read_at = now()
    WHERE booking_id = NEW.booking_id
      AND user_id = NEW.recipient_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create trigger for updating last_read_at
DROP TRIGGER IF EXISTS update_last_read_trigger ON chat_messages;
CREATE TRIGGER update_last_read_trigger
  AFTER UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_read();

-- 13. Add function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM chat_messages
    WHERE recipient_id = user_uuid
      AND read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create view for conversation summaries
CREATE OR REPLACE VIEW conversation_summaries AS
SELECT 
  cm.booking_id,
  cm.sender_id,
  cm.recipient_id,
  cm.message AS latest_message,
  cm.created_at AS latest_message_at,
  COUNT(CASE WHEN cm2.read = FALSE THEN 1 END) AS unread_count,
  b.reference_number,
  b.booking_type,
  b.status
FROM chat_messages cm
LEFT JOIN chat_messages cm2 ON cm.booking_id = cm2.booking_id
LEFT JOIN bookings b ON cm.booking_id = b.id
WHERE cm.created_at = (
  SELECT MAX(created_at)
  FROM chat_messages
  WHERE booking_id = cm.booking_id
)
GROUP BY cm.booking_id, cm.sender_id, cm.recipient_id, cm.message, cm.created_at, 
         b.reference_number, b.booking_type, b.status
ORDER BY cm.created_at DESC;

-- 15. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_booking_sender ON chat_messages(booking_id, sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_booking_recipient ON chat_messages(booking_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_unread ON chat_messages(recipient_id, read) WHERE read = FALSE;

-- Phase 3 migration complete
COMMIT;
