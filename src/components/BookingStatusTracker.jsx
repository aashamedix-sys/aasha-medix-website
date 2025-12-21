import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const BookingStatusTracker = ({ bookingId }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) throw error;

      setBooking(data);
      buildTimeline(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTimeline = (booking) => {
    const timeline = [
      {
        step: 1,
        label: 'Booking Created',
        timestamp: booking.created_at,
        status: 'completed',
        icon: CheckCircle
      },
      {
        step: 2,
        label: 'Payment Confirmed',
        timestamp: booking.payment_confirmed_at,
        status: booking.payment_confirmed_at ? 'completed' : 'pending',
        icon: CheckCircle
      },
      {
        step: 3,
        label: 'Pending Approval',
        timestamp: booking.approved_at || booking.rejected_at,
        status: booking.status === 'Pending Approval' ? 'in-progress' : booking.approved_at ? 'completed' : booking.rejected_at ? 'rejected' : 'pending',
        icon: booking.status === 'Rejected' ? AlertCircle : Clock
      },
      {
        step: 4,
        label: 'Approved',
        timestamp: booking.approved_at,
        status: booking.approved_at ? 'completed' : 'pending',
        icon: CheckCircle
      },
      {
        step: 5,
        label: 'Appointment Scheduled',
        timestamp: booking.appointment_date,
        status: booking.appointment_date ? 'completed' : 'pending',
        icon: CheckCircle
      },
      {
        step: 6,
        label: 'Completed',
        timestamp: booking.completed_at,
        status: booking.completed_at ? 'completed' : 'pending',
        icon: CheckCircle
      }
    ];

    setTimeline(timeline.filter(item => item.timestamp || item.status !== 'pending'));
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-[#00A86B]';
      case 'in-progress':
        return 'text-[#F59E0B]';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-[#D1D5DB]';
    }
  };

  const getStepBgColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#E6F5F0]';
      case 'in-progress':
        return 'bg-yellow-50';
      case 'rejected':
        return 'bg-red-50';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-[#6B7280]">Loading tracking information...</div>;
  }

  if (!booking) {
    return <div className="text-center py-8 text-red-600">Booking not found</div>;
  }

  const currentStep = timeline.findIndex(item => item.status === 'in-progress' || item.status === 'rejected');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#00A86B]" />
          <CardTitle>Booking Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Timeline Steps */}
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-0">
            <motion.div
              className="h-full bg-[#00A86B]"
              initial={{ width: 0 }}
              animate={{
                width: currentStep >= 0 ? `${(currentStep / (timeline.length - 1)) * 100}%` : 0
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between relative z-10">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              const isActive = index <= currentStep;

              return (
                <motion.div
                  key={item.step}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-all ${getStepBgColor(item.status)}`}
                  >
                    <Icon className={`w-6 h-6 ${getStepColor(item.status)}`} />
                  </div>
                  <p className="text-xs font-medium text-[#1F1F1F] mt-3 text-center max-w-[80px]">
                    {item.label}
                  </p>
                  {item.timestamp && (
                    <p className="text-xs text-[#6B7280] mt-1">
                      {new Date(item.timestamp).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Current Status Info */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-1">Current Status</p>
          <p className="text-sm text-blue-800">{booking.status}</p>
          {booking.rejection_reason && (
            <p className="text-sm text-red-700 mt-2">Reason: {booking.rejection_reason}</p>
          )}
        </div>

        {/* Key Details */}
        <div className="grid md:grid-cols-2 gap-4">
          {booking.appointment_date && (
            <div>
              <p className="text-xs text-[#6B7280] font-semibold">Appointment Date</p>
              <p className="text-sm font-medium text-[#1F1F1F]">
                {new Date(booking.appointment_date).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}
          {booking.appointment_time && (
            <div>
              <p className="text-xs text-[#6B7280] font-semibold">Appointment Time</p>
              <p className="text-sm font-medium text-[#1F1F1F]">{booking.appointment_time}</p>
            </div>
          )}
          {booking.approved_at && (
            <div>
              <p className="text-xs text-[#6B7280] font-semibold">Approved On</p>
              <p className="text-sm font-medium text-[#1F1F1F]">
                {new Date(booking.approved_at).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}
          {booking.completed_at && (
            <div>
              <p className="text-xs text-[#6B7280] font-semibold">Completed On</p>
              <p className="text-sm font-medium text-[#1F1F1F]">
                {new Date(booking.completed_at).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingStatusTracker;
