import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AASHA MEDIX Logo Component
 * UI is finalized and frozen. No further visual changes permitted.
 * 
 * @param {string} variant - 'horizontal' (default) or 'emblem' (circular)
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {string} theme - 'light' or 'dark'
 * @param {boolean} showText - Show brand text (horizontal only)
 * @param {string} textAlign - 'left' or 'center'
 */
const Logo = ({ 
  variant = 'horizontal',
  size = 'md', 
  className = '', 
  showText = true,
  textAlign = 'left',
  theme = 'light'
}) => {
  const sizeClasses = {
    sm: variant === 'emblem' ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12',
    md: variant === 'emblem' ? 'w-10 h-10' : 'w-14 h-14 md:w-16 md:h-16',
    lg: variant === 'emblem' ? 'w-12 h-12' : 'w-16 h-16 md:w-20 md:h-20'
  };

  const textSizeClasses = {
    sm: 'text-base md:text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl'
  };

  const alignClasses = {
    left: 'items-start',
    center: 'items-center'
  };

  const textColorClasses = {
    light: 'text-[#1F1F1F] group-hover:text-[#1F1F1F]',
    dark: 'text-white group-hover:text-white'
  };

  const taglineColorClasses = {
    light: 'text-[#6B7280]',
    dark: 'text-gray-400'
  };

  const logoSrc = variant === 'emblem' 
    ? '/assets/logo-enhanced.svg?t=' + new Date().getTime()
    : '/assets/logo.svg?t=' + new Date().getTime();

  // Get size in pixels for explicit SVG sizing
  const getSizePixels = (size) => {
    const pixelMap = {
      sm: 32,
      md: 56,
      lg: 80
    };
    return pixelMap[size] || 56;
  };

  const sizeInPixels = getSizePixels(size);

  return (
    <Link
      to="/contact"
      aria-label="Go to Contact Us"
      className={`inline-flex gap-2.5 group cursor-pointer transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A86B] focus-visible:ring-offset-2 ${theme === 'dark' ? 'focus-visible:ring-offset-[#0F1316]' : ''} ${className}`}
    >
      <img
        src={logoSrc}
        alt="AASHA MEDIX"
        width={sizeInPixels}
        height={sizeInPixels}
        className={`${sizeClasses[size]} object-contain shrink-0 ${variant === 'emblem' ? 'rounded-full' : ''} transition-transform duration-200 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]`}
      />
      {showText && variant === 'horizontal' && (
        <div className={`flex flex-col justify-center ${alignClasses[textAlign]}`}>
          <span className={`${textSizeClasses[size]} font-extrabold tracking-tight leading-none ${textColorClasses[theme]}`}>
            <span className="text-[#00A86B]">AASHA</span><span className="text-[#E63946]">MEDIX</span>
          </span>
          <span className={`text-xs font-semibold tracking-wide ${taglineColorClasses[theme]}`}>Bridging Gaps, Building Healthier Lives</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
