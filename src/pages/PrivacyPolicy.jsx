
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - AASHA MEDIX</title>
        <meta name="description" content="Read AASHA MEDIX's privacy policy to understand how we collect, use, and protect your personal and health information." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy and data security are our top priorities. Learn how we protect your information.
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
                At AASHA MEDIX, we are committed to protecting your privacy and ensuring the security of your personal and health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our website, mobile applications, and healthcare services.
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Name, age, gender, and contact details (phone, email, address)</li>
                    <li>Government-issued identification (if required for specific services)</li>
                    <li>Emergency contact information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Health Information</h3>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Medical history, symptoms, and health concerns</li>
                    <li>Test results, prescriptions, and diagnostic reports</li>
                    <li>Information shared during telemedicine consultations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>IP address, browser type, and device information</li>
                    <li>Usage data, including pages visited and time spent</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Provide and improve our healthcare services</li>
                  <li>Process appointments, tests, and consultations</li>
                  <li>Deliver test reports and medical advice</li>
                  <li>Communicate with you about your health and our services</li>
                  <li>Process payments and maintain transaction records</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Conduct research and analytics to improve service quality</li>
                  <li>Send you important updates, health tips, and promotional offers (with your consent)</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. These include:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4 text-gray-600">
                <li>Encrypted data transmission using SSL/TLS protocols</li>
                <li>Secure storage with access controls and authentication</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Staff training on data privacy and confidentiality</li>
                <li>Compliance with applicable healthcare data protection regulations</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4 text-gray-600">
                <li>With healthcare providers and labs necessary for service delivery</li>
                <li>With your explicit consent for specific purposes</li>
                <li>To comply with legal obligations, court orders, or regulatory requirements</li>
                <li>To protect the rights, safety, and security of AASHA MEDIX and others</li>
                <li>In the event of a business merger, acquisition, or sale (with continued privacy protection)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <div className="space-y-3 text-gray-600">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Access and review your personal and health information</li>
                  <li>Request corrections to inaccurate or incomplete data</li>
                  <li>Request deletion of your data (subject to legal retention requirements)</li>
                  <li>Opt-out of marketing communications at any time</li>
                  <li>Withdraw consent for data processing (where applicable)</li>
                  <li>File a complaint with relevant data protection authorities</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at <a href="mailto:care@aashamedix.com" className="text-green-600 hover:underline">care@aashamedix.com</a> or call +91 8332030109.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can manage cookie preferences through your browser settings. Note that disabling cookies may affect the functionality of our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not directed to children under 18 years of age without parental or guardian consent. We do not knowingly collect personal information from children without appropriate consent. If you believe we have collected information from a child without consent, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on our website with the revised "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicyPage;
