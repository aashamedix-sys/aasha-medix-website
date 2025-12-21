import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target } from 'lucide-react';
const About = () => {
  return <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }}>
            <img alt="A modern and clean medical laboratory" className="w-full h-auto rounded-2xl shadow-lg" src="https://images.unsplash.com/photo-1602052577122-f73b9710adba" />
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              About AASHA MEDIX
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              AASHA MEDIX was born from a simple yet profound belief: quality healthcare is a right, not a privilege. We are on a mission to make affordable diagnostics, expert telemedicine, and convenient home sample collection services accessible to every corner of India.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We combine compassionate care with cutting-edge technology to bridge the gaps in the healthcare landscape. For us, every test and every life matters.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">🌟 Our Mission</h3>
                  <p className="text-gray-600">“Every life deserves care. Every test deserves accuracy.”



At AASHA MEDIX, our mission is to bridge the gap in healthcare by reaching people who are often left behind.
We are here to ensure that no patient is too far, no illness is ignored, and no one has to choose between care and cost.

Through compassionate service, modern technology, and affordable solutions,
we strive to bring hope, healing, and health to every corner of India.

💬 “We don’t just offer services—we offer assurance, dignity, and peace of mind.”</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">🌈 Our Vision</h3>
                  <p className="text-gray-600">“To become the heartbeat of reliable, affordable healthcare in every Indian home.”



We envision a future where:

No mother walks miles for a lab test

No elderly waits alone for a doctor

And no child suffers due to delay in diagnosis


AASHA MEDIX aims to create a world where healthcare meets humanity, where trust replaces fear, and where every family has a reliable health partner—just a tap away.

💬 “Our vision isn’t just a dream—it’s a commitment to build a healthier, more connected India.”</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default About;