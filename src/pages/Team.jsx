import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Dr. Anjali Sharma',
    role: 'Chief Medical Officer',
    quote: '“Our mission is to blend clinical excellence with heartfelt compassion, ensuring every patient feels seen, heard, and cared for.”',
    imageAlt: 'Professional headshot of a smiling female Indian doctor in her 40s, with a white coat and stethoscope, against a soft clinic background.',
    imageDesc: 'Dr. Anjali Sharma, Chief Medical Officer'
  },
  {
    name: 'Mr. Rohan Verma',
    role: 'Head of Diagnostics',
    quote: '“Precision is the foundation of trust. We are committed to delivering accurate, reliable results that empower better health decisions.”',
    imageAlt: 'Professional headshot of a male Indian lab technician in his 30s, wearing safety glasses and a lab coat, standing in a modern laboratory.',
    imageDesc: 'Mr. Rohan Verma, Head of Diagnostics'
  },
  {
    name: 'Ms. Priya Singh',
    role: 'Lead Telemedicine Coordinator',
    quote: '“We bridge the distance to bring expert care to your home. Every call is a chance to provide comfort and clear guidance.”',
    imageAlt: 'Professional headshot of a friendly female Indian customer support representative in her late 20s, wearing a headset and smiling, in a bright office environment.',
    imageDesc: 'Ms. Priya Singh, Lead Telemedicine Coordinator'
  },
];

const TeamPage = () => {
  return (
    <>
      <Helmet>
        <title>Meet Our Team - AASHA MEDIX</title>
        <meta name="description" content="Meet the dedicated team of doctors and healthcare professionals at AASHA MEDIX, committed to your well-being." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-red-50 health-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Meet Our Team</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The compassionate hearts and brilliant minds behind AASHA MEDIX, dedicated to your health and well-being.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-transparent card-hover">
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img  alt={member.imageAlt} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">{member.name}</CardTitle>
                    <CardDescription className="text-green-600 font-semibold text-base">{member.role}</CardDescription>
                    <p className="text-gray-600 italic text-center text-sm leading-relaxed">"{member.quote}"</p>
                    <div className="flex justify-center space-x-4 pt-2">
                      <button className="text-gray-400 hover:text-green-600 transition-colors"><Linkedin size={20} /></button>
                      <button className="text-gray-400 hover:text-green-600 transition-colors"><Twitter size={20} /></button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPage;