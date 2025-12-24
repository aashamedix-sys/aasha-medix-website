
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
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

// Lazy load admin sub-pages
const ManageDoctors = lazy(() => import('@/pages/admin/ManageDoctors'));
const ManageTests = lazy(() => import('@/pages/admin/ManageTests'));
const ViewBookings = lazy(() => import('@/pages/admin/ViewBookings'));
const StaffManagement = lazy(() => import('@/pages/admin/StaffManagement'));
const ContentManager = lazy(() => import('@/pages/admin/ContentManager'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const ImportPrices = lazy(() => import('@/pages/admin/ImportPrices'));
const LeadManagement = lazy(() => import('@/pages/admin/LeadManagement'));

import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import FloatingActions from '@/components/FloatingActions';
import AashaDostChatbot from '@/components/AashaDostChatbot';

// Loading fallback component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
    <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-xl">
      <div className="w-16 h-16 border-4 border-[#0FA958] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-700 font-semibold text-lg">Loading...</p>
      <p className="text-gray-500 text-sm">Please wait</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();
  
  console.log('[ProtectedRoute] Checking access - user:', !!user, 'role:', userRole, 'loading:', loading, 'allowedRoles:', allowedRoles);
  
  // CRITICAL: Show loading spinner while auth is initializing
  if (loading) {
    console.log('[ProtectedRoute] Auth loading, showing spinner...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 border-4 border-[#0FA958] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-semibold text-lg">Verifying access...</p>
          <p className="text-gray-500 text-sm">Please wait</p>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to login...');
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return <Navigate to="/admin/login" replace />;
    if (path.startsWith('/staff')) return <Navigate to="/staff-login" replace />;
    return <Navigate to="/patient-login" replace />;
  }

  // Check if role is required and valid
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedRole = (userRole || '').toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    console.log('[ProtectedRoute] Role check - user role:', normalizedRole, 'allowed:', normalizedAllowedRoles);
    
    const isAllowed = normalizedAllowedRoles.includes(normalizedRole);
    
    if (!isAllowed) {
      console.log('[ProtectedRoute] Role not allowed, redirecting based on user role...');
      
      // Redirect to appropriate dashboard based on actual role
      if (normalizedRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      if (normalizedRole === 'staff') {
        return <Navigate to="/staff" replace />;
      }
      if (normalizedRole === 'patient') {
        return <Navigate to="/patient" replace />;
      }
      
      // If no role found, send to login
      console.warn('[ProtectedRoute] No valid role found, redirecting to login');
      return <Navigate to="/patient-login" replace />;
    }
  }
  
  console.log('[ProtectedRoute] ✓ Access granted');
  // CRITICAL: Return Outlet for nested routes OR children if provided
  return children || <Outlet />;
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
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['patient']}><UserProfile /></ProtectedRoute>} />
          
          <Route path="/patient/*" element={<ProtectedRoute allowedRoles={['patient']}><Routes>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/reports" element={<PatientReports />} />
              <Route path="/appointments" element={<PatientAppointments />} />
              <Route path="/profile" element={<PatientProfile />} />
          </Routes></ProtectedRoute>} />

          <Route path="/staff/*" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
          
          {/* Admin Routes with nested structure */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<Suspense fallback={<LoadingScreen />}><ManageDoctors /></Suspense>} />
            <Route path="tests" element={<Suspense fallback={<LoadingScreen />}><ManageTests /></Suspense>} />
            <Route path="bookings" element={<Suspense fallback={<LoadingScreen />}><ViewBookings /></Suspense>} />
            <Route path="staff" element={<Suspense fallback={<LoadingScreen />}><StaffManagement /></Suspense>} />
            <Route path="leads" element={<Suspense fallback={<LoadingScreen />}><LeadManagement /></Suspense>} />
            <Route path="content" element={<Suspense fallback={<LoadingScreen />}><ContentManager /></Suspense>} />
            <Route path="analytics" element={<Suspense fallback={<LoadingScreen />}><Analytics /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<LoadingScreen />}><AdminSettings /></Suspense>} />
            <Route path="import-prices" element={<Suspense fallback={<LoadingScreen />}><ImportPrices /></Suspense>} />
          </Route>

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
