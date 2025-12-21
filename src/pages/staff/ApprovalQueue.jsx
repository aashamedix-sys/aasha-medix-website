import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Check, 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  MessageSquare,
  FileText
} from 'lucide-react';

export const ApprovalQueue = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingBookings();
  }, [filter]);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('bookings')
        .select(`
          *,
          patient:patient_id(name, phone, email),
          service:service_type(*)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('status', 'Pending Approval');
      } else if (filter === 'approved') {
        query = query.eq('status', 'Approved');
      } else if (filter === 'rejected') {
        query = query.eq('status', 'Rejected');
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'Approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getSession()).data.session.user.id
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Send notification to patient
      await sendNotification(bookingId, 'approved');

      // Refresh list
      fetchPendingBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error approving booking:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setProcessingId(bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'Rejected',
          rejection_reason: rejectionReason,
          rejected_at: new Date().toISOString(),
          rejected_by: (await supabase.auth.getSession()).data.session.user.id
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Send notification to patient
      await sendNotification(bookingId, 'rejected', rejectionReason);

      // Refresh list
      fetchPendingBookings();
      setSelectedBooking(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting booking:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReschedule = async (bookingId) => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      setProcessingId(bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({
          appointment_date: rescheduleDate,
          appointment_time: rescheduleTime,
          status: 'Rescheduled',
          rescheduled_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Send notification to patient
      await sendNotification(bookingId, 'rescheduled', `New appointment: ${rescheduleDate} at ${rescheduleTime}`);

      // Refresh list
      fetchPendingBookings();
      setSelectedBooking(null);
      setRescheduleDate('');
      setRescheduleTime('');
    } catch (error) {
      console.error('Error rescheduling booking:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const sendNotification = async (bookingId, action, details = '') => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const message = {
        'approved': `Your booking (${booking.reference_number}) has been approved. Appointment: ${booking.appointment_date} at ${booking.appointment_time}`,
        'rejected': `Your booking (${booking.reference_number}) has been rejected. Reason: ${details}`,
        'rescheduled': `Your booking (${booking.reference_number}) has been rescheduled. ${details}`
      };

      await supabase
        .from('notifications')
        .insert([{
          user_id: booking.patient_id,
          type: `booking_${action}`,
          message: message[action],
          data: { booking_id: bookingId },
          read: false
        }]);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Pending Approval': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      'Approved': { color: 'bg-green-100 text-green-800', icon: Check },
      'Rejected': { color: 'bg-red-100 text-red-800', icon: X },
      'Rescheduled': { color: 'bg-blue-100 text-blue-800', icon: Calendar }
    };
    return config[status] || config['Pending Approval'];
  };

  const getBookingTypeBadge = (type) => {
    const types = {
      'doctor': { emoji: '👨‍⚕️', label: 'Doctor Consultation' },
      'diagnostic': { emoji: '🔬', label: 'Diagnostic Test' },
      'medicine': { emoji: '💊', label: 'Medicine Order' }
    };
    return types[type] || types['doctor'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F1F1F]">Approval Queue</h1>
          <p className="text-[#6B7280] mt-1">Review and manage pending bookings</p>
        </div>
        <Button 
          onClick={() => fetchPendingBookings()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['pending', 'approved', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === tab
                ? 'text-[#00A86B] border-b-2 border-[#00A86B]'
                : 'text-[#6B7280] hover:text-[#1F1F1F]'
            }`}
          >
            {tab} ({bookings.length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 text-[#00A86B] animate-spin" />
          <span className="ml-2 text-[#6B7280]">Loading bookings...</span>
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[#6B7280] mb-2">No {filter} bookings</p>
            <p className="text-sm text-[#9CA3AF]">All {filter} bookings are caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getBookingTypeBadge(booking.booking_type).emoji}</span>
                          <div>
                            <p className="font-bold text-[#1F1F1F]">{getBookingTypeBadge(booking.booking_type).label}</p>
                            <p className="text-sm text-[#6B7280] font-mono">Ref: {booking.reference_number}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusBadge(booking.status).color} border-0`}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {selectedBooking?.id === booking.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="space-y-6 border-t pt-6">
                          {/* Patient Info */}
                          <div>
                            <p className="text-sm font-semibold text-[#1F1F1F] mb-3">Patient Information</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-[#00A86B]" />
                                <p className="text-sm text-[#1F1F1F]">{booking.patient?.name || 'N/A'}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[#00A86B]" />
                                <p className="text-sm text-[#1F1F1F]">{booking.patient?.phone || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Appointment Details */}
                          {booking.status !== 'Rejected' && (
                            <div>
                              <p className="text-sm font-semibold text-[#1F1F1F] mb-3">Appointment Details</p>
                              <div className="grid md:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-4 h-4 text-[#00A86B]" />
                                  <div>
                                    <p className="text-xs text-[#6B7280]">Date</p>
                                    <p className="text-sm font-medium text-[#1F1F1F]">{new Date(booking.appointment_date).toLocaleDateString('en-IN')}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Clock className="w-4 h-4 text-[#00A86B]" />
                                  <div>
                                    <p className="text-xs text-[#6B7280]">Time</p>
                                    <p className="text-sm font-medium text-[#1F1F1F]">{booking.appointment_time}</p>
                                  </div>
                                </div>
                                <div className="md:col-span-2 flex items-start gap-3">
                                  <MapPin className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-[#6B7280]">Location</p>
                                    <p className="text-sm text-[#1F1F1F]">{booking.address}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Special Notes */}
                          {booking.special_notes && (
                            <div>
                              <p className="text-sm font-semibold text-[#1F1F1F] mb-2">Patient Notes</p>
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-900">{booking.special_notes}</p>
                              </div>
                            </div>
                          )}

                          {/* Rejection Reason (if rejected) */}
                          {booking.status === 'Rejected' && booking.rejection_reason && (
                            <div>
                              <p className="text-sm font-semibold text-[#1F1F1F] mb-2">Rejection Reason</p>
                              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                <p className="text-sm text-red-900">{booking.rejection_reason}</p>
                              </div>
                            </div>
                          )}

                          {/* Actions - Only for pending */}
                          {booking.status === 'Pending Approval' && (
                            <div className="space-y-4 pt-4 border-t">
                              <div>
                                <label className="text-sm font-medium text-[#1F1F1F] block mb-2">
                                  Rejection Reason (if applicable)
                                </label>
                                <textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="e.g., Time slot not available, Doctor unavailable, etc."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                                  rows="3"
                                />
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <Button
                                  onClick={() => handleApprove(booking.id)}
                                  disabled={processingId === booking.id}
                                  className="bg-[#00A86B] hover:bg-[#008F5A] gap-2"
                                >
                                  <Check className="w-4 h-4" />
                                  {processingId === booking.id ? 'Approving...' : 'Approve'}
                                </Button>
                                <Button
                                  onClick={() => handleReject(booking.id)}
                                  disabled={processingId === booking.id}
                                  variant="destructive"
                                  className="gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  {processingId === booking.id ? 'Rejecting...' : 'Reject'}
                                </Button>
                              </div>

                              {/* Reschedule Option */}
                              <div className="space-y-2 pt-2">
                                <p className="text-sm font-medium text-[#1F1F1F]">Or Reschedule</p>
                                <div className="grid md:grid-cols-2 gap-2">
                                  <input
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                                  />
                                  <input
                                    type="time"
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                                  />
                                </div>
                                <Button
                                  onClick={() => handleReschedule(booking.id)}
                                  disabled={processingId === booking.id}
                                  variant="outline"
                                  className="w-full gap-2"
                                >
                                  <Calendar className="w-4 h-4" />
                                  {processingId === booking.id ? 'Rescheduling...' : 'Reschedule'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ApprovalQueue;
