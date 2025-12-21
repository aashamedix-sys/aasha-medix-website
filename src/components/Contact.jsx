import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Message Sent! 🎉",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help. Contact us for appointments, inquiries, or support.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-0 h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center space-x-2">
                  <Send className="w-6 h-6 text-green-600" />
                  <span>Send Us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name *" required />
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email *" required />
                  </div>
                  <Input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" />
                  <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message *" rows={5} required />
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-4">
                <a href="tel:+919603102104" className="flex items-center space-x-4 text-gray-600 hover:text-green-600">
                  <Phone className="w-5 h-5 text-green-600" /><span>+91 9603102104</span>
                </a>
                <a href="mailto:care@aashamedix.com" className="flex items-center space-x-4 text-gray-600 hover:text-green-600">
                  <Mail className="w-5 h-5 text-green-600" /><span>care@aashamedix.com</span>
                </a>
                <div className="flex items-start space-x-4 text-gray-600">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" /><span>3-4-67, psr centre, Suryapet, Telangana, India</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-center p-4">
                  <div>
                    <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Google Maps Placeholder</p>
                    <p className="text-sm text-gray-500">Our location will be displayed here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={() => window.open('https://wa.me/919603102104?text=Hello%20AASHA%20MEDIX', '_blank')}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;