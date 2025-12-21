import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Send, 
  Paperclip, 
  User, 
  Clock,
  CheckCheck,
  Check,
  XCircle,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

export const ChatWindow = ({ bookingId, recipientId, recipientName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:sender_id(name, email),
          attachment:attachment_url
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat:booking_id=eq.${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const { error } = await supabase.from('chat_messages').insert([
        {
          booking_id: bookingId,
          sender_id: user.id,
          recipient_id: recipientId,
          message: newMessage.trim(),
          read: false
        }
      ]);

      if (error) throw error;

      setNewMessage('');
      
      // Send push notification to recipient
      await sendPushNotification(recipientId, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const sendPushNotification = async (recipientId, messageText) => {
    try {
      await supabase.from('notifications').insert([
        {
          user_id: recipientId,
          type: 'new_message',
          title: 'New Message',
          message: `You have a new message regarding booking ${bookingId}`,
          data: { booking_id: bookingId, message: messageText.slice(0, 50) },
          read: false
        }
      ]);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}/${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName);

      // Send message with attachment
      await supabase.from('chat_messages').insert([
        {
          booking_id: bookingId,
          sender_id: user.id,
          recipient_id: recipientId,
          message: `Sent a file: ${file.name}`,
          attachment_url: urlData.publicUrl,
          attachment_type: file.type,
          read: false
        }
      ]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-[#00A86B] to-[#008F5A] text-white">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 bg-white text-[#00A86B]">
            <User className="w-6 h-6" />
          </Avatar>
          <div>
            <CardTitle className="text-white text-lg">{recipientName}</CardTitle>
            <p className="text-xs text-green-100">
              {typing ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Messages Container */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#6B7280]">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-[#6B7280] font-medium">No messages yet</p>
              <p className="text-sm text-[#9CA3AF] mt-1">Start a conversation</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user.id;
              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  onMouseEnter={() => {
                    if (!isOwnMessage && !message.read) {
                      markAsRead(message.id);
                    }
                  }}
                >
                  {showAvatar && (
                    <Avatar className={`w-8 h-8 flex-shrink-0 ${isOwnMessage ? 'bg-[#00A86B]' : 'bg-gray-300'} text-white`}>
                      <User className="w-4 h-4" />
                    </Avatar>
                  )}
                  {!showAvatar && <div className="w-8" />}

                  <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-[#00A86B] text-white'
                          : 'bg-white text-[#1F1F1F] border border-gray-200'
                      }`}
                    >
                      <p className="text-sm break-words">{message.message}</p>
                      
                      {/* Attachment */}
                      {message.attachment_url && (
                        <div className="mt-2 p-2 bg-white/20 rounded border border-white/30">
                          {message.attachment_type?.startsWith('image/') ? (
                            <img
                              src={message.attachment_url}
                              alt="Attachment"
                              className="max-w-full rounded"
                            />
                          ) : (
                            <a
                              href={message.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm hover:underline"
                            >
                              <FileText className="w-4 h-4" />
                              View File
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center gap-2 text-xs ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[#9CA3AF]">{formatTime(message.created_at)}</span>
                      {isOwnMessage && (
                        <span className="text-[#9CA3AF]">
                          {message.read ? <CheckCheck className="w-3 h-3 text-[#00A86B]" /> : <Check className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B] resize-none max-h-32"
            rows="2"
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            className="bg-[#00A86B] hover:bg-[#008F5A] flex-shrink-0"
          >
            {sending ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
