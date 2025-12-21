import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';

const ReportPortalCTA = () => {
  const handleReportAccess = () => {
    toast({
      title: 'Report Portal Coming Soon!',
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-500 to-red-500 text-white p-10 rounded-2xl shadow-lg text-center"
        >
          <FileText className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Access Your Test Reports</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Securely view, download, and share your medical reports online. Your health data, available anytime, anywhere.
          </p>
          <Button
            onClick={handleReportAccess}
            className="btn-cta bg-white text-green-600 hover:bg-gray-100"
            size="lg"
          >
            Access Your Report
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReportPortalCTA;