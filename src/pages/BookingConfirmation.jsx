
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, Copy, MapPin, Calendar, Clock, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const bookingData = location.state?.booking;
  const refNum = location.state?.refNum;

  useEffect(() => {
    if (!bookingData) {
      navigate('/');
      return;
    }
  }, [bookingData, navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!bookingData) return null;

  const getTypeLabel = (type) => {
    switch(type) {
      case 'test': return 'Diagnostic Test';
      case 'doctor': return 'Doctor Consultation';
      case 'medicine': return 'Medicine Order';
      default: return 'Booking';
    }
  };

  const getNextSteps = (type) => {
    switch(type) {
      case 'test':
        return [
          { icon: Phone, title: 'We\'ll call you within 1 hour', desc: 'To confirm collection time' },
          { icon: MapPin, title: 'Sample collection at home', desc: 'By certified phlebotomist' },
          { icon: FileText, title: 'Reports within 24 hours', desc: 'Sent to your registered email' }
        ];
      case 'doctor':
        return [
          { icon: Phone, title: 'Doctor assignment', desc: 'Based on your specialty choice' },
          { icon: Clock, title: 'Consultation slot', desc: 'Online or in-person as selected' },
          { icon: FileText, title: 'Prescription & follow-up', desc: 'Shared via app and email' }
        ];
      case 'medicine':
        return [
          { icon: Phone, title: 'Order confirmation call', desc: 'We\'ll verify your order' },
          { icon: MapPin, title: 'Home delivery', desc: 'With licensed pharmacist' },
          { icon: FileText, title: 'Billing receipt', desc: 'Sent to your email' }
        ];
      default:
        return [];
    }
  };

  const steps = getNextSteps(bookingData.booking_type);

  return (
    <>
      <Helmet>
        <title>Booking Confirmed - AASHA MEDIX</title>
        <meta name="description" content="Your booking has been confirmed. Track your appointment." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#E6F5F0] to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#00A86B]/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-[#00A86B]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[#1F1F1F] mb-2">Booking Confirmed!</h1>
            <p className="text-[#6B7280] text-lg">Your {getTypeLabel(bookingData.booking_type).toLowerCase()} is scheduled</p>
          </motion.div>

          {/* Reference Number Card */}
          <Card className="mb-6 border-2 border-[#00A86B]/30 bg-white shadow-lg rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-[#00A86B]/10 to-[#E6F5F0] rounded-t-2xl">
              <CardTitle className="text-center text-[#00A86B]">Your Reference Number</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Reference</p>
                  <p className="text-3xl font-bold text-[#1F1F1F] font-mono">{refNum}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(refNum)}
                  className="p-3 hover:bg-[#E6F5F0] rounded-lg transition-colors"
                  title="Copy reference number"
                >
                  <Copy className="w-5 h-5 text-[#00A86B]" />
                </button>
              </div>
              {copied && <p className="text-sm text-[#00A86B] mt-2 text-center font-medium">Copied!</p>}
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="mb-6 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-[#00A86B]" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Service Type</p>
                  <p className="font-semibold text-[#1F1F1F]">{getTypeLabel(bookingData.booking_type)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Status</p>
                  <p className="font-semibold text-[#00A86B]">{bookingData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Appointment Date</p>
                  <p className="font-semibold text-[#1F1F1F]">{new Date(bookingData.appointment_date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Preferred Time</p>
                  <p className="font-semibold text-[#1F1F1F]">{bookingData.appointment_time}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-[#6B7280] mb-1">Delivery / Collection Address</p>
                  <p className="font-semibold text-[#1F1F1F]">{bookingData.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">What Happens Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#E6F5F0] border-2 border-[#00A86B] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#00A86B]" />
                        </div>
                        {idx < steps.length - 1 && (
                          <div className="w-0.5 h-12 bg-[#E6F5F0] mt-2"></div>
                        )}
                      </div>
                      <div className="pb-4 pt-1">
                        <p className="font-semibold text-[#1F1F1F]">{step.title}</p>
                        <p className="text-sm text-[#6B7280]">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Support & Action Buttons */}
          <Card className="mb-6 rounded-2xl shadow-md bg-[#FEF3F2] border border-[#FEE4E2]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-[#E63946]" />
                <div>
                  <p className="font-semibold text-[#1F1F1F]">Need help?</p>
                  <p className="text-sm text-[#6B7280]">Call us: <span className="font-semibold">1800-AASHA-1</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/booking-tracker')}
              className="w-full sm:flex-1 h-12 bg-[#00A86B] hover:bg-[#1B7F56] text-white font-semibold rounded-xl"
            >
              Track Booking
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full sm:flex-1 h-12 border-2 border-[#00A86B] text-[#00A86B] hover:bg-[#E6F5F0] font-semibold rounded-xl"
            >
              Back to Home
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default BookingConfirmation;
