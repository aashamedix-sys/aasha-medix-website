import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Calendar,
  X,
  RotateCcw,
  MessageSquare,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const NotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
    const subscription = supabase
      .channel(`notifications:user_id=eq.${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
        console.log('Notification received:', payload);
        fetchNotifications();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'booking_approved': { icon: CheckCircle, color: 'text-green-600' },
      'booking_rejected': { icon: XCircle, color: 'text-red-600' },
      'booking_rescheduled': { icon: Calendar, color: 'text-blue-600' },
      'booking_pending': { icon: AlertCircle, color: 'text-yellow-600' },
      'message': { icon: MessageSquare, color: 'text-purple-600' },
      'default': { icon: Bell, color: 'text-[#00A86B]' }
    };
    return icons[type] || icons['default'];
  };

  return (
    <div className="space-y-4">
      {/* Header with Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-[#00A86B]" />
          <h2 className="text-2xl font-bold text-[#1F1F1F]">Notifications</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-[#6B7280]">Loading notifications...</p>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#6B7280] font-medium">No notifications</p>
            <p className="text-sm text-[#9CA3AF]">You're all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {notifications.map((notification) => {
              const { icon: Icon, color } = getNotificationIcon(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    setSelectedNotification(
                      selectedNotification?.id === notification.id ? null : notification
                    );
                  }}
                  className={`cursor-pointer transition-all ${
                    !notification.read
                      ? 'bg-blue-50 border-l-4 border-l-[#00A86B]'
                      : 'bg-white border-l-4 border-l-transparent'
                  } border border-gray-200 rounded-lg p-4 hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`${!notification.read ? 'font-semibold' : 'font-medium'} text-[#1F1F1F]`}>
                            {notification.title || 'Notification'}
                          </p>
                          <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#9CA3AF] mt-2">
                            {new Date(notification.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-[#D1D5DB] hover:text-[#6B7280] transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Expandable Content */}
                      <AnimatePresence>
                        {selectedNotification?.id === notification.id && notification.data && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-gray-200"
                          >
                            <div className="text-sm text-[#1F1F1F] space-y-1">
                              {Object.entries(notification.data).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-[#6B7280]">{key}:</span>
                                  <span className="font-medium">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default NotificationCenter;
