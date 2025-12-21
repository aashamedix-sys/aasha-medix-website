
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ArrowRight, HelpCircle, Activity, Home, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceDetailsModal = ({ isOpen, onClose, service }) => {
  const navigate = useNavigate();

  if (!service) return null;

  const getIcon = (name) => {
    if (name.includes('Diagnostic')) return <Activity className="w-8 h-8 text-green-600" />;
    if (name.includes('Home')) return <Home className="w-8 h-8 text-blue-600" />;
    if (name.includes('Telemedicine')) return <Video className="w-8 h-8 text-purple-600" />;
    return <Activity className="w-8 h-8" />;
  };

  const handleBookNow = () => {
    onClose();
    if (service.title.includes('Diagnostic') || service.title.includes('Home')) {
      navigate('/book-tests');
    } else if (service.title.includes('Telemedicine')) {
      navigate('/book-doctor');
    } else {
      navigate('/contact');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white rounded-xl shadow-2xl border-0">
        <div className="p-6 pb-4 border-b sticky top-0 bg-white z-10 flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-full border border-gray-100">
            {getIcon(service.title)}
          </div>
          <div className="flex-1">
            <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">{service.title}</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">{service.description}</DialogDescription>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Detailed Description */}
          <section>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">Overview</h4>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {service.details || service.description}
            </p>
          </section>

          {/* Key Features & Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <section>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Key Features
              </h4>
              <ul className="space-y-2">
                {service.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
            
            <section>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Benefits
              </h4>
              <ul className="space-y-2">
                {service.benefits?.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Process Steps */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">How It Works</h4>
            <div className="space-y-4">
              {service.process?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium text-gray-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Accordion */}
          {service.faqs && service.faqs.length > 0 && (
            <section>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" /> Frequently Asked Questions
              </h4>
              <Accordion type="single" collapsible className="w-full">
                {service.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b-gray-100">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-green-600 text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 sticky bottom-0 flex justify-end gap-3 rounded-b-xl">
          <Button variant="outline" onClick={onClose} className="h-11">Close</Button>
          <Button onClick={handleBookNow} className="h-11 bg-green-600 hover:bg-green-700 px-8 shadow-lg shadow-green-200">
            Book Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;
