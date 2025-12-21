
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Rajeshwari Goud',
    location: 'Suryapet',
    review: 'The team arrived at my home exactly on time. My mother is bedridden, and their patience during blood collection was heart-touching. Reports came on WhatsApp by evening.',
    role: 'Homemaker',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Venkatesh Reddy',
    location: 'Chivemla',
    review: 'Living in Chivemla, specialized doctors are hard to find. AASHA MEDIX Telemedicine connected me to a Hyderabad cardiologist in 10 minutes. Saved me a whole day of travel.',
    role: 'Farmer',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507539332640-34d5a4ee0f86?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Lakshmi Rao',
    location: 'Nereducharla',
    review: 'Affordable and reliable. I have diabetes, and their monthly home checkup package is very helpful. The phlebotomist is hygienic and skilled.',
    role: 'Retired Teacher',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Suresh Kumar',
    location: 'Kodad',
    review: 'Excellent service! My diabetes screening was done at home, and the doctor consultation via video was very professional. Highly recommended for rural areas.',
    role: 'Business Owner',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Priya Sharma',
    location: 'Suryapet',
    review: 'As a working mother, this service is a lifesaver. I can get my kids tested without missing work. The staff is polite and professional every single time.',
    role: 'Software Engineer',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Mohan Das',
    location: 'Hyderabad',
    review: 'Never thought I\'d get such quality healthcare at doorstep. AASHA MEDIX staff is trained, reports are accurate, and customer support is outstanding.',
    role: 'Retired Banker',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507539332640-34d5a4ee0f86?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Kavya Gupta',
    location: 'Nereducharla',
    review: 'Best diagnostic center in our area. Quick reports, accurate results, and very caring staff. My whole family now uses AASHA MEDIX only.',
    role: 'Teacher',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Ramakrishna Rao',
    location: 'Chivemla',
    review: 'Trustworthy, affordable, and truly compassionate service. Their lipid profile package helped me track my health improvements over 3 months. Thank you AASHA MEDIX!',
    role: 'Farmer',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Sridevi Pal',
    location: 'Suryapet',
    review: 'My elderly father had mobility issues, but AASHA MEDIX came home for his complete health checkup. The technician was so gentle and explained everything clearly.',
    role: 'Housewife',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Narendra Singh',
    location: 'Kodad',
    review: 'Had my annual checkup done at home. No time wasted, no hospital hassle. The reports were detailed and the follow-up consultation on video was very helpful.',
    role: 'Shop Owner',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1463453091185-61c59a2b238b?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Anjali Desai',
    location: 'Nereducharla',
    review: 'During COVID, this service was a blessing. Safe home testing, quick results, and no exposure risk. AASHA MEDIX truly cares about patient safety.',
    role: 'Nurse',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Govind Nair',
    location: 'Hyderabad',
    review: 'Transparent pricing, no hidden charges. For health packages, AASHA MEDIX offers the best value in town. Already recommended to 10 friends and family.',
    role: 'Accountant',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Meera Chandran',
    location: 'Suryapet',
    review: 'My pregnancy checkups were made so convenient with home consultations. The gynecologist was experienced, caring, and gave me all the information I needed.',
    role: 'Expectant Mother',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507876466875-2f80300f18df?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-24 bg-[#E6F5F0] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-[#00A86B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#00A86B]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F1F1F]">
            What Our Patients Say
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Real stories from real families we've had the privilege to serve.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-soft relative overflow-hidden">
                {/* Quote Icon - Subtle */}
                <Quote className="absolute top-8 right-8 text-[#00A86B]/10 w-24 h-24 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar - Removed for now */}
                  
                  {/* Content */}
                  <div className="text-center md:text-left flex-1 space-y-4 w-full">
                    {/* Rating */}
                    <div className="flex justify-center md:justify-start space-x-1">
                      {[...Array(testimonials[index].rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 text-amber-400 fill-amber-400" 
                        />
                      ))}
                    </div>
                    
                    {/* Review Text */}
                    <p className="text-lg md:text-xl text-[#1F1F1F] font-medium leading-relaxed italic">
                      "{testimonials[index].review}"
                    </p>
                    
                    {/* Author Info */}
                    <div className="pt-2">
                      <h4 className="text-lg font-bold text-[#1F1F1F]">
                        {testimonials[index].name}
                      </h4>
                      <p className="text-[#00A86B] font-semibold text-sm">
                        {testimonials[index].location} • {testimonials[index].role}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-10">
            <button 
              onClick={prev} 
              className="w-12 h-12 rounded-full border-2 border-[#00A86B] bg-white text-[#00A86B] flex items-center justify-center hover:bg-[#00A86B] hover:text-white transition-all duration-300 shadow-soft"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={next} 
              className="w-12 h-12 rounded-full border-2 border-[#00A86B] bg-white text-[#00A86B] flex items-center justify-center hover:bg-[#00A86B] hover:text-white transition-all duration-300 shadow-soft"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'bg-[#00A86B] w-8' : 'bg-[#00A86B]/30 hover:bg-[#00A86B]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
