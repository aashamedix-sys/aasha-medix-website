
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import Logo from '@/components/Logo';

/**
 * Footer Component
 * UI is finalized and frozen. No further visual changes permitted.
 */

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/' },
    { Icon: Twitter, href: 'https://www.twitter.com/' },
    { Icon: Instagram, href: 'https://www.instagram.com/' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0F1316] text-white pt-14 md:pt-18 pb-10 border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-[#00A86B]/5" aria-hidden="true"></div>
      <div className="relative container mx-auto px-4 lg:px-8 max-w-[1440px]">

        {/* Top trust bar */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 shadow-md">
          <div className="flex items-center gap-3 text-sm text-gray-200">
            <Logo variant="emblem" size="sm" showText={false} theme="dark" className="opacity-75" />
            <div>
              <p className="font-semibold text-white">Healthcare at Home</p>
              <p className="text-gray-400">Accredited diagnostics • Trusted caregivers • 24/7 support</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span className="h-2 w-2 rounded-full bg-[#00A86B] animate-pulse"></span>
            <span className="font-medium">Supporting families and elders with safe, reliable healthcare</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">

          {/* Brand & About */}
          <div className="space-y-6 text-center sm:text-left">
            <Logo 
              size="md" 
              showText={true} 
              theme="dark"
              textAlign="center"
              className="justify-center sm:justify-start"
            />
            <p className="text-gray-300 leading-relaxed text-sm md:text-[15px]">
              Quality healthcare with compassionate care. Accurate diagnostics and personal support for your family.
            </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {socialLinks.map(({ Icon, href }, idx) => (
                      <a
                        key={idx}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:text-white hover:bg-[#00A86B]/90"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-semibold text-[15px] md:text-base mb-5 text-white flex items-center">
              <span className="w-1.5 h-1.5 bg-[#00A86B] rounded-full mr-3"></span>
              Services
            </h4>
            <ul className="space-y-3.5 text-gray-300 text-sm leading-relaxed">
              <li>
                <Link to="/book-tests" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Book Diagnostic Tests
                </Link>
              </li>
              <li>
                <Link to="/book-doctor" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Consult a Doctor
                </Link>
              </li>
              <li>
                <Link to="/order-medicine" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Order Medicine
                </Link>
              </li>
              <li>
                <Link to="/health-packages" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Health Packages
                </Link>
              </li>
              <li>
                <Link to="/services" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Home Sample Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-[15px] md:text-base mb-5 text-white flex items-center">
              <span className="w-1.5 h-1.5 bg-[#00A86B] rounded-full mr-3"></span>
              Company
            </h4>
            <ul className="space-y-3.5 text-gray-300 text-sm leading-relaxed">
              <li>
                <Link to="/about" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="inline-flex items-center gap-2 hover:text-[#00A86B] hover:underline-offset-4 hover:underline transition-all duration-200">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-[15px] md:text-base mb-5 text-white flex items-center">
              <span className="w-1.5 h-1.5 bg-[#00A86B] rounded-full mr-3"></span>
              Get in Touch
            </h4>
            <ul className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00A86B] mt-0.5 shrink-0" />
                <span className="leading-relaxed">Suryapet, Telangana, India 508213</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00A86B] shrink-0" />
                <a href="tel:+918332030109" className="hover:text-[#00A86B] hover:underline underline-offset-4 transition-colors duration-200 font-semibold text-white">
                  +91 8332030109
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00A86B] shrink-0" />
                <a href="mailto:care@aashamedix.com" className="hover:text-[#00A86B] hover:underline underline-offset-4 transition-colors duration-200">
                  care@aashamedix.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Bar - Clean & Professional */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
          <p className="font-medium">© {currentYear} AASHA MEDIX. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-gray-400">Built with care for healthier families</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
