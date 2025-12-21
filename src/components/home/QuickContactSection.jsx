
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    { q: "How do I book a home blood test?", a: "You can book a test through our website by clicking 'Book Home Sample', or simply call/WhatsApp us. Our phlebotomist will visit your home at your preferred time." },
    { q: "Are your labs accredited?", a: "Yes, all our partner labs are NABL accredited and ISO certified, ensuring 100% accurate and reliable reports." },
    { q: "How fast will I get my reports?", a: "Most routine test reports are delivered via WhatsApp and Email within 6-12 hours of sample collection." },
    { q: "Do you offer doctor consultations?", a: "Yes, we have a panel of expert doctors available for both online (telemedicine) and offline consultations." },
    { q: "Is there a delivery charge for medicines?", a: "We offer free medicine delivery for orders above ₹500 within our service areas." }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4 max-w-3xl">
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-500">Got questions? We've got answers.</p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white px-6 rounded-2xl border-0 shadow-sm data-[state=open]:shadow-md transition-all">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-green-600 py-6">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 text-[15px] leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const QuickContactSection = () => {
  return (
    <>
      <FAQSection />
      <section className="py-24 bg-[#0FA958] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-8 md:p-16 shadow-2xl text-center max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Need Immediate Assistance?</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with bookings, reports, or any health-related queries.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-6 rounded-2xl bg-gray-50 hover:bg-green-50 transition-colors cursor-pointer border border-gray-100">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-[#0FA958] group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-green-600 font-semibold">+91 8332030109</p>
              </div>

              <div className="group p-6 rounded-2xl bg-gray-50 hover:bg-green-50 transition-colors cursor-pointer border border-gray-100">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-[#0FA958] group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                <p className="text-green-600 font-semibold">Chat Now</p>
              </div>

              <div className="group p-6 rounded-2xl bg-gray-50 hover:bg-green-50 transition-colors cursor-pointer border border-gray-100">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-[#0FA958] group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-green-600 font-semibold">care@aashamedix.com</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default QuickContactSection;
