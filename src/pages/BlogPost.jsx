import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '@/data/blogData';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <Link to="/health-insights">
          <Button className="mt-8">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - AASHA MEDIX</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link to="/health-insights" className="inline-flex items-center space-x-2 text-green-600 hover:underline mb-8">
              <ArrowLeft size={18} />
              <span>Back to Health Insights</span>
            </Link>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center space-x-6 text-gray-500 mb-8">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
            </div>

            <div className="h-96 rounded-2xl overflow-hidden mb-12 shadow-lg">
              <img 
                alt={post.image}
                className="w-full h-full object-cover"
               src="https://images.unsplash.com/photo-1577510409458-a70f1efcba3d" />
            </div>

            <div
              className="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BlogPost;