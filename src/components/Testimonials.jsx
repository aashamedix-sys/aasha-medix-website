import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Venkat Reddy',
    location: 'Suryapet, Telangana',
    review: 'The home sample collection was so convenient and professional. I got my reports online within a day. AASHA MEDIX is making healthcare truly accessible in our area.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VenkatReddy&backgroundColor=b6e3f4&skinColor=ae5d29&hair=short01&hairColor=262e33&eyes=default&mouth=smile&accessories=prescription02',
  },
  {
    name: 'Lakshmi Devi',
    location: 'Suryapet, Telangana',
    review: 'I used their telemedicine service for a consultation. The doctor was patient, and the entire process was seamless. Highly recommend for busy working women.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LakshmiDevi&backgroundColor=ffdfbf&skinColor=ae5d29&hair=long02&hairColor=2c1b18&eyes=happy&mouth=smile&accessories=roundGlasses',
  },
  {
    name: 'Ramesh Kumar',
    location: 'Kodad, Telangana',
    review: 'Affordable and accurate. I was worried about the cost of tests, but AASHA MEDIX provided a comprehensive health checkup at a very reasonable price. Thank you!',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RameshKumar&backgroundColor=c0aede&skinColor=614335&hair=short02&hairColor=2c1b18&eyes=default&mouth=smile',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from people we've had the privilege to serve.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col justify-between p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-50">
                <div>
                  <Quote className="w-8 h-8 text-green-200 mb-4" />
                  <p className="text-gray-600 mb-6 italic">"{testimonial.review}"</p>
                </div>
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-gray-200 mr-4 flex-shrink-0">
                    <img alt={testimonial.name} className="w-full h-full object-cover rounded-full" src={testimonial.image} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;