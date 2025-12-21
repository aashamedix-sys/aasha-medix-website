
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, MapPin, Calendar, Phone, Loader2, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const BookingTracker = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
      // Auto-refresh every 2 minutes
      const interval = setInterval(fetchBookings, 120000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setBookings(data);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Payment Pending': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        title: 'Awaiting Payment',
        step: 0
      },
      'Paid': {
        color: 'bg-blue-100 text-blue-800',
        icon: Clock,
        title: 'Payment Confirmed',
        step: 1
      },
      'Approved': {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        title: 'Approved',
        step: 2
      },
      'Rejected': {
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
        title: 'Rejected',
        step: 0
      },
      'Rescheduled': {
        color: 'bg-purple-100 text-purple-800',
        icon: Calendar,
        title: 'Rescheduled',
        step: 2
      },
      'Completed': {
        color: 'bg-emerald-100 text-emerald-800',
        icon: CheckCircle,
        title: 'Completed',
        step: 3
      }
    };
    return configs[status] || configs['Payment Pending'];
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'test': return '🧪';
      case 'doctor': return '👨‍⚕️';
      case 'medicine': return '💊';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A86B]" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Track Booking - AASHA MEDIX</title></Helmet>
      <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 pb-12">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1F1F1F]">Track Your Bookings</h1>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-[#6B7280] mb-2">No bookings yet</p>
                <p className="text-sm text-[#9CA3AF]">Your bookings will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-l-4 border-l-[#00A86B]">
                      <CardHeader className="bg-gradient-to-r from-[#F9FAFB] to-[#E6F5F0] border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{getTypeIcon(booking.booking_type)}</span>
                              <div>
                                <p className="font-bold text-[#1F1F1F] capitalize">{booking.booking_type} Booking</p>
                                <p className="text-sm text-[#6B7280] font-mono">Ref: {booking.reference_number}</p>
                              </div>
                            </div>
                          </div>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 space-y-4">
                        {/* Status Timeline */}
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-[#1F1F1F]">Status Timeline</p>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#E6F5F0] flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-6 h-6 text-[#00A86B]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#1F1F1F]">Payment Confirmed</p>
                              <p className="text-xs text-[#6B7280]">
                                {new Date(booking.booking_date || booking.created_at).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          {booking.status !== 'Rejected' && booking.status !== 'Payment Pending' && (
                            <div className="flex items-center gap-4 opacity-75">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-6 h-6 text-[#6B7280]" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#1F1F1F]">{statusConfig.title}</p>
                                <p className="text-xs text-[#6B7280]">In progress...</p>
                              </div>
                            </div>
                          )}

                          {booking.status === 'Rejected' && (
                            <div className="flex items-center gap-4 bg-red-50 p-3 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-red-900">Booking Rejected</p>
                                <p className="text-xs text-red-700">{booking.rejection_reason || 'Contact support for details'}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Appointment Details */}
                        {booking.status !== 'Rejected' && (
                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-[#6B7280] mb-1">Appointment Date</p>
                              <div className="flex items-center gap-2 text-sm font-medium text-[#1F1F1F]">
                                <Calendar className="w-4 h-4 text-[#00A86B]" />
                                {new Date(booking.appointment_date).toLocaleDateString('en-IN')}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-[#6B7280] mb-1">Appointment Time</p>
                              <div className="flex items-center gap-2 text-sm font-medium text-[#1F1F1F]">
                                <Clock className="w-4 h-4 text-[#00A86B]" />
                                {booking.appointment_time}
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-[#6B7280] mb-1">Delivery/Collection Address</p>
                              <div className="flex items-start gap-2 text-sm text-[#1F1F1F]">
                                <MapPin className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-0.5" />
                                <p>{booking.address}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Support Info */}
                        {booking.status === 'Rejected' && (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p className="text-sm text-blue-900 font-medium mb-1">Need Help?</p>
                            <p className="text-xs text-blue-700">Contact us at <span className="font-semibold">1800-AASHA-1</span> to reschedule</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingTracker;
