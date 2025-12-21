import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Microscope, Video, Home, ClipboardList, LifeBuoy, Building2, Heart, Clock, Shield, Users, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ServicesPage = () => {
  const services = [
    {
      icon: Microscope,
      title: 'Diagnostic Testing',
      description: 'Accurate lab tests, fast results',
      details: 'State-of-the-art laboratory testing with NABL-accredited facilities. From basic blood tests to advanced imaging, we ensure accurate results delivered quickly.',
      features: ['Blood Tests', 'Urine Analysis', 'Imaging Services', 'Pathology', 'Biochemistry', 'Microbiology'],
      color: 'green'
    },
    {
      icon: Home,
      title: 'Home Sample Collection',
      description: 'Convenient doorstep care',
      details: 'Professional sample collection at your home with trained phlebotomists. Safe, hygienic, and convenient healthcare at your doorstep.',
      features: ['Trained Professionals', 'Hygienic Procedures', 'Flexible Timing', 'Safe Transportation', 'Real-time Tracking', 'Emergency Collection'],
      color: 'red'
    },
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'Video consultations with licensed doctors',
      details: 'Connect with qualified doctors from the comfort of your home. Get expert medical advice, prescriptions, and follow-up care online.',
      features: ['Licensed Doctors', 'Video Consultations', 'Digital Prescriptions', 'Follow-up Care', 'Specialist Referrals', '24/7 Availability'],
      color: 'green'
    },
    {
      icon: ClipboardList,
      title: 'Health Check Packages',
      description: 'Preventive care for all age groups',
      details: 'Comprehensive health checkup packages designed for different age groups and health needs. Early detection for better health outcomes.',
      features: ['Age-specific Packages', 'Comprehensive Screening', 'Preventive Care', 'Health Reports', 'Doctor Consultation', 'Follow-up Support'],
      color: 'red'
    },
    {
      icon: LifeBuoy,
      title: 'Patient Support & Follow-up',
      description: 'Continuous care even after reports',
      details: 'Dedicated patient support team to help you understand your reports, provide guidance, and ensure continuous care throughout your health journey.',
      features: ['Report Explanation', 'Health Guidance', 'Medication Reminders', 'Lifestyle Advice', 'Emergency Support', 'Care Coordination'],
      color: 'green'
    },
    {
      icon: Building2,
      title: 'Corporate Health Plans',
      description: 'Bulk testing & wellness drives for companies',
      details: 'Customized health solutions for organizations. Employee health checkups, wellness programs, and on-site health camps for better workplace health.',
      features: ['Employee Checkups', 'On-site Camps', 'Wellness Programs', 'Health Analytics', 'Custom Packages', 'Regular Monitoring'],
      color: 'red'
    }
  ];

  const faqs = [
    {
      question: "How do I book a test?",
      answer: "You can book a test easily through our website by clicking the 'Book Now' button, filling out the appointment form, or by contacting us directly via WhatsApp or phone. Our team will guide you through the process."
    },
    {
      question: "Is home sample collection safe?",
      answer: "Absolutely. Our phlebotomists are highly trained and follow strict hygiene and safety protocols, including using sterilized equipment and wearing protective gear. Your safety is our top priority."
    },
    {
      question: "Can I consult a specialist online?",
      answer: "Yes, our telemedicine service allows you to consult with a wide range of specialists from the comfort of your home. We can connect you with cardiologists, dermatologists, pediatricians, and more."
    },
    {
      question: "How and when will I receive my reports?",
      answer: "Most reports are delivered digitally to your registered email and WhatsApp number within 24-48 hours. You can also access them through our secure online portal once it's live."
    }
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/918332030109?text=Hello%20AASHA%20MEDIX,%20I%20would%20like%20to%20know%20more%20about%20your%20services', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Our Services - AASHA MEDIX | Diagnostics, Telemedicine & Home Care</title>
        <meta name="description" content="Comprehensive healthcare services including diagnostic testing, home sample collection, telemedicine consultations, and corporate health plans." />
      </Helmet>

      <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-red-50 health-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">🩺 Our Core Services</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At AASHA MEDIX, we bring healthcare to your doorstep with compassion and precision. 
              Our core services include comprehensive solutions designed for your health and convenience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      service.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <service.icon className={`w-10 h-10 ${
                        service.color === 'green' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <p className="text-gray-600 text-sm">{service.details}</p>
                    <Button asChild variant="link" className={`text-${service.color}-600`}>
                      <Link to="/contact" aria-label={`Contact us about ${service.title}`}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We have answers. Here are some common queries from our patients.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-6 h-6 text-green-600" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 leading-relaxed pl-9">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Don't wait for health issues to escalate. Take the first step towards better health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleWhatsApp}
                className="btn-cta bg-white text-green-600 hover:bg-gray-100"
              >
                Book a Service Now
              </Button>
              <Button
                variant="outline"
                className="btn-cta border-white text-white hover:bg-white hover:text-green-600"
                onClick={() => window.open('tel:+918332030109')}
              >
                Call Us Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;