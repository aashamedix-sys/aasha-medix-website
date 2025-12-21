
import React from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, Phone, Mail, Clock } from 'lucide-react';
import BookingForm from '@/components/BookingForm';

const BookingPage = () => {
  return (
    <>
      <Helmet>
        <title>Book Appointment - AASHA MEDIX</title>
        <meta name="description" content="Book diagnostic tests, doctor consultations, or home collection online. Fast, easy, and reliable." />
      </Helmet>

      <section className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="container mx-auto px-4">
          
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-700">Medical Disclaimer</h3>
                <p className="text-red-600 text-sm mt-1">
                  This platform is <strong>not for critical medical emergencies</strong>. If you or someone you know is experiencing a life-threatening emergency (chest pain, difficulty breathing, major injury), please call <strong>108</strong> or go to the nearest hospital immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            
            {/* Main Booking Area */}
            <div className="lg:col-span-2">
               <div className="text-center md:text-left mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">Schedule Your Appointment</h1>
                  <p className="text-gray-600">Book diagnostic tests, home collections, or tele-consults in 4 easy steps.</p>
               </div>
               <BookingForm />
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-6 text-lg border-b pb-2">Why Book with AASHA?</h3>
                
                <ul className="space-y-4 mb-8">
                   <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">1</div>
                      <p className="text-sm text-gray-600"><strong>Instant Confirmation</strong> via SMS & Email</p>
                   </li>
                   <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">2</div>
                      <p className="text-sm text-gray-600"><strong>Transparent Pricing</strong> - No hidden fees</p>
                   </li>
                   <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">3</div>
                      <p className="text-sm text-gray-600"><strong>Secure Records</strong> - Access reports anytime</p>
                   </li>
                </ul>

                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider text-gray-500">Need Assistance?</h3>
                <div className="space-y-3">
                  <a href="tel:+918332030109" className="flex items-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group">
                    <Phone className="w-5 h-5 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">HELPLINE</p>
                      <p className="font-bold text-gray-900">+91 8332030109</p>
                    </div>
                  </a>
                  <div className="flex items-center p-3 rounded-lg bg-blue-50">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                     <div>
                      <p className="text-xs text-gray-500 font-semibold">HOURS</p>
                      <p className="font-bold text-gray-900">Mon-Sat: 7AM - 9PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default BookingPage;
