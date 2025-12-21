
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar, DollarSign, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const RefundPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Refund & Reschedule Policy - AASHA MEDIX</title>
        <meta name="description" content="Learn about AASHA MEDIX's refund and rescheduling policy for appointments, tests, and healthcare services." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <RefreshCw className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Refund & Reschedule Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand that plans change. Here's our policy on refunds and rescheduling.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last Updated: December 9, 2025</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Rescheduling Policy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We understand that circumstances may require you to change your appointment. Here's how our rescheduling policy works:
              </p>
              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Free Rescheduling (Before 6 Hours)</h3>
                      <p className="text-gray-600">
                        You can reschedule your appointment free of charge if you notify us at least 6 hours before the scheduled time. Simply contact us via phone or WhatsApp to choose a new date and time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Late Rescheduling (Within 6 Hours)</h3>
                      <p className="text-gray-600">
                        If you request to reschedule within 6 hours of your appointment, a rescheduling fee of ₹100 may apply. This helps cover operational costs for the scheduled resources.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">No-Show Policy</h3>
                      <p className="text-gray-600">
                        If you miss your appointment without prior notification, the full service fee will be forfeited and no refund will be provided. We encourage you to inform us as early as possible if you cannot make it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Refund Policy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our refund policy is designed to be fair and transparent. Here are the conditions under which refunds are provided:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Cancellation Before 24 Hours</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you cancel your appointment at least 24 hours before the scheduled time, you are eligible for a <strong>full refund (100%)</strong> of the service fee. The refund will be processed within 5-7 business days to your original payment method.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Cancellation Within 24 Hours</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you cancel your appointment within 24 hours but before 6 hours of the scheduled time, you are eligible for a <strong>50% refund</strong> of the service fee. This helps cover partial operational costs.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Cancellation Within 6 Hours or No-Show</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you cancel within 6 hours of your appointment or fail to show up without prior notice, <strong>no refund</strong> will be provided. The full service fee will be retained.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4. Service Not Delivered by AASHA MEDIX</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If we are unable to deliver the service due to reasons on our end (e.g., staff unavailability, technical issues), you will receive a <strong>full refund (100%)</strong> or the option to reschedule at no additional cost.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">5. Defective or Incorrect Service</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you receive incorrect test results or defective services due to our error, we will provide a <strong>free retest or full refund</strong>, whichever you prefer. Please contact us within 48 hours of receiving your report.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Processing Time</h2>
              <div className="space-y-3 text-gray-600">
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Online Payments (UPI, Cards, Net Banking):</strong> Refunds will be processed within 5-7 business days to your original payment method.</li>
                  <li><strong>Cash Payments:</strong> For cash payments made at the time of service, refunds will be processed via bank transfer within 7-10 business days. You will need to provide your bank account details.</li>
                  <li><strong>Wallet/Digital Payments:</strong> Refunds to digital wallets will be processed within 3-5 business days.</li>
                </ul>
                <p className="mt-4">
                  Please note that actual credit to your account may take additional time depending on your bank or payment provider.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Refund or Reschedule</h2>
              <div className="space-y-3 text-gray-600">
                <p>To request a refund or reschedule your appointment:</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>Contact us via phone at <a href="tel:+918332030109" className="text-green-600 hover:underline">+91 8332030109</a></li>
                  <li>Send us a WhatsApp message with your booking details</li>
                  <li>Email us at <a href="mailto:care@aashamedix.com" className="text-green-600 hover:underline">care@aashamedix.com</a> with your appointment ID</li>
                </ol>
                <p className="mt-4">
                  Please provide your full name, contact number, appointment ID, and reason for cancellation or rescheduling. Our team will process your request and confirm via email or SMS.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Refundable Services</h2>
              <div className="space-y-3 text-gray-600">
                <p>The following services are non-refundable under any circumstances:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Emergency services and smart ambulance services (once dispatched)</li>
                  <li>Telemedicine consultations (once the consultation has started)</li>
                  <li>Completed diagnostic tests and delivered reports</li>
                  <li>E-pharmacy orders (once delivered)</li>
                  <li>Corporate health packages (unless otherwise agreed in contract)</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Circumstances</h2>
              <p className="text-gray-600 leading-relaxed">
                We understand that emergencies and unforeseen circumstances happen. If you believe your situation warrants an exception to this policy, please contact our customer care team. We will review your case on an individual basis and may offer flexible solutions at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For any questions or concerns regarding refunds and rescheduling, please contact us:
              </p>
              <div className="bg-green-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p><strong>AASHA MEDIX Customer Care</strong></p>
                <p>Phone: <a href="tel:+918332030109" className="text-green-600 hover:underline">+91 8332030109</a></p>
                <p>WhatsApp: <a href="https://wa.me/918332030109" className="text-green-600 hover:underline">+91 8332030109</a></p>
                <p>Email: <a href="mailto:care@aashamedix.com" className="text-green-600 hover:underline">care@aashamedix.com</a></p>
                <p>Working Hours: Mon-Sat, 9:00 AM - 6:30 PM</p>
                <p>Emergency Support: 24/7 via WhatsApp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicyPage;
