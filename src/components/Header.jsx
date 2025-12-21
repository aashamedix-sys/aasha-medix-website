
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Shield, Briefcase, Truck, Stethoscope, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const LoginDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Button
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 rounded-lg border-2 border-[#00A86B] bg-white hover:bg-[#E6F5F0] text-[#00A86B] font-semibold text-sm transition-all duration-300"
      >
        <User className="w-4 h-4 mr-1.5" /> Login
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
            >
              <Link
                to="/patient-login"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2.5 hover:bg-[#E6F5F0] text-[#1F1F1F] hover:text-[#00A86B] transition-colors text-sm font-medium"
              >
                <User className="w-4 h-4 mr-2" /> Patient Login
              </Link>
              <Link
                to="/staff-login"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2.5 hover:bg-blue-50 text-[#1F1F1F] hover:text-[#3B82F6] transition-colors text-sm font-medium"
              >
                <Briefcase className="w-4 h-4 mr-2" /> Staff Login
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2.5 hover:bg-red-50 text-[#1F1F1F] hover:text-[#E63946] transition-colors text-sm font-medium"
              >
                <Shield className="w-4 h-4 mr-2" /> Admin Login
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('header.home') },
    { path: '/services', label: t('header.services') },
    { path: '/health-packages', label: t('header.priceList') },
    { path: '/about', label: t('header.about') },
    { path: '/contact', label: t('header.contact') }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft py-2' 
          : 'bg-white py-3'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-[1440px]">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo - Centered & Prominent */}
          <div className="z-50">
            <Logo size="lg" showText={true} className="hidden sm:inline-flex" />
            <Logo size="lg" showText={false} className="inline-flex sm:hidden" />
          </div>

          {/* Desktop Navigation - Clean & Readable */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg hover:bg-[#E6F5F0] hover:text-[#00A86B] ${
                  location.pathname === link.path 
                    ? 'text-[#00A86B] bg-[#E6F5F0]' 
                    : 'text-[#1F1F1F]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Service Action Buttons */}
            <div className="flex items-center space-x-2">
              <Link to="/book-tests">
                <Button 
                  size="sm" 
                  className="h-10 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 text-sm font-semibold"
                >
                  <Stethoscope className="w-4 h-4 mr-1.5" /> Diagnosis
                </Button>
              </Link>
              <Link to="/book-doctor">
                <Button 
                  size="sm" 
                  className="h-10 px-4 rounded-lg bg-[#00A86B] hover:bg-[#1B7F56] text-white shadow-sm hover:shadow-lg hover:shadow-green-200/50 transition-all duration-300 text-sm font-semibold"
                >
                  <User className="w-4 h-4 mr-1.5" /> Doctor
                </Button>
              </Link>
              <Link to="/order-medicine">
                <Button 
                  size="sm" 
                  className="h-10 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white shadow-sm hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 text-sm font-semibold"
                >
                  <Truck className="w-4 h-4 mr-1.5" /> Delivery
                </Button>
              </Link>
            </div>

            {/* Login Dropdown */}
            <LoginDropdown />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 text-[#1F1F1F] hover:text-[#00A86B] hover:bg-[#E6F5F0] rounded-lg transition-all duration-200 z-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Clean & Organized */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              className="lg:hidden bg-white border-t border-gray-100 absolute left-0 right-0 top-full shadow-soft rounded-b-2xl overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                
                {/* Navigation Links */}
                {navLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex items-center justify-between p-3 rounded-lg font-semibold transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'bg-[#E6F5F0] text-[#00A86B]'
                        : 'text-[#1F1F1F] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    {location.pathname === link.path && (
                      <span className="w-2 h-2 rounded-full bg-[#00A86B]"></span>
                    )}
                  </Link>
                ))}
                
                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>
                
                {/* Service Actions */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6B7280] px-3 py-1">Our Services</p>
                  <Link to="/book-tests" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-lg h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-base shadow-soft font-semibold justify-start">
                      <Stethoscope className="w-5 h-5 mr-2" /> Diagnosis
                    </Button>
                  </Link>
                  <Link to="/book-doctor" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-lg h-11 bg-[#00A86B] hover:bg-[#1B7F56] text-white text-base shadow-soft font-semibold justify-start">
                      <User className="w-5 h-5 mr-2" /> Doctor Consultation
                    </Button>
                  </Link>
                  <Link to="/order-medicine" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-lg h-11 bg-[#F97316] hover:bg-[#EA580C] text-white text-base shadow-soft font-semibold justify-start">
                      <Truck className="w-5 h-5 mr-2" /> Delivery
                    </Button>
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Login Options */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6B7280] px-3 py-1">Login</p>
                  <Link to="/patient-login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-white border-2 border-[#00A86B] hover:bg-[#E6F5F0] text-[#00A86B] text-sm h-10 rounded-lg font-semibold justify-start">
                      <User className="w-4 h-4 mr-2" /> Patient Login
                    </Button>
                  </Link>
                  <Link to="/staff-login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-white border-2 border-blue-500 hover:bg-blue-50 text-blue-600 text-sm h-10 rounded-lg font-semibold justify-start">
                      <Briefcase className="w-4 h-4 mr-2" /> Staff Login
                    </Button>
                  </Link>
                  <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-white border-2 border-red-500 hover:bg-red-50 text-red-600 text-sm h-10 rounded-lg font-semibold justify-start">
                      <Shield className="w-4 h-4 mr-2" /> Admin Login
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
