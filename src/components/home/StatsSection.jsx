
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, ShieldCheck, Stethoscope, TestTube } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { num: "5000+", label: "Happy Patients", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { num: "24/7", label: "Medical Support", icon: Clock, color: "text-[#00A86B]", bg: "bg-[#E6F5F0]" },
    { num: "100%", label: "Trusted Reports", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { num: "50+", label: "Expert Doctors", icon: Stethoscope, color: "text-red-600", bg: "bg-red-50" },
    { num: "280+", label: "Lab Tests", icon: TestTube, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="py-16 bg-white relative z-20 -mt-8 container mx-auto px-4 lg:px-8 max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx }}
            className="card-premium flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* Icon Container */}
            <div className={`w-14 h-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-7 h-7" />
            </div>
            
            {/* Stats Content */}
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F] mb-1.5">
              {stat.num}
            </h3>
            <p className="text-sm font-semibold text-[#6B7280]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
