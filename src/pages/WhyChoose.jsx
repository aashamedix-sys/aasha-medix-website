import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Users, Home, DollarSign, Zap, Clock, Shield, Award, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WhyChoosePage = () => {
  const reasons = [
    {
      icon: Users,
      title: 'Trusted Health Experts',
      description: 'Our team of qualified doctors, certified lab technicians, and trained healthcare professionals are dedicated to providing you with the highest standard of care.',
      details: 'NABL-accredited labs, licensed physicians, and continuous training ensure that you receive expert care at every step.'
    },
    {
      icon: Home,
      title: 'Doorstep Service',
      description: 'No more long queues or travel hassles. We bring healthcare directly to your home with professional sample collection and telemedicine consultations.',
      details: 'Trained phlebotomists, hygienic procedures, and flexible timing make healthcare convenient for you and your family.'
    },
    {
      icon: DollarSign,
      title: 'Affordable Pricing',
      description: 'Quality healthcare shouldn\'t break the bank. Our transparent pricing and affordable packages make health testing accessible to everyone.',
      details: 'No hidden charges, flexible payment options, and special packages for families and seniors.'
    },
    {
      icon: Clock,
      title: 'Fast Reports',
      description: 'Get your test results quickly without compromising accuracy. Most reports are delivered within 24-48 hours digitally.',
      details: 'Digital delivery, SMS alerts, and detailed explanations help you understand your health status promptly.'
    },
    {
      icon: Zap,
      title: 'Tech + Human Touch',
      description: 'We combine cutting-edge technology with compassionate human care to provide a seamless healthcare experience.',
      details: 'Advanced lab equipment, digital platforms, and personal care coordinators ensure the best of both worlds.'
    },
    {
      icon: Phone,
      title: '24/7 Support via WhatsApp',
      description: 'Our dedicated support team is available round the clock on WhatsApp to assist you with any queries or emergencies.',
      details: 'Instant responses, emergency support, and continuous care coordination through our WhatsApp helpline.'
    }
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/918332030109?text=Hello%20AASHA%20MEDIX,%20I%20would%20like%20to%20know%20more%20about%20your%20services', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Why Choose AASHA MEDIX | Trusted Healthcare Partner</title>
        <meta name="description" content="Discover why thousands of families trust AASHA MEDIX for their healthcare needs. Affordable, accessible, and compassionate care for all." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">💖 Why Choose AASHA MEDIX?</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Because at AASHA MEDIX, you are not just a patient — you are family. We don't just run tests; 
              we understand your fears, feel your pain, and walk with you toward better health.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img  
                alt="A caring healthcare professional comforting a patient"
                className="w-full h-auto rounded-2xl shadow-lg"
               src="https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">We Exist for Those Who've Been Ignored</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>For the mother who can't travel far...</p>
                <p>For the father who hides his illness to save money...</p>
                <p>For the child whose future depends on a timely diagnosis...</p>
              </div>
              <p className="text-lg text-gray-600">
                We are here — with trust in our hearts, care in our hands, and a promise in every service.
              </p>
              <p className="text-xl text-green-700 font-semibold italic">
                "Choose AASHA MEDIX — because your health deserves more than treatment. It deserves hope."
              </p>
            </motion.div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">6 Reasons to Trust Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here's how we ensure you get the best care, every time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <reason.icon className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-600">
                      {reason.description}
                    </CardDescription>
                    <p className="text-sm text-gray-500 border-l-4 border-green-200 pl-4">
                      {reason.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              It's not just what we do, but how we do it that sets us apart.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Emotional Connection</h3>
                  <p className="text-gray-600">We don't just treat symptoms; we understand the person behind them. Every patient's story matters to us.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Transparency</h3>
                  <p className="text-gray-600">No hidden costs, no false promises. We believe in honest communication and transparent pricing.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Innovation</h3>
                  <p className="text-gray-600">We constantly evolve our services based on patient feedback and latest healthcare innovations.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img  
                alt="Happy family receiving healthcare services at home"
                className="w-full h-auto rounded-2xl shadow-lg"
               src="https://images.unsplash.com/photo-1680778470701-b64ce61294ca" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Join Thousands of Satisfied Families</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Don't just take our word for it. Experience the AASHA MEDIX difference yourself. 
              Your health journey starts with a single step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleWhatsApp}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-full"
                size="lg"
              >
                Start Your Health Journey
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg rounded-full"
                size="lg"
                onClick={() => window.open('tel:+918332030109')}
              >
                Call Us Now
              </Button>
            </div>
            <p className="text-lg text-green-100 mt-6">
              Available 24/7 • No appointment needed • Instant WhatsApp support
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default WhyChoosePage;