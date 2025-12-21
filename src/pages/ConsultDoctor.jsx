
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Video, Calendar, Star, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const specialties = [
  { id: 'gen', name: "General Physician", icon: "🩺", desc: "For flu, fever, general health" },
  { id: 'gyn', name: "Gynecologist", icon: "👩‍⚕️", desc: "Women's health & pregnancy" },
  { id: 'der', name: "Dermatologist", icon: "🧖‍♀️", desc: "Skin, hair & nail problems" },
  { id: 'ped', name: "Pediatrician", icon: "👶", desc: "Child specialist" },
  { id: 'ort', name: "Orthopedic", icon: "🦴", desc: "Bone & joint specialist" },
  { id: 'ent', name: "ENT Specialist", icon: "👂", desc: "Ear, nose & throat" },
  { id: 'psy', name: "Psychiatrist", icon: "🧠", desc: "Mental health specialist" },
  { id: 'car', name: "Cardiologist", icon: "❤️", desc: "Heart specialist" },
];

const ConsultDoctor = () => {
  const navigate = useNavigate();

  const handleSpecialtyClick = (specialtyName) => {
    navigate('/doctor-booking', { state: { selectedSpecialty: specialtyName } });
  };

  return (
    <>
      <Helmet>
        <title>Consult a Doctor - AASHA MEDIX</title>
        <meta name="description" content="Book online video consultations with top doctors across 20+ specialties. Instant appointments, verified doctors." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 pt-20 pb-20">
        
        {/* Hero */}
        <section className="bg-white py-16 border-b border-gray-100">
           <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                 <div className="lg:w-1/2 space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                       <Video className="w-4 h-4" />
                       <span>Online Video Consultation</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                       Expert Doctors, <br/>
                       <span className="text-[#1FAA59]">Just a Click Away.</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                       Skip the waiting room. Consult with India's top specialists via video call from the comfort of your home.
                    </p>
                    <div className="flex gap-4">
                       <Button className="bg-[#1FAA59] hover:bg-green-700 h-12 px-8 text-lg rounded-xl">Book Now</Button>
                       <Button variant="outline" className="h-12 px-8 text-lg rounded-xl">How it works?</Button>
                    </div>
                 </div>
                 <div className="lg:w-1/2">
                    <div className="relative">
                       <div className="absolute -inset-4 bg-green-100 rounded-full blur-3xl opacity-30"></div>
                       <img 
                         src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800" 
                         alt="Doctor Consultation" 
                         className="relative rounded-3xl shadow-2xl"
                       />
                       
                       {/* Floating Stat Card */}
                       <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce duration-[3000ms]">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                             <Star className="w-6 h-6 fill-current" />
                          </div>
                          <div>
                             <p className="font-bold text-gray-900">4.9/5 Rating</p>
                             <p className="text-xs text-gray-500">From 10k+ Patients</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Specialties Grid */}
        <section className="py-20">
           <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">Select a Specialty</h2>
                 <p className="text-gray-500">Choose from our broad range of medical specialties</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {specialties.map((spec) => (
                    <motion.div 
                      key={spec.id}
                      whileHover={{ y: -5 }}
                      onClick={() => handleSpecialtyClick(spec.name)}
                      className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-lg border border-gray-100 cursor-pointer text-center group transition-all"
                    >
                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:bg-green-50 transition-colors">
                          {spec.icon}
                       </div>
                       <h3 className="font-bold text-gray-900 mb-1">{spec.name}</h3>
                       <p className="text-xs text-gray-500 mb-4">{spec.desc}</p>
                       <span className="text-[#1FAA59] text-sm font-medium flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Consult <ArrowRight className="w-4 h-4" />
                       </span>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Features */}
        <section className="bg-white py-20">
           <div className="container mx-auto px-4 lg:px-8">
              <div className="grid md:grid-cols-3 gap-8">
                 <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                       <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Doctors</h3>
                    <p className="text-gray-600">Every doctor is verified and vetted for their qualifications and experience.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 mb-4">
                       <Video className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">High Quality Video</h3>
                    <p className="text-gray-600">Seamless video consultation experience with digital prescription.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 mb-4">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Booking</h3>
                    <p className="text-gray-600">Book appointments instantly. Choose a time that works for you.</p>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </>
  );
};

export default ConsultDoctor;
