
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HelpCircle, Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const faqCategories = [
    {
      category: 'General',
      faqs: [
        {
          question: "What is AASHA MEDIX?",
          answer: "AASHA MEDIX is a comprehensive healthcare service provider offering diagnostic testing, telemedicine consultations, home sample collection, smart ambulance services, e-pharmacy, and corporate health solutions. We bring quality healthcare to your doorstep with compassion and reliability."
        },
        {
          question: "Where do you provide your services?",
          answer: "We currently serve Suryapet, Hyderabad, and surrounding areas in Telangana. We are rapidly expanding our services to cover more cities across India. Contact us to check if we serve your area."
        },
        {
          question: "How can I contact AASHA MEDIX?",
          answer: "You can reach us via phone at +91 8332030109, email at care@aashamedix.com, or WhatsApp for instant support. Our customer care team is available 24/7 to assist you."
        }
      ]
    },
    {
      category: 'Booking & Appointments',
      faqs: [
        {
          question: "How do I book a test or consultation?",
          answer: "You can book through our website by clicking 'Book Now', calling us directly at +91 8332030109, or messaging us on WhatsApp. Our team will guide you through the process and confirm your appointment."
        },
        {
          question: "Can I reschedule my appointment?",
          answer: "Yes, you can reschedule your appointment up to 6 hours before the scheduled time without any charges. Please contact us via phone or WhatsApp to reschedule."
        },
        {
          question: "What are your working hours?",
          answer: "Our regular working hours are Monday to Saturday, 9:00 AM to 6:30 PM. However, our emergency services and WhatsApp support are available 24/7 for urgent needs."
        }
      ]
    },
    {
      category: 'Home Sample Collection',
      faqs: [
        {
          question: "Is home sample collection safe and hygienic?",
          answer: "Absolutely. Our trained phlebotomists follow strict hygiene protocols, use sterile equipment, wear protective gear, and maintain the highest standards of safety during sample collection at your home."
        },
        {
          question: "Do you charge extra for home collection?",
          answer: "Home collection charges vary based on your location and the type of test. Many of our health packages include free home collection. Please check with our team for specific pricing."
        },
        {
          question: "What should I do to prepare for sample collection?",
          answer: "Preparation depends on the specific test. For most blood tests, fasting for 8-12 hours is required. Our team will provide detailed instructions when you book your appointment."
        }
      ]
    },
    {
      category: 'Reports & Results',
      faqs: [
        {
          question: "How long does it take to get my test reports?",
          answer: "Most routine test reports are delivered within 24-48 hours digitally. Complex tests may take 3-5 days. You'll receive your reports via email, WhatsApp, and through our online portal."
        },
        {
          question: "How will I receive my reports?",
          answer: "Reports are delivered digitally to your registered email and WhatsApp number. You can also download them from our secure online portal once it's live. Hard copies can be arranged upon request."
        },
        {
          question: "Can I get my reports explained by a doctor?",
          answer: "Yes, absolutely. We offer complimentary report explanation sessions with our doctors for all our tests. You can also book a detailed consultation if you need more comprehensive guidance."
        }
      ]
    },
    {
      category: 'Payments & Pricing',
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash, UPI, credit/debit cards, net banking, and digital wallets. Payment can be made online during booking or to our collection executive at the time of sample collection."
        },
        {
          question: "Do you offer any discounts or health packages?",
          answer: "Yes, we offer various health checkup packages at discounted rates for individuals, families, and senior citizens. We also have special corporate packages for organizations. Check our Services page for current offers."
        },
        {
          question: "Is there a cancellation or refund policy?",
          answer: "Yes, you can cancel your appointment up to 24 hours before the scheduled time for a full refund. For cancellations within 24 hours, a 50% refund is applicable. Please refer to our Refund & Reschedule Policy page for complete details."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const handleWhatsApp = () => {
    window.open('https://wa.me/918332030109?text=Hello%20AASHA%20MEDIX,%20I%20have%20a%20question', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - AASHA MEDIX</title>
        <meta name="description" content="Find answers to common questions about AASHA MEDIX services, booking, reports, payments, and more." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">❓ Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We have answers. Browse our FAQ section or contact us directly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem 
                        value={`item-${categoryIndex}-${index}`} 
                        key={index}
                        className="bg-white rounded-lg shadow-md border-0 px-6"
                      >
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                          <div className="flex items-center space-x-3 text-left">
                            <HelpCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600 leading-relaxed pl-9 pb-6">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No FAQs found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Still Have Questions?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our team is here to help. Contact us directly for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg rounded-full"
                size="lg"
              >
                Chat on WhatsApp
              </Button>
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 text-lg rounded-full"
                size="lg"
                onClick={() => window.open('tel:+918332030109')}
              >
                Call +91 8332030109
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
