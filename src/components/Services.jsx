import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Video, Home, ClipboardList, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
const Services = () => {
  const services = [{
    icon: Microscope,
    title: 'Diagnostic Tests',
    description: 'State-of-the-art lab testing for accurate and reliable results.',
    color: 'green'
  }, {
    icon: Video,
    title: 'Telemedicine',
    description: 'Consult with expert doctors from the comfort of your home.',
    color: 'red'
  }, {
    icon: Home,
    title: 'Home Sample Collection',
    description: 'Safe and convenient sample collection at your doorstep.',
    color: 'green'
  }, {
    icon: ClipboardList,
    title: 'Health Checkups',
    description: 'Comprehensive packages to proactively manage your health.',
    color: 'red'
  }, {
    icon: LifeBuoy,
    title: 'Patient Support',
    description: 'Dedicated support to guide you through your healthcare journey.',
    color: 'green'
  }];
  const handleLearnMore = serviceTitle => {
    toast({
      title: `More about ${serviceTitle}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };
  return <section id="services" className="py-20 bg-gray-50">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">🩺 Our Core Services
        </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">At AASHA MEDIX, we bring healthcare to your doorstep with compassion and precision.
Our core services include:

✅ Diagnostic Testing – Accurate and affordable lab tests you can trust

🏠 Home Sample Collection – Convenient testing from the comfort of your home

📞 Telemedicine – Instant access to qualified doctors via video or phone

💊 Health Packages – Customized full-body checkups for every stage of life

🤝 Patient Support & Follow-up – Because care doesn’t end at diagnosis


&gt; “From test to treatment, we walk every step with you.”</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {services.map((service, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }}>
              <Card className="h-full text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${service.color === 'green' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <service.icon className={`w-10 h-10 ${service.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6">
                    {service.description}
                  </CardDescription>
                  <Button onClick={() => handleLearnMore(service.title)} variant="outline" className={`border-${service.color}-500 text-${service.color}-600 hover:bg-${service.color}-50`}>Learn More</Button>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default Services;