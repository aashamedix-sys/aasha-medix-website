
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Truck, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet';

const BookingTracker = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        const { data } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setBookings(data);
        setLoading(false);
      };
      fetchBookings();
    } else {
        setLoading(false);
    }
  }, [user]);

  const getStatusStep = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'completed') return 4;
    if (s === 'processing' || s === 'collected') return 2;
    if (s === 'confirmed') return 1;
    return 0; // pending
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <>
      <Helmet><title>Track Booking - AASHA MEDIX</title></Helmet>
      <div className="pt-24 min-h-screen bg-gray-50 px-4 pb-12">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Track Your Bookings</h1>
          
          <div className="space-y-6">
            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow">No bookings found.</div>
            ) : (
                bookings.map((booking) => {
                    const step = getStatusStep(booking.status);
                    return (
                        <Card key={booking.id} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 border-b flex flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg">Order #{booking.reference_number || booking.id.slice(0,8)}</CardTitle>
                                    <p className="text-sm text-gray-500 capitalize">{booking.booking_type} • {new Date(booking.created_at).toLocaleDateString()}</p>
                                </div>
                                <Badge className={booking.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}>
                                    {booking.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="relative flex justify-between items-center">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0"></div>
                                    <div className={`absolute top-1/2 left-0 h-1 bg-green-500 -z-0 transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
                                    
                                    {['Confirmed', 'Processing', 'Report Ready', 'Completed'].map((label, idx) => {
                                        const isCompleted = step >= idx + 1;
                                        return (
                                            <div key={idx} className="relative z-10 flex flex-col items-center bg-white px-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                                                    {idx === 0 && <CheckCircle className="w-4 h-4" />}
                                                    {idx === 1 && <Truck className="w-4 h-4" />}
                                                    {idx === 2 && <FileText className="w-4 h-4" />}
                                                    {idx === 3 && <CheckCircle className="w-4 h-4" />}
                                                </div>
                                                <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingTracker;
