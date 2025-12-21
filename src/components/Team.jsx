import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Dr. Anjali Sharma',
    role: 'Chief Medical Officer',
    bio: 'With over 20 years of experience in internal medicine, Dr. Sharma leads our medical team with a focus on patient-centric care and clinical excellence.',
    image: 'A portrait of Dr. Anjali Sharma, a smiling woman in a white coat.',
  },
  {
    name: 'Mr. Rohan Verma',
    role: 'Head of Diagnostics',
    bio: 'Rohan is a certified lab technologist with a passion for accuracy and innovation. He ensures our labs meet the highest standards of quality.',
    image: 'A portrait of Mr. Rohan Verma, a man in lab gear looking at a microscope.',
  },
  {
    name: 'Ms. Priya Singh',
    role: 'Lead Telemedicine Coordinator',
    bio: 'Priya ensures a seamless and compassionate virtual care experience for all our patients, connecting them with the right specialists.',
    image: 'A portrait of Ms. Priya Singh, a friendly woman with a headset on.',
  },
];

const Team = () => {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our team of dedicated professionals is the heart of AASHA MEDIX, committed to your health and well-being.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="bg-gray-100 h-56 flex items-center justify-center">
                    <img  alt={member.image} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-gray-900">{member.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium mb-4">{member.role}</CardDescription>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-4">
                    <button className="text-gray-400 hover:text-green-600"><Linkedin size={20} /></button>
                    <button className="text-gray-400 hover:text-green-600"><Twitter size={20} /></button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;