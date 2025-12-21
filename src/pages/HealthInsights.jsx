
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '@/data/blogData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';

const HealthInsights = () => {
  return (
    <>
      <Helmet>
        <title>Health Insights Blog - AASHA MEDIX</title>
        <meta name="description" content="Read the latest health tips, medical news, and wellness advice from AASHA MEDIX experts." />
      </Helmet>

      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Medical Journal</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-6">Health Insights</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert advice and updates to help you live a healthier life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/health-insights/${post.slug}`}>
                  <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0 group bg-white rounded-2xl">
                    <div className="h-56 overflow-hidden relative">
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm z-10">
                         <Tag className="w-3 h-3 mr-1" /> {post.category}
                       </div>
                       <img 
                         alt={post.image} 
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                        <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-green-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HealthInsights;
