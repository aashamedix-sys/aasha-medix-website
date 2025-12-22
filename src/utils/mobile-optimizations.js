/**
 * AASHA MEDIX - Mobile UX Enhancement JavaScript
 * Minimal, healthcare-grade functionality for:
 * - FAQ Accordion
 * - "View All Services" toggle
 * - "Read More" text expansion
 * - Sticky bottom CTA (Call/WhatsApp)
 * 
 * No framework dependencies. Pure vanilla JavaScript.
 * Performance-optimized for mobile devices.
 */

// ============================================================================
// 1️⃣ FAQ ACCORDION - Mobile Optimization
// ============================================================================

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('[data-faq-item]');
  
  if (!faqItems.length) return; // Exit if no FAQ items found

  faqItems.forEach(item => {
    const header = item.querySelector('[data-faq-header]');
    const content = item.querySelector('[data-faq-content]');
    const icon = item.querySelector('[data-faq-icon]');

    if (!header || !content) return;

    // Only enable accordion on mobile
    if (window.innerWidth <= 768) {
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.style.cursor = 'pointer';
      content.style.display = 'none'; // Hidden by default

      const toggleAccordion = (e) => {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        
        if (isOpen) {
          // Close accordion
          content.style.display = 'none';
          content.style.maxHeight = '0';
          item.classList.remove('open');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          // Open accordion
          content.style.display = 'block';
          content.style.maxHeight = content.scrollHeight + 'px';
          item.classList.add('open');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      };

      header.addEventListener('click', toggleAccordion);
      header.addEventListener('keydown', toggleAccordion);

      // Smooth transition
      content.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
      content.style.opacity = '0';

      header.addEventListener('click', () => {
        if (item.classList.contains('open')) {
          content.style.opacity = '1';
        } else {
          content.style.opacity = '0';
        }
      });
    }
  });
}

// ============================================================================
// 2️⃣ VIEW ALL SERVICES - Expandable Toggle (Mobile Only)
// ============================================================================

function initViewAllServices() {
  const viewAllBtn = document.querySelector('[data-services-view-all]');
  
  if (!viewAllBtn) return; // Exit if button not found

  // Only show on mobile
  if (window.innerWidth <= 768) {
    viewAllBtn.style.display = 'block';

    viewAllBtn.addEventListener('click', () => {
      const isExpanded = document.body.classList.contains('services-expanded');

      if (isExpanded) {
        document.body.classList.remove('services-expanded');
        viewAllBtn.textContent = 'View All Services';
        viewAllBtn.setAttribute('aria-expanded', 'false');
      } else {
        document.body.classList.add('services-expanded');
        viewAllBtn.textContent = 'Show Less';
        viewAllBtn.setAttribute('aria-expanded', 'true');
        
        // Smooth scroll to button
        setTimeout(() => {
          viewAllBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  } else {
    viewAllBtn.style.display = 'none';
  }
}

// ============================================================================
// 3️⃣ READ MORE / SHOW MORE - Text Expansion Toggle
// ============================================================================

function initReadMoreToggle() {
  const readMoreButtons = document.querySelectorAll('[data-read-more-button]');

  readMoreButtons.forEach(button => {
    const textBlock = button.previousElementSibling;
    
    if (!textBlock) return;

    button.addEventListener('click', (e) => {
      e.preventDefault();

      const isExpanded = textBlock.classList.contains('text-expanded');

      if (isExpanded) {
        textBlock.classList.remove('text-expanded');
        button.textContent = 'Read More';
        button.setAttribute('aria-expanded', 'false');
      } else {
        textBlock.classList.add('text-expanded');
        button.textContent = 'Read Less';
        button.setAttribute('aria-expanded', 'true');
      }
    });

    // Set initial state
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-expanded', 'false');
  });
}

// ============================================================================
// 4️⃣ STICKY BOTTOM CTA - Mobile Call/WhatsApp (Fixed Position)
// ============================================================================

function initStickyBottomCTA() {
  const stickyCTA = document.querySelector('[data-sticky-cta]');
  
  if (!stickyCTA) return; // Exit if CTA not found

  // Only show on mobile
  if (window.innerWidth <= 768) {
    stickyCTA.style.display = 'flex';
    document.body.classList.add('has-sticky-cta');

    // Handle click events
    const callBtn = stickyCTA.querySelector('[data-call-button]');
    const whatsappBtn = stickyCTA.querySelector('[data-whatsapp-button]');

    if (callBtn) {
      callBtn.addEventListener('click', () => {
        const phone = callBtn.getAttribute('data-phone') || '919876543210';
        window.location.href = `tel:+${phone}`;
      });
    }

    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => {
        const phone = whatsappBtn.getAttribute('data-phone') || '919876543210';
        const message = whatsappBtn.getAttribute('data-message') || 'Hi, I need help with AASHA MEDIX services.';
        window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      });
    }
  } else {
    stickyCTA.style.display = 'none';
    document.body.classList.remove('has-sticky-cta');
  }
}

// ============================================================================
// 5️⃣ RESPONSIVE HANDLER - Re-init on window resize
// ============================================================================

function handleResponsiveChange() {
  // Debounce resize events
  let resizeTimer;
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = window.innerWidth <= 768;

      // Re-initialize mobile features
      if (isMobile) {
        initFAQAccordion();
        initViewAllServices();
        initStickyBottomCTA();
      } else {
        // Reset mobile-specific classes on desktop
        document.body.classList.remove('services-expanded');
        document.body.classList.remove('has-sticky-cta');
        
        // Reset FAQ to open state
        document.querySelectorAll('[data-faq-item]').forEach(item => {
          item.classList.remove('open');
          const content = item.querySelector('[data-faq-content]');
          if (content) {
            content.style.display = 'block';
            content.style.maxHeight = 'none';
          }
        });

        // Hide sticky CTA
        const stickyCTA = document.querySelector('[data-sticky-cta]');
        if (stickyCTA) stickyCTA.style.display = 'none';
      }
    }, 150);
  });
}

