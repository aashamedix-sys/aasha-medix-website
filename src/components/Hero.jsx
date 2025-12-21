import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/919603102104?text=Hello%20AASHA%20MEDIX,%20I%20would%20like%20to%20book%20an%20appointment', '_blank');
  };

  const handleServicesClick = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-red-50 medical-pattern"></div>
      
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-100 rounded-full opacity-60 floating"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-red-100 rounded-full opacity-60 floating" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-200 rounded-full opacity-60 floating" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-4"
            >
              Compassionate Care,
              <span className="block text-green-600">Accessible to All.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              <span className="font-semibold text-green-700">Bridging Gaps, Building Healthier Lives.</span>
              <br />
              Trusted diagnostics, online doctor consultations, and home care solutions across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={handleWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg pulse-green"
                size="lg"
              >
                Book Now on WhatsApp
              </Button>
              <Button
                onClick={handleServicesClick}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
                size="lg"
              >
                Our Services
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 p-4">
              <img 
                alt="A compassionate doctor consulting with a patient"
                className="w-full h-auto rounded-2xl shadow-2xl"
               src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3" />
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-red-500 rounded-full opacity-20"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;