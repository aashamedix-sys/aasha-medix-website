import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ClipboardCheck, MessageSquarePlus } from 'lucide-react';

const promises = [
  {
    icon: HeartHandshake,
    title: 'Compassion Before Commerce',
    description: 'We prioritize your well-being over everything else. Your health is our purpose, not our business.',
    color: 'green'
  },
  {
    icon: ClipboardCheck,
    title: 'Accuracy in Every Report',
    description: 'We are committed to the highest standards of precision, because we know your decisions depend on it.',
    color: 'red'
  },
  {
    icon: MessageSquarePlus,
    title: 'Care Beyond Consultation',
    description: 'Our support doesn’t end with a report. We are with you at every step of your health journey.',
    color: 'green'
  }
];

const OurPromiseSection = () => {
  return (
    <section className="py-20 bg-gray-50 health-pattern">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Promise to You</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These are the principles that guide every action we take.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover border-t-4 border-green-500"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${promise.color === 'green' ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} text-white shadow-lg`}>
                <promise.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{promise.title}</h3>
              <p className="text-gray-600 leading-relaxed">{promise.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPromiseSection;