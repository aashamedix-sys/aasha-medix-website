import React from 'react';
import { motion } from 'framer-motion';

const EmotionalQuote = () => {
  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold text-gray-700 italic leading-relaxed max-w-4xl mx-auto">
          "At AASHA MEDIX, you’re not just a patient. <br className="hidden sm:block" /> You’re <span className="text-gradient-green font-bold not-italic">family</span>."
        </h2>
      </div>
    </motion.section>
  );
};

export default EmotionalQuote;