
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, FileText, Calendar, Users, Settings, LogOut, Activity, 
  UserCircle, Briefcase as BriefcaseMedical, UserPlus, FileHeart, Menu, X, 
  Home, Stethoscope, TestTube, BarChart3, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const DashboardLayout = ({ children, title, role = "admin" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = {
    Patient: [
      { icon: LayoutDashboard, label: 'Overview', path: '/patient' },
      { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
      { icon: FileText, label: 'Medical Reports', path: '/patient/reports' },
      { icon: UserCircle, label: 'My Profile', path: '/patient/profile' },
    ],
    Admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
      { icon: Stethoscope, label: 'Manage Doctors', path: '/admin/doctors' },
      { icon: TestTube, label: 'Manage Tests', path: '/admin/tests' },
      { icon: Calendar, label: 'View Bookings', path: '/admin/bookings' },
      { icon: Users, label: 'Leads CRM', path: '/admin/leads' },
      { icon: BriefcaseMedical, label: 'Staff Directory', path: '/admin/staff' },
      { icon: FileText, label: 'Content Manager', path: '/admin/content' },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ],
    // Default fallback for staff roles
    Staff: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/staff' },
    ]
  };

  // Determine which nav items to use. 'admin' role in db is 'Admin' or 'admin'
  const roleKey = (userRole === 'Admin' || userRole === 'admin') ? 'Admin' : (userRole === 'Patient' ? 'Patient' : 'Staff');
  const currentNav = navItems[roleKey] || [];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
        <div className="w-8 h-8 bg-[#1FAA59] rounded-lg flex items-center justify-center text-white font-bold">A</div>
        <div>
          <span className="font-bold text-gray-900 block leading-none">AASHA MEDIX</span>
          <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">{roleKey} Portal</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto bg-white">
        <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-[#1FAA59] hover:bg-green-50 mb-4 h-10">
               <Home className="w-4 h-4 mr-3" /> Return Home
            </Button>
        </Link>
        <div className="h-px bg-gray-100 my-2 mx-2"></div>

        {currentNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start transition-all duration-200 mb-1 h-11 ${
                  isActive
                    ? 'bg-[#1FAA59]/10 text-[#1FAA59] font-medium border-r-4 border-[#1FAA59] rounded-r-none' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-[#1FAA59]' : 'text-gray-400'}`} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 mb-4 px-2">
           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <UserCircle className="w-5 h-5" />
           </div>
           <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">Administrator</p>
              <p className="text-xs text-gray-500 truncate">admin@aasha.com</p>
           </div>
        </div>
        <Button variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30 shadow-sm h-16">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1FAA59] rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-gray-900 text-sm truncate">{title}</span>
         </div>
         <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
           {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
         </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      {/* Mobile Sidebar Menu */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden min-h-screen">
        {/* Breadcrumb / Title Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                 <Home className="w-3 h-3" /> 
                 <span>/</span>
                 <span className="capitalize">{location.pathname.split('/').filter(Boolean).join(' / ')}</span>
              </div>
           </div>
           {/* Top Actions Placeholder */}
           <div className="flex items-center gap-3">
              {/* Add global actions here if needed */}
           </div>
        </div>

        {children}
      </main>
    </div>
  );
};