// ============================================================================
// 6️⃣ PERFORMANCE: Intersection Observer for Lazy Features
// ============================================================================

function initLazyFeatures() {
  // Lazy-initialize features only when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.initialized) {
        const type = entry.target.getAttribute('data-lazy-feature');

        if (type === 'faq') {
          initFAQAccordion();
        } else if (type === 'services') {
          initViewAllServices();
        }

        entry.target.dataset.initialized = 'true';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-lazy-feature]').forEach(el => {
    observer.observe(el);
  });
}

// ============================================================================
// 7️⃣ ACCESSIBILITY: Keyboard Navigation
// ============================================================================

function enhanceAccessibility() {
  // Ensure all interactive elements are keyboard accessible
  document.querySelectorAll('[data-faq-header]').forEach(header => {
    header.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const nextItem = header.closest('[data-faq-item]').nextElementSibling;
        if (nextItem && nextItem.querySelector('[data-faq-header]')) {
          nextItem.querySelector('[data-faq-header]').focus();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const prevItem = header.closest('[data-faq-item]').previousElementSibling;
        if (prevItem && prevItem.querySelector('[data-faq-header]')) {
          prevItem.querySelector('[data-faq-header]').focus();
        }
      }
    });
  });
}

// ============================================================================
// 8️⃣ INIT HANDLER - Run on DOM Ready
// ============================================================================

function initMobileOptimizations() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    if (window.innerWidth <= 768) {
      initFAQAccordion();
      initViewAllServices();
      initReadMoreToggle();
      initStickyBottomCTA();
      initLazyFeatures();
      enhanceAccessibility();
      handleResponsiveChange();
    } else {
      // Still set up responsive handler for desktop-to-mobile transition
      handleResponsiveChange();
    }
  }
}

// ============================================================================
// 9️⃣ SMOOTHSCROLL POLYFILL (for older browsers)
// ============================================================================

if (!('scrollBehavior' in document.documentElement.style)) {
  // Simple smooth scroll fallback
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.hash) {
      const target = document.querySelector(e.target.hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// ============================================================================
// EXPORT & AUTO-INIT
// ============================================================================

// Auto-initialize on script load
initMobileOptimizations();

// Export for manual use (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initFAQAccordion,
    initViewAllServices,
    initReadMoreToggle,
    initStickyBottomCTA,
    handleResponsiveChange,
    initMobileOptimizations
  };
}

// Log initialization in development
if (process.env.NODE_ENV === 'development') {
  console.log('✅ AASHA MEDIX Mobile Optimizations Initialized');
}
