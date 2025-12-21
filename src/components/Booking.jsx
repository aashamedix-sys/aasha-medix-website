import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    address: '',
    message: ''
  });
  const services = ['Diagnostics - Blood Test', 'Diagnostics - Imaging', 'Telemedicine Consultation', 'Home Sample Collection', 'Health Checkup Package', 'Specialist Consultation'];
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone || !formData.service || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Phone, Service, Date)",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('aasha_bookings') || '[]');
    const newBooking = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem('aasha_bookings', JSON.stringify(bookings));
    toast({
      title: "Appointment Booked Successfully! 🎉",
      description: "We'll contact you shortly to confirm your appointment details."
    });

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      address: '',
      message: ''
    });
  };
  const handleWhatsAppBooking = () => {
    const message = `Hello AASHA MEDIX! I would like to book an appointment.
    
Name: ${formData.name || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}
Service: ${formData.service || 'Not specified'}
Preferred Date: ${formData.date || 'Not specified'}
Preferred Time: ${formData.time || 'Not specified'}

Please confirm my appointment. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919603102104?text=${encodedMessage}`, '_blank');
  };
  return <section id="booking" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule your healthcare appointment easily and conveniently
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }}>
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <span>Appointment Details</span>
                </CardTitle>
                <CardDescription>
                  Fill in your details and we'll get back to you shortly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9603102104" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Required *
                    </label>
                    <select name="service" value={formData.service} onChange={handleInputChange} className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                      <option value="">Select a service</option>
                      {services.map((service, index) => <option key={index} value={service}>{service}</option>)}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <Input name="date" type="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <select name="time" value={formData.time} onChange={handleInputChange} className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">Select time</option>
                        {timeSlots.map((time, index) => <option key={index} value={time}>{time}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address (for home services)
                    </label>
                    <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your complete address" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Any specific requirements or questions..." rows={3} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                      Book Appointment
                    </Button>
                    <Button type="button" onClick={handleWhatsAppBooking} variant="outline" className="flex-1 border-green-500 text-green-600 hover:bg-green-50">
                      Book via WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="space-y-8">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Contact Information</CardTitle>
                <CardDescription>
                  Get in touch with us directly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 9603102104</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">care@aashamedix.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">3-4-67, psr centre, Suryapet, Telangana </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Working Hours</p>
                    <p className="text-gray-600">Mon-Sat: 6:00 AM - 9:00 PM</p>
                    <p className="text-gray-600">Emergency: 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-red-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick WhatsApp Booking</h3>
                  <p className="text-gray-600 mb-4">
                    For immediate assistance, chat with us on WhatsApp
                  </p>
                  <Button onClick={() => window.open('https://wa.me/919603102104?text=Hello%20AASHA%20MEDIX,%20I%20need%20assistance%20with%20booking', '_blank')} className="bg-green-500 hover:bg-green-600 text-white w-full">
                    Chat on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Booking;