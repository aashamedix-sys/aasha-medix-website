import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Heart, Clock, Zap, Shield } from 'lucide-react';
const WhyChoose = () => {
  const reasons = [{
    icon: CheckCircle,
    title: 'Accurate Testing',
    description: 'NABL-accredited labs and advanced technology ensure precise results you can trust.'
  }, {
    icon: Users,
    title: 'Trusted Team',
    description: 'Our experienced doctors and certified technicians are dedicated to your care.'
  }, {
    icon: Heart,
    title: 'Affordable Care',
    description: 'Transparent pricing and packages to make quality healthcare accessible to all.'
  }, {
    icon: Clock,
    title: 'Quick Reporting',
    description: 'Get your reports delivered swiftly online, so you can take action faster.'
  }, {
    icon: Shield,
    title: 'Compassionate Service',
    description: 'We treat every patient with empathy, respect, and personalized attention.'
  }, {
    icon: Zap,
    title: 'Tech-Enabled Delivery',
    description: 'From online booking to digital reports, we leverage tech for a seamless experience.'
  }];
  return <section id="why-choose" className="py-20 bg-white">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">💖 Why Choose AASHA MEDIX?
        </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Because at AASHA MEDIX, you are not just a patient — you are family. We don’t just run tests; we understand your fears, feel your pain, and walk with you toward better health. We exist for those who’ve been ignored. For the mother who can’t travel far… For the father who hides his illness to save money… For the child whose future depends on a timely diagnosis. We are here — with trust in our hearts, care in our hands, and a promise in every service.                                             “Choose AASHA MEDIX — because your health deserves more than treatment. It deserves hope.”</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <reason.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default WhyChoose;