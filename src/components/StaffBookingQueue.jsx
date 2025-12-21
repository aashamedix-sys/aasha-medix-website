import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, Phone, MapPin, 
  Calendar, Filter, ChevronDown, MoreVertical, Loader2 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getPendingBookings, approveBooking, rejectBooking, rescheduleBooking } from '@/utils/staffService';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const StaffBookingQueue = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchBookings();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await getPendingBookings({ 
      booking_type: filterType !== 'all' ? filterType : undefined 
    });
    setBookings(data);
    setLoading(false);
  };

  const handleApprove = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await approveBooking(bookingId, user?.id);
      toast({ 
        title: 'Approved', 
        description: 'Patient will be notified shortly' 
      });
      fetchBookings();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await rejectBooking(bookingId, user?.id, 'Unavailable at requested time');
      toast({ 
        title: 'Rejected', 
        description: 'Patient will be notified' 
      });
      fetchBookings();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Payment Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Paid': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'test': return '🧪';
      case 'doctor': return '👨‍⚕️';
      case 'medicine': return '💊';
      default: return '📋';
    }
  };

  const filteredBookings = filterType === 'all' 
    ? bookings 
    : bookings.filter(b => b.booking_type === filterType);

  const pendingCount = bookings.filter(b => 
    b.status === 'Payment Pending' || b.status === 'Paid'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A86B]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#1F1F1F]">{pendingCount}</p>
              <p className="text-sm text-[#6B7280]">Pending Review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#1F1F1F]">
                {bookings.filter(b => b.status === 'Approved').length}
              </p>
              <p className="text-sm text-[#6B7280]">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#1F1F1F]">
                {bookings.filter(b => b.status === 'Rejected').length}
              </p>
              <p className="text-sm text-[#6B7280]">Rejected</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#1F1F1F]">{bookings.length}</p>
              <p className="text-sm text-[#6B7280]">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Booking Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setFilterType} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="test">🧪 Tests</TabsTrigger>
              <TabsTrigger value="doctor">👨‍⚕️ Doctors</TabsTrigger>
              <TabsTrigger value="medicine">💊 Medicine</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-[#6B7280] mb-2">No bookings to review</p>
              <p className="text-sm text-[#9CA3AF]">All bookings are processed!</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getTypeIcon(booking.booking_type)}</span>
                        <div>
                          <p className="font-semibold text-[#1F1F1F] capitalize">
                            {booking.booking_type} Booking
                          </p>
                          <p className="text-sm text-[#6B7280] font-mono">
                            Ref: {booking.reference_number}
                          </p>
                        </div>
                        <Badge className={`ml-auto ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2 text-[#6B7280]">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.appointment_date).toLocaleDateString('en-IN')}
                        </div>
                        <div className="flex items-center gap-2 text-[#6B7280]">
                          <Clock className="w-4 h-4" />
                          {booking.appointment_time}
                        </div>
                        <div className="flex items-center gap-2 text-[#6B7280]">
                          <Phone className="w-4 h-4" />
                          {booking.mobile}
                        </div>
                        <div className="flex items-center gap-2 text-[#6B7280]">
                          <span className="font-semibold text-[#1F1F1F]">₹{booking.total_amount}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronDown 
                      className={`w-5 h-5 text-[#6B7280] transition-transform ${
                        expandedId === booking.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {/* Expanded Details */}
                  {expandedId === booking.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      {/* Address */}
                      <div>
                        <p className="text-sm font-semibold text-[#1F1F1F] mb-1">Delivery Address</p>
                        <div className="flex gap-2 text-sm text-[#6B7280]">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>{booking.address}</p>
                        </div>
                      </div>

                      {/* Notes */}
                      {booking.notes && (
                        <div>
                          <p className="text-sm font-semibold text-[#1F1F1F] mb-1">Patient Notes</p>
                          <p className="text-sm text-[#6B7280] bg-gray-50 p-3 rounded">
                            {booking.notes}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {booking.status !== 'Approved' && booking.status !== 'Rejected' && (
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <Button
                            onClick={() => handleApprove(booking.id)}
                            disabled={processingId === booking.id}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            {processingId === booking.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(booking.id)}
                            disabled={processingId === booking.id}
                            variant="outline"
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          >
                            {processingId === booking.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-2" />
                            )}
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffBookingQueue;
