
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import QuickContactSection from '@/components/home/QuickContactSection';
import ErrorBoundary from '@/components/ErrorBoundary';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>AASHA MEDIX – Trusted Diagnostics, Telemedicine & Care at Home</title>
        <meta name="description" content="India's trusted healthcare platform for home diagnostics, doctor consultations, and medicine delivery. Book now for affordable and accurate care." />
      </Helmet>
      
      <main className="overflow-x-hidden bg-white">
        <ErrorBoundary>
          <HeroSection />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <StatsSection />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <ServicesSection />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <WhyChooseSection />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <TestimonialsSection />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <QuickContactSection />
        </ErrorBoundary>
      </main>
    </>
  );
};

export default HomePage;
