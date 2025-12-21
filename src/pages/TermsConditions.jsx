
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, Scale, UserCheck } from 'lucide-react';

const TermsConditionsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - AASHA MEDIX</title>
        <meta name="description" content="Read the terms and conditions for using AASHA MEDIX healthcare services, website, and mobile applications." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Scale className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using AASHA MEDIX services.
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
                <FileText className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Welcome to AASHA MEDIX. These Terms and Conditions ("Terms") govern your use of our healthcare services, website, mobile applications, and all related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                By registering for an account, booking a service, or using any part of our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy. These Terms constitute a legally binding agreement between you and AASHA MEDIX.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Eligibility</h2>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>To use our Services, you must:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Be at least 18 years of age, or have parental/guardian consent if you are a minor</li>
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Be responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Provided</h2>
              <div className="space-y-3 text-gray-600">
                <p>AASHA MEDIX offers the following services:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Diagnostic testing and laboratory services</li>
                  <li>Home sample collection</li>
                  <li>Telemedicine consultations with licensed healthcare professionals</li>
                  <li>Smart ambulance services for medical emergencies</li>
                  <li>E-pharmacy services for medication delivery</li>
                  <li>Corporate health and wellness programs</li>
                  <li>Health checkup packages and preventive care</li>
                </ul>
                <p className="mt-4">
                  All services are subject to availability and may vary by location. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking and Appointments</h2>
              <div className="space-y-3 text-gray-600">
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>All bookings are subject to availability and confirmation from AASHA MEDIX</li>
                  <li>You must provide accurate information when booking services</li>
                  <li>Appointment times are approximate and may vary due to unforeseen circumstances</li>
                  <li>You are responsible for ensuring you are available at the scheduled time</li>
                  <li>We reserve the right to refuse service if safety or legal concerns arise</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments and Pricing</h2>
              <div className="space-y-3 text-gray-600">
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>All prices are listed in Indian Rupees (INR) and are subject to change without notice</li>
                  <li>Payment must be made at the time of booking or service delivery, as specified</li>
                  <li>We accept multiple payment methods including cash, UPI, cards, and digital wallets</li>
                  <li>All payments are non-refundable unless otherwise stated in our Refund & Reschedule Policy</li>
                  <li>Additional charges may apply for certain services, locations, or urgent requests</li>
                  <li>You are responsible for any applicable taxes, transaction fees, or bank charges</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Medical Disclaimer</h2>
              </div>
              <div className="space-y-3 text-gray-600">
                <p className="font-semibold text-red-600">Important: Please Read Carefully</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Our Services are not a substitute for professional medical advice, diagnosis, or treatment</li>
                  <li>Always seek the advice of a qualified healthcare provider for any medical concerns</li>
                  <li>Never disregard professional medical advice or delay seeking it because of information obtained through our Services</li>
                  <li>In case of a medical emergency, call emergency services immediately (dial 108 or 112 in India)</li>
                  <li>Test results and medical advice provided through our platform are for informational purposes and should be discussed with your primary healthcare provider</li>
                  <li>We are not liable for any adverse outcomes resulting from the use or misuse of information provided through our Services</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <div className="space-y-3 text-gray-600">
                <p>You agree to:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Provide accurate and truthful information about your health and medical history</li>
                  <li>Follow all instructions provided by healthcare professionals</li>
                  <li>Use our Services in a lawful and ethical manner</li>
                  <li>Not misuse, abuse, or attempt to gain unauthorized access to our systems</li>
                  <li>Not share, sell, or distribute content obtained through our Services</li>
                  <li>Respect the privacy and confidentiality of other users</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content on our website and applications, including text, graphics, logos, images, software, and designs, are the property of AASHA MEDIX or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="space-y-3 text-gray-600">
                <p>To the fullest extent permitted by law:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>AASHA MEDIX shall not be liable for any indirect, incidental, special, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount you paid for the specific service in question</li>
                  <li>We are not responsible for delays or failures due to circumstances beyond our control (force majeure)</li>
                  <li>We do not guarantee uninterrupted or error-free service</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to indemnify, defend, and hold harmless AASHA MEDIX, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising from your use of our Services, violation of these Terms, or infringement of any third-party rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to suspend or terminate your access to our Services at any time, with or without cause or notice, if we believe you have violated these Terms or engaged in unlawful or harmful conduct. Upon termination, all provisions that should reasonably survive termination will continue to apply.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or the use of our Services shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update these Terms from time to time to reflect changes in our practices, services, or legal requirements. The updated Terms will be posted on our website with a revised "Last Updated" date. Your continued use of our Services after any changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions or concerns about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-green-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p><strong>AASHA MEDIX</strong></p>
                <p>Email: <a href="mailto:care@aashamedix.com" className="text-green-600 hover:underline">care@aashamedix.com</a></p>
                <p>Phone: <a href="tel:+918332030109" className="text-green-600 hover:underline">+91 8332030109</a></p>
                <p>Address: Suryapet & Hyderabad, Telangana, India</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TermsConditionsPage;
