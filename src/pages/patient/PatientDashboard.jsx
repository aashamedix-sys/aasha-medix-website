
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, Activity, Plus, Phone, ArrowRight, Receipt, MessageSquare, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import BookingTracker from '@/pages/BookingTracker';
import PaymentDashboard from '@/pages/PaymentDashboard';
import ChatList from '@/components/ChatList';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Fetch patient profile
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (patientError && !patientError.message.includes('does not exist')) {
          console.warn('Patient fetch error:', patientError);
        }

        if (patientData) {
          setPatient(patientData);
          
          // Try to fetch appointments
          try {
            const { data: appointmentsData, error: appointError } = await supabase
              .from('appointments')
              .select('*')
              .eq('patient_id', patientData.id)
              .order('appointment_date', { ascending: false })
              .limit(10);
            
            if (appointError && !appointError.message.includes('does not exist')) {
              console.warn('Appointments error:', appointError);
            }
            if (appointmentsData) setAppointments(appointmentsData);
          } catch (e) {
            console.warn('Appointments table not available:', e);
          }

          // Try to fetch reports
          try {
            const { data: reportsData, error: reportError } = await supabase
              .from('reports')
              .select('*')
              .eq('patient_id', patientData.id)
              .order('report_date', { ascending: false })
              .limit(10);
            
            if (reportError && !reportError.message.includes('does not exist')) {
              console.warn('Reports error:', reportError);
            }
            if (reportsData) setReports(reportsData);
          } catch (e) {
            console.warn('Reports table not available:', e);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('PatientDashboard error:', err);
        setError(err.message || 'Failed to load dashboard');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  if (loading) return (
    <DashboardLayout title="Patient Portal">
       <div className="flex flex-col items-center justify-center h-64 gap-4">
         <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
         <p className="text-gray-600 font-medium">Loading your dashboard...</p>
       </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout title="Patient Portal">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-semibold">Error: {error}</p>
        <p className="text-sm mt-2">Some features may not be available. Please refresh the page.</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Patient Portal">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-2xl border border-green-100 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {patient?.full_name?.split(' ')[0] || 'Patient'}! 👋</h1>
            <p className="text-gray-600">Your health records are secure with AASHA MEDIX.</p>
          </div>
          <div className="flex gap-3">
             <Link to="/book-appointment">
                <Button className="bg-[#1FAA59] hover:bg-[#168a46] shadow-md shadow-green-200 text-white rounded-full px-6">
                <Plus className="w-4 h-4 mr-2" /> Book Test / Consult
                </Button>
             </Link>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white border-l-4 border-blue-500 shadow-sm">
                <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <Calendar className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Appointments</p>
                    <p className="text-3xl font-bold text-slate-900">{appointments.filter(a => new Date(a.appointment_date) >= new Date()).length}</p>
                </div>
                </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="bg-white border-l-4 border-green-500 shadow-sm">
                <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-full text-green-600">
                    <FileText className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Reports</p>
                    <p className="text-3xl font-bold text-slate-900">{reports.length}</p>
                </div>
                </CardContent>
            </Card>
          </motion.div>

           <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
             <Card className="bg-white border-l-4 border-purple-500 shadow-sm">
                <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                    <Activity className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Health Status</p>
                    <p className="text-xl font-bold text-slate-900">Active</p>
                </div>
                </CardContent>
            </Card>
           </motion.div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Appointments */}
              <Card className="shadow-md border-0">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50 rounded-t-lg">
                  <CardTitle className="text-lg font-bold text-gray-800">Recent Appointments</CardTitle>
                  <Link to="/patient/appointments" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {appointments.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {appointments.slice(0, 3).map((apt) => (
                        <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                                 {apt.service_type?.includes('Telemedicine') ? <Phone className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                             </div>
                             <div>
                                <p className="font-semibold text-slate-900 text-sm">{apt.service_type}</p>
                                <p className="text-xs text-gray-500">{new Date(apt.appointment_date).toLocaleDateString()} • {apt.appointment_time}</p>
                             </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No appointment history found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Latest Reports */}
              <Card className="shadow-md border-0">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50 rounded-t-lg">
                  <CardTitle className="text-lg font-bold text-gray-800">Latest Reports</CardTitle>
                  <Link to="/patient/reports" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {reports.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {reports.slice(0, 3).map((report) => (
                        <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                 <FileText className="w-5 h-5" />
                             </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{report.test_name}</p>
                              <p className="text-xs text-gray-500">{new Date(report.report_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Link to="/patient/reports">
                             <Button variant="outline" size="sm" className="h-8 text-xs">View</Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No medical reports available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <BookingTracker userId={user?.id} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentDashboard userId={user?.id} />
          </TabsContent>

          <TabsContent value="messages">
            <ChatList />
          </TabsContent>

          <TabsContent value="reports">
            <Card className="shadow-md border-0">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-lg font-bold text-gray-800">Medical Reports</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {reports.length > 0 ? (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-50 p-3 rounded-lg text-green-600">
                               <FileText className="w-6 h-6" />
                           </div>
                          <div>
                            <p className="font-semibold text-slate-900">{report.test_name}</p>
                            <p className="text-sm text-gray-500">{new Date(report.report_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Download PDF</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="font-medium">No medical reports available yet.</p>
                      <p className="text-sm">Your test results will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
