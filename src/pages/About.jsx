import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Shield, Zap, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage = () => {
  const coreValues = [
    {
      icon: Heart,
      title: 'Compassion & Care',
      description: 'We treat every patient with empathy, understanding their fears and walking with them toward better health.',
      color: 'red'
    },
    {
      icon: Target,
      title: 'Accuracy in Testing',
      description: 'NABL-accredited labs and advanced technology ensure precise results you can trust.',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Honesty & Transparency',
      description: 'Clear pricing, honest communication, and transparent processes in everything we do.',
      color: 'red'
    },
    {
      icon: Users,
      title: 'Affordability for All',
      description: 'Quality healthcare should never be a luxury. We make it accessible to every family.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Tech-Enabled Reach',
      description: 'Leveraging technology to bring healthcare to the remotest corners of India.',
      color: 'red'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - AASHA MEDIX | Our Story & Mission</title>
        <meta name="description" content="Learn about AASHA MEDIX's inspiring journey, founded by Abdul Farooq to bridge healthcare gaps across India with compassion and innovation." />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About AASHA MEDIX</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A story of hope, compassion, and the unwavering belief that every life deserves quality healthcare.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img  
                alt="Abdul Farooq, founder of AASHA MEDIX, in a medical setting"
                className="w-full h-auto rounded-2xl shadow-lg"
               src="https://images.unsplash.com/photo-1680759290895-d8225982e197" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">Our Founder's Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                AASHA MEDIX was founded by <strong>Abdul Farooq</strong>, a visionary who witnessed firsthand the struggles 
                of families who couldn't access quality healthcare due to distance, cost, or lack of awareness.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Growing up in a small town, Abdul saw his neighbors travel hundreds of kilometers for basic medical tests, 
                often delaying critical diagnoses. He dreamed of a world where healthcare would come to people, 
                not the other way around.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, AASHA MEDIX stands as a testament to that dream—bringing world-class diagnostics, 
                telemedicine, and compassionate care directly to your doorstep.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🌟 Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    "Every life deserves care. Every test deserves accuracy."
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    At AASHA MEDIX, our mission is to bridge the gap in healthcare by reaching people who are often left behind. 
                    We are here to ensure that no patient is too far, no illness is ignored, and no one has to choose between care and cost.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    Through compassionate service, modern technology, and affordable solutions, we strive to bring hope, 
                    healing, and health to every corner of India.
                  </p>
                  <p className="text-green-700 font-semibold mt-4 italic">
                    "We don't just offer services—we offer assurance, dignity, and peace of mind."
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🌈 Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    "To become the heartbeat of reliable, affordable healthcare in every Indian home."
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    We envision a future where:
                  </p>
                  <ul className="text-gray-600 mt-4 space-y-2">
                    <li>• No mother walks miles for a lab test</li>
                    <li>• No elderly waits alone for a doctor</li>
                    <li>• And no child suffers due to delay in diagnosis</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    AASHA MEDIX aims to create a world where healthcare meets humanity, where trust replaces fear, 
                    and where every family has a reliable health partner—just a tap away.
                  </p>
                  <p className="text-red-700 font-semibold mt-4 italic">
                    "Our vision isn't just a dream—it's a commitment to build a healthier, more connected India."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at AASHA MEDIX.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      value.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <value.icon className={`w-10 h-10 ${
                        value.color === 'green' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every number represents a life touched, a family helped, a community served.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Tests Conducted' },
              { number: '5,000+', label: 'Families Served' },
              { number: '50+', label: 'Cities Covered' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Together, we can build a healthier India where quality healthcare is accessible to all. 
              Every test you book, every consultation you take, brings us closer to this dream.
            </p>
            <p className="text-2xl font-semibold">
              "Because at AASHA MEDIX, your health is our hope."
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;