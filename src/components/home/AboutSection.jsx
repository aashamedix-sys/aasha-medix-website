import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
const AboutSection = () => {
  return <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img alt="Professional Indian doctors team in discussion" className="w-full h-auto object-cover" src="https://horizons-cdn.hostinger.com/8e2a4de0-933a-452d-b0cc-4c06c5d99009/asha-med-mix-TFn8V.jpg" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-green-500 hidden md:block">
              <p className="text-4xl font-bold text-gray-900 mb-1">5000+</p>
              <p className="text-gray-500 font-medium">Families Trusted</p>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="space-y-8">
            <div>
               <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Our Story</span>
               <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-6">Born from Compassion,<br />Driven by Care.</h2>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              "AASHA MEDIX was born from a quiet yet powerful truth — no one should be left behind in their time of need."
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded by <strong>Abdul Farooq</strong>, we are building a healthcare ecosystem in Telangana where affordable diagnostics and expert care are just a call away.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                Accessible Healthcare for Rural & Urban Areas
              </div>
              <div className="flex items-center text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                Transparent Pricing & Accurate Reports
              </div>
              <div className="flex items-center text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                Empathy-Driven Patient Support
              </div>
            </div>

            <Link to="/about">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12 text-base">
                Read Our Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default AboutSection;