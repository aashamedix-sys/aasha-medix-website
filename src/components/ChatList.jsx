import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { MessageSquare, Search, User, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ChatWindow from '@/components/ChatWindow';

export const ChatList = () => {
  const { user, userRole } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
    subscribeToConversations();
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Get all bookings with their latest messages
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id,
          reference_number,
          booking_type,
          status,
          patient:patient_id(id, name, email),
          staff:approved_by(id, name, email),
          chat_messages(
            id,
            message,
            sender_id,
            created_at,
            read
          )
        `)
        .or(`patient_id.eq.${user.id},approved_by.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process and sort by latest message
      const processedConversations = bookings
        .map((booking) => {
          const messages = booking.chat_messages || [];
          const latestMessage = messages[messages.length - 1];
          const unreadCount = messages.filter(
            (m) => m.sender_id !== user.id && !m.read
          ).length;

          // Determine the other person in the conversation
          const otherPerson = userRole === 'staff' 
            ? booking.patient 
            : booking.staff || { name: 'Support Staff', email: 'support@aashamedix.com' };

          return {
            ...booking,
            latestMessage,
            unreadCount,
            otherPerson
          };
        })
        .filter((conv) => conv.chat_messages && conv.chat_messages.length > 0)
        .sort((a, b) => {
          if (!a.latestMessage) return 1;
          if (!b.latestMessage) return -1;
          return new Date(b.latestMessage.created_at) - new Date(a.latestMessage.created_at);
        });

      setConversations(processedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString('en-IN', { weekday: 'short' });
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.reference_number?.toLowerCase().includes(query) ||
      conv.otherPerson?.name?.toLowerCase().includes(query) ||
      conv.booking_type?.toLowerCase().includes(query)
    );
  });

  if (selectedChat) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedChat(null)}
          className="text-[#00A86B] hover:underline font-medium"
        >
          ← Back to Conversations
        </button>
        <ChatWindow
          bookingId={selectedChat.id}
          recipientId={selectedChat.otherPerson.id}
          recipientName={selectedChat.otherPerson.name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F1F1F]">Messages</h1>
        <p className="text-[#6B7280] mt-1">Chat with patients and staff</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
        <Input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conversations List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[#6B7280]">Loading conversations...</p>
          </CardContent>
        </Card>
      ) : filteredConversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#6B7280] font-medium">No conversations yet</p>
            <p className="text-sm text-[#9CA3AF]">Start chatting with your bookings</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  conversation.unreadCount > 0 ? 'border-l-4 border-l-[#00A86B]' : ''
                }`}
                onClick={() => setSelectedChat(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#E6F5F0] flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-[#00A86B]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-[#1F1F1F] truncate ${conversation.unreadCount > 0 ? 'font-bold' : ''}`}>
                            {conversation.otherPerson?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-[#6B7280] truncate font-mono">
                            {conversation.reference_number} • {conversation.booking_type}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {conversation.latestMessage && (
                            <span className="text-xs text-[#9CA3AF]">
                              {formatTime(conversation.latestMessage.created_at)}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-[#00A86B] text-white px-2 py-0.5 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Latest Message Preview */}
                      {conversation.latestMessage && (
                        <p className={`text-sm mt-2 truncate ${conversation.unreadCount > 0 ? 'text-[#1F1F1F] font-medium' : 'text-[#6B7280]'}`}>
                          {conversation.latestMessage.message}
                        </p>
                      )}

                      {/* Status Badge */}
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
