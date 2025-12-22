
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustDivider from '@/components/TrustDivider';

// Mobile Optimizations - Healthcare UX
import '@/styles/mobile-optimizations.css';
import '@/styles/final-polish.css';
import '@/utils/mobile-optimizations.js';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import WhyChoose from '@/pages/WhyChoose';
import Contact from '@/pages/Contact';
import HealthInsights from '@/pages/HealthInsights';
import BlogPost from '@/pages/BlogPost';
import Team from '@/pages/Team';
import FAQ from '@/pages/FAQ';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsConditions from '@/pages/TermsConditions';
import RefundPolicy from '@/pages/RefundPolicy';
import PatientLogin from '@/pages/PatientLogin';
import PatientRegister from '@/pages/PatientRegister';
import StaffLogin from '@/pages/StaffLogin';
import AuthCallback from '@/pages/AuthCallback';

// Booking Pages
import BookDiagnosticTests from '@/pages/BookDiagnosticTests';
import BookDoctor from '@/pages/BookDoctor';
import HealthPackages from '@/pages/HealthPackages';
import TestPriceList from '@/pages/TestPriceList'; 
import OrderMedicine from '@/pages/OrderMedicine';
import BookingConfirmation from '@/pages/BookingConfirmation';
import OrderMedicineCheckout from '@/pages/OrderMedicineCheckout';
import BookingTracker from '@/pages/BookingTracker';

// User & Dashboard Pages
import UserProfile from '@/pages/UserProfile';
import PatientDashboard from '@/pages/patient/PatientDashboard';
import PatientReports from '@/pages/patient/PatientReports';
import PatientAppointments from '@/pages/patient/PatientAppointments';
import PatientProfile from '@/pages/patient/PatientProfile';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Setup from '@/pages/Setup';
import PriceList from '@/pages/PriceList';

import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import FloatingActions from '@/components/FloatingActions';
import AashaDostChatbot from '@/components/AashaDostChatbot';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0FA958] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Verifying access...</p>
      </div>
    </div>
  );
  
  if (!user) {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return <Navigate to="/admin/login" replace />;
    if (path.startsWith('/staff')) return <Navigate to="/staff-login" replace />;
    return <Navigate to="/patient-login" replace />;
  }

  if (allowedRoles) {
    const normalizedRole = (userRole || '').toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === normalizedRole);
    
    if (!isAllowed) {
       if (normalizedRole === 'admin' || normalizedRole === 'super admin') return <Navigate to="/admin/dashboard" replace />;
       if (normalizedRole === 'patient') return <Navigate to="/patient" replace />;
       return <Navigate to="/staff" replace />;
    }
  }
  
  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = ['/patient', '/staff', '/admin', '/setup'].some(path => location.pathname.startsWith(path));

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Header />}
      
      <main className={!isDashboardRoute ? "min-h-screen" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/why-choose" element={<WhyChoose />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/health-insights" element={<HealthInsights />} />
          <Route path="/health-insights/:slug" element={<BlogPost />} />
          <Route path="/meet-our-team" element={<Team />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          
          <Route path="/book-tests" element={<BookDiagnosticTests />} />
          <Route path="/pricelist" element={<PriceList />} />
          {/* Fix: Header links to /test-price-list; register this route to avoid blank page */}
          <Route path="/test-price-list" element={<TestPriceList />} />
          {/* Alias route retained for backwards-compatibility */}
          <Route path="/price-list" element={<TestPriceList />} />
          <Route path="/book-doctor" element={<BookDoctor />} />
          <Route path="/health-packages" element={<HealthPackages />} />
          <Route path="/order-medicine" element={<OrderMedicine />} />
          
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/order-medicine-checkout" element={<OrderMedicineCheckout />} />
          <Route path="/booking-tracker" element={<BookingTracker />} />
          
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/register" element={<PatientRegister />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* OAuth callback route */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route path="/setup" element={<Setup />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['Patient']}><UserProfile /></ProtectedRoute>} />
          
          <Route path="/patient/*" element={<ProtectedRoute allowedRoles={['Patient']}><Routes>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/reports" element={<PatientReports />} />
              <Route path="/appointments" element={<PatientAppointments />} />
              <Route path="/profile" element={<PatientProfile />} />
          </Routes></ProtectedRoute>} />

          <Route path="/staff/*" element={<ProtectedRoute allowedRoles={['Phlebotomist', 'Doctor', 'Technician', 'Receptionist', 'Staff']}><StaffDashboard /></ProtectedRoute>} />
          
          <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['Admin', 'Super Admin']}><Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              {/* Admin Import Price List UI */}
              <Route path="/import-prices" element={<React.Suspense fallback={<div className="p-8">Loading…</div>}>
                {/** lazy import avoids initial bundle weight */}
                {(() => {
                  const ImportPrices = React.lazy(() => import('@/pages/admin/ImportPrices'));
                  return <ImportPrices />;
                })()}
              </React.Suspense>} />
          </Routes></ProtectedRoute>} />

        </Routes>
      </main>

      {!isDashboardRoute && <TrustDivider />}
      {!isDashboardRoute && <Footer />}
      <AashaDostChatbot />
      <FloatingActions />
      <Toaster />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans antialiased text-slate-900 selection:bg-[#0FA958] selection:text-white">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
