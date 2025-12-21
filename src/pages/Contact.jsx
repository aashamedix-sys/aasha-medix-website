
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    toast({
      title: "Message Sent Successfully!",
      description: "We will get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact AASHA MEDIX | Suryapet & Telangana</title>
        <meta name="description" content="Get in touch with AASHA MEDIX for appointments and healthcare support." />
      </Helmet>

      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We are here to help. Reach out to us for appointments, inquiries, or feedback.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Info Cards */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              
              <Card className="border-0 shadow-lg bg-emerald-50">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600"><Phone className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phone Support</h3>
                    <p className="text-gray-600 text-sm mb-2">24/7 Available</p>
                    <a href="tel:+918332030109" className="text-lg font-bold text-emerald-700 hover:underline">+91 8332030109</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-blue-50">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Mail className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email Us</h3>
                    <p className="text-gray-600 text-sm mb-2">For general inquiries</p>
                    <a href="mailto:care@aashamedix.com" className="text-lg font-bold text-blue-700 hover:underline">care@aashamedix.com</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-purple-50">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full text-purple-600"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900">Locations</h3>
                    <p className="text-gray-600 text-sm">Suryapet, Nereducharla, Kodad, Hyderabad</p>
                    <p className="text-gray-600 text-sm">Telangana, India</p>
                  </div>
                </CardContent>
              </Card>

            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Full Name" className="h-12" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                        <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Your Mobile Number" className="h-12" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="h-12" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                      <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="How can we help you?" rows={5} className="resize-none" />
                    </div>
                    <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg rounded-full">
                      Send Message <Send className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
