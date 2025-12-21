
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, MapPin, Download, Home, ArrowRight, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateBooking = location.state?.booking;
  const stateRefNum = location.state?.refNum;
  
  const [booking, setBooking] = useState(stateBooking || null);
  const [loading, setLoading] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-600"/></div>;

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Booking Found</h2>
        <p className="text-gray-500 mb-6">It looks like you haven't made a booking yet or the session expired.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Booking Confirmed - AASHA MEDIX</title></Helmet>
      <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
        <Card className="max-w-2xl mx-auto border-t-4 border-t-green-500 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-500">Thank you for choosing AASHA MEDIX.</p>
              <div className="mt-4 inline-block bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-500">Reference ID:</span>
                <span className="ml-2 font-mono font-bold text-gray-900 tracking-wide">{booking.reference_number || stateRefNum}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-left bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Service Type</p>
                <p className="font-medium text-gray-900 capitalize">{booking.booking_type} Service</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmed
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Date & Time</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{booking.appointment_date} at {booking.appointment_time}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Location</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm font-medium truncate w-full">{booking.address || booking.collection_address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                You will receive a confirmation SMS and Email shortly. <br/>
                Our representative will contact you prior to arrival.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/booking-tracker">
                   <Button variant="outline" className="w-full sm:w-auto hover:bg-gray-50">
                     <ArrowRight className="w-4 h-4 mr-2" /> Track Booking
                   </Button>
                </Link>
                <Button variant="outline" className="w-full sm:w-auto hover:bg-gray-50" onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" /> Download Receipt
                </Button>
                <Link to="/">
                   <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 shadow-md">
                     <Home className="w-4 h-4 mr-2" /> Back to Home
                   </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BookingConfirmation;
