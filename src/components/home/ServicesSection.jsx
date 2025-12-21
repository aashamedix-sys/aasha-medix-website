
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Stethoscope, Truck, ClipboardList, ArrowRight, Home, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ServicesSection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    {
      icon: Microscope,
      title: 'Diagnosis',
      description: 'Accurate lab tests, NABL-aligned diagnostics, and home sample collection.',
      color: 'emerald',
      ctaLabel: 'Book Diagnosis',
      route: '/book-tests',
      modalTitle: 'How Diagnosis Works',
      proceedLabel: 'Proceed to Book Diagnosis'
    },
    {
      icon: Stethoscope,
      title: 'Doctor',
      description: 'Consult certified doctors and specialists via video or in-person care.',
      color: 'blue',
      ctaLabel: 'Consult Doctor',
      route: '/book-doctor',
      modalTitle: 'How Doctor Consultation Works',
      proceedLabel: 'Proceed to Consult Doctor'
    },
    {
      icon: Truck,
      title: 'Delivery',
      description: 'Medicine and report delivery at your doorstep with complete care.',
      color: 'indigo',
      ctaLabel: 'Order Delivery',
      route: '/order-medicine',
      modalTitle: 'How Delivery Works',
      proceedLabel: 'Proceed to Order Delivery'
    }
  ];

  const colorMap = {
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', button: 'hover:bg-emerald-50' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', button: 'hover:bg-blue-50' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', button: 'hover:bg-indigo-50' }
  };

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleProceed = () => {
    if (selectedService) {
      navigate(selectedService.route);
      setIsModalOpen(false);
    }
  };

  const steps = [
    { icon: ClipboardList, title: 'Select your service' },
    { icon: Home, title: 'Professional care at home / online' },
    { icon: FileCheck, title: 'Reports or medicines delivered safely' }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-[#E6F5F0] border border-[#00A86B]/20 text-[#00A86B] px-4 py-2.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse"></span>
            <span className="text-sm font-bold uppercase tracking-wide">Medical Services</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F1F1F]">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Healthcare delivered with compassion. Choose from diagnostics, home collection, or expert consultations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = colorMap[service.color];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group h-full"
              >
                <Card className="h-full border border-gray-200 rounded-2xl shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className={`h-24 ${colors.bg} flex items-center justify-center border-b border-gray-200`}>
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <service.icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#1F1F1F]">{service.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-[#6B7280] leading-relaxed">
                      {service.description}
                    </CardDescription>
                    
                    <Button 
                      onClick={() => handleOpenModal(service)}
                      className="w-full h-10 bg-[#00A86B] hover:bg-[#1B7F56] text-white rounded-lg font-semibold transition-all duration-300 shadow-soft hover:shadow-medical flex items-center justify-center gap-2"
                    >
                      {service.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xl w-[95vw] max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl">
            {selectedService && (
              <div className="space-y-6">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-2xl font-bold text-[#1F1F1F]">{selectedService.modalTitle}</DialogTitle>
                  <DialogDescription className="text-[#6B7280] text-base">A simple, safe process before you proceed.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#00A86B]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F1F1F]">{step.title}</p>
                          {idx === 1 && (
                            <p className="text-xs text-[#6B7280]">Nurses, phlebotomists, or doctors based on your choice.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-[#1F1F1F] text-center">
                  NABL-aligned labs • Certified doctors • Secure & confidential reports
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Button onClick={handleProceed} className="w-full sm:w-auto h-11 px-5 bg-[#00A86B] hover:bg-[#1B7F56] text-white font-semibold rounded-xl">
                    {selectedService.proceedLabel}
                  </Button>
                  <button onClick={handleProceed} className="text-sm text-[#6B7280] underline underline-offset-4 hover:text-[#00A86B]">
                    Skip and go directly
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ServicesSection;
