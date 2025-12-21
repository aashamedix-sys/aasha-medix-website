
import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, UserCheck, Clock } from 'lucide-react';

const WhyChooseSection = () => {
  const features = [
    {
      icon: HeartHandshake,
      title: 'Compassionate Care',
      desc: 'We treat every patient with the kindness and dignity they deserve, like our own family.',
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      icon: ShieldCheck,
      title: 'Trusted & Accurate',
      desc: '100% verified diagnostic reports checked by senior pathologists for your safety.',
      color: 'text-[#00A86B]',
      bg: 'bg-[#E6F5F0]'
    },
    {
      icon: UserCheck,
      title: 'Expert Specialists',
      desc: 'Consult with highly qualified and experienced doctors for the best medical advice.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      desc: 'Medical assistance available anytime. We\'re here for you, day or night.',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#00A86B]/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#00A86B]/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F1F1F]">
            Why Choose AASHA MEDIX?
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto italic">
            "At AASHA MEDIX, you're not just a patient — you're family."
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-premium cursor-default hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 shadow-sm`}>
                <feature.icon className="w-7 h-7" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-[#1F1F1F] mb-2.5">{feature.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center p-8 bg-[#E6F5F0] rounded-2xl border border-[#00A86B]/20"
        >
          <p className="text-[#1F1F1F] font-semibold">
            Trusted by <span className="text-[#00A86B] font-bold text-lg">5000+</span> families across India for reliable, compassionate healthcare.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
