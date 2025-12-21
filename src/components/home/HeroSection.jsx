import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Stethoscope, Pill, TestTube, CheckCircle, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 md:pb-24 overflow-hidden bg-gradient-to-br from-[#E6F5F0] via-white to-white">
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Text Content - Better Spacing */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#E6F5F0] border border-[#00A86B]/30 text-[#00A86B] px-4 py-2.5 rounded-full shadow-soft lg:shadow-md mx-auto lg:mx-0 ring-1 ring-[#00A86B]/20">
                <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse"></span>
                <span className="text-sm font-bold tracking-wide uppercase">{t('hero.trustedBy')}</span>
              </div>

              {/* Main Heading - Premium Typography */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1F1F1F] leading-tight tracking-tight">
                  {t('hero.heading')}
                </h1>
              </div>

              {/* Subheading - Clear & Trustworthy */}
              <p className="text-lg md:text-xl text-[#6B7280] max-w-xl mx-auto lg:mx-0 leading-relaxed flex items-center justify-center lg:justify-start gap-2">
                <span className="text-medical-primary font-semibold">{t('hero.subheadingPrimary')}</span>
                <span className="text-medical-accent font-semibold">{t('hero.subheadingSecondary')}</span>
                <span className="text-medical-primary font-semibold">{t('hero.subheadingTertiary')}</span>
              </p>

              {/* Primary Actions as Dropdown */}
              <div className="relative pt-4">
                <Button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-[#00A86B] hover:bg-[#1B7F56] text-white text-base font-bold shadow-soft transition-all duration-300">
                  <ChevronDown className="w-5 h-5" />
                  {t('hero.badge')}
                </Button>
                {open && (
                  <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20">
                    <Link to="/book-tests" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-green-50 text-[#1F1F1F]">
                      <TestTube className="w-5 h-5 text-[#00A86B]" />
                      <span className="font-medium">{t('hero.bookSample')}</span>
                    </Link>
                    <Link to="/book-doctor" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-[#1F1F1F]">
                      <Stethoscope className="w-5 h-5 text-[#E63946]" />
                      <span className="font-medium">{t('hero.consultDoctor')}</span>
                    </Link>
                    <Link to="/order-medicine" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 text-[#1F1F1F]">
                      <Pill className="w-5 h-5 text-[#3B82F6]" />
                      <span className="font-medium">{t('common.orderMeds')}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Trust Indicators - Compact Layout */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00A86B] shrink-0" />
                  <span className="text-sm font-medium text-[#1F1F1F]">NABL Accredited Labs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00A86B] shrink-0" />
                  <span className="text-sm font-medium text-[#1F1F1F]">Certified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00A86B] shrink-0" />
                  <span className="text-sm font-medium text-[#1F1F1F]">100% Safe & Hygienic</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Images - Better Layout & No Overlap */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px]">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full h-full"
            >
              {/* Doctor Image - Main Focus */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0 z-20 w-[70%] md:w-[55%] rounded-2xl overflow-hidden shadow-xl border-4 border-white hover:shadow-2xl transition-shadow duration-500">
                <img 
                  src="/assets/images/doctor-elderly-care.jpg" 
                  alt="Caring doctor with elderly patient" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Patient Image - Secondary (subtle, hidden on mobile) */}
              <div className="hidden md:block absolute bottom-0 right-0 z-10 w-[48%] rounded-2xl overflow-hidden shadow-md border-4 border-white hover:shadow-lg transition-shadow duration-500 opacity-80">
                <img 
                  src="https://horizons-cdn.hostinger.com/8e2a4de0-933a-452d-b0cc-4c06c5d99009/asha-med-mix-if6tL.png" 
                  alt="Happy Patient" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Soft Background Decoration */}
              <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-72 h-72 bg-[#00A86B]/10 rounded-full blur-3xl -z-10 opacity-25"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;