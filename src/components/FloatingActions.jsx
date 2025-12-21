
import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const FloatingActions = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/918332030109?text=Hello%20AASHA%20MEDIX,%20I%20need%20assistance', '_blank');
  };

  const [floatingStyle, setFloatingStyle] = useState({ bottom: 24, scale: 1 });

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - window.innerHeight - window.scrollY;
      if (remaining < 240) {
        setFloatingStyle({ bottom: 96, scale: 0.94 });
      } else {
        setFloatingStyle({ bottom: 24, scale: 1 });
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed right-6 z-50 flex flex-col items-end gap-4"
      style={{ bottom: floatingStyle.bottom }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: floatingStyle.scale }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <Button
          onClick={handleWhatsApp}
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center p-0 relative"
        >
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          <MessageCircle className="w-8 h-8" />
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingActions;
