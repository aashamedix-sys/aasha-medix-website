
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, Download, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const BookingConfirmation = ({ bookingDetails }) => {
  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  if (!bookingDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border-none">
        {/* Success Header */}
        <div className="bg-[#1FAA59] p-8 text-center text-white relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-green-50 opacity-90">Thank you for choosing AASHA MEDIX</p>
          <div className="mt-6 bg-white/10 rounded-lg p-3 inline-block">
             <p className="text-sm font-mono opacity-80 uppercase tracking-widest text-xs">Reference ID</p>
             <p className="text-xl font-bold tracking-wider">{bookingDetails.referenceNumber}</p>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-8 space-y-6">
          
          <div className="space-y-4">
             <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Calendar className="w-5 h-5 text-[#1FAA59] mt-0.5" />
                <div>
                   <p className="text-sm text-gray-500">Date</p>
                   <p className="font-semibold text-gray-900">{bookingDetails.bookingDate}</p>
                </div>
             </div>
             
             <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Clock className="w-5 h-5 text-[#1FAA59] mt-0.5" />
                <div>
                   <p className="text-sm text-gray-500">Time</p>
                   <p className="font-semibold text-gray-900">{bookingDetails.bookingTime}</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <MapPin className="w-5 h-5 text-[#1FAA59] mt-0.5" />
                <div>
                   <p className="text-sm text-gray-500">Collection Address</p>
                   <p className="font-semibold text-gray-900">{bookingDetails.collectionAddress || 'Video Consultation'}</p>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
             <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
               <FileText className="w-4 h-4 text-gray-400" />
               Summary
             </h3>
             <ul className="space-y-2">
                {bookingDetails.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    <span className="font-medium">₹{item.price || item.consultationFee}</span>
                  </li>
                ))}
             </ul>
             <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-gray-200">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-bold text-xl text-[#1FAA59]">₹{bookingDetails.totalAmount}</span>
             </div>
          </div>

          {/* Notification Status */}
          <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl flex flex-col gap-1">
             <p className="font-medium flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
               Notifications Sent
             </p>
             <p className="text-xs opacity-80">
               A confirmation email has been sent to <strong>{bookingDetails.email}</strong> and an SMS to <strong>{bookingDetails.phone}</strong>.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
             <Button variant="outline" className="w-full border-gray-200" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
             </Button>
             <Link to="/">
                <Button className="w-full bg-[#1FAA59] hover:bg-green-700 text-white">
                   <Home className="w-4 h-4 mr-2" />
                   Go Home
                </Button>
             </Link>
          </div>

        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
