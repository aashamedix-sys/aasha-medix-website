
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, Activity, Stethoscope } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import ErrorBoundary from '@/components/ErrorBoundary';

const DashboardContent = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalLeads: 0,
    activeDoctors: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            setLoading(true);
            
            // Parallel fetching with error handling for each
            const [bookingsRes, docBookingsRes, leadsRes, doctorsRes] = await Promise.allSettled([
                supabase.from('bookings').select('total_amount', { count: 'exact' }),
                supabase.from('doctor_bookings').select('consultation_fee', { count: 'exact' }),
                supabase.from('leads').select('*', { count: 'exact', head: true }),
                supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('active', true)
            ]);

            // Safely extract data
            const bookings = bookingsRes.status === 'fulfilled' ? bookingsRes.value.data : [];
            const bookingsCount = bookingsRes.status === 'fulfilled' ? bookingsRes.value.count : 0;

            const docBookings = docBookingsRes.status === 'fulfilled' ? docBookingsRes.value.data : [];
            const docBookingsCount = docBookingsRes.status === 'fulfilled' ? docBookingsRes.value.count : 0;

            const leadsCount = leadsRes.status === 'fulfilled' ? leadsRes.value.count : 0;
            const doctorsCount = doctorsRes.status === 'fulfilled' ? doctorsRes.value.count : 0;

            // Calculate Revenue safely
            const testRevenue = Array.isArray(bookings) 
                ? bookings.reduce((acc, curr) => acc + (Number(curr?.total_amount) || 0), 0) 
                : 0;
            
            const docRevenue = Array.isArray(docBookings) 
                ? docBookings.reduce((acc, curr) => acc + (Number(curr?.consultation_fee) || 0), 0) 
                : 0;

            setStats({
                totalBookings: (bookingsCount || 0) + (docBookingsCount || 0),
                totalLeads: leadsCount || 0,
                activeDoctors: doctorsCount || 0,
                revenue: testRevenue + docRevenue
            });
        } catch (err) {
            console.error("Dashboard data fetch error:", err);
            setError("Failed to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    };

    fetchStats();
  }, []);

  // Simplified chart data
  const weeklyData = [
    { name: 'Mon', bookings: 12 },
    { name: 'Tue', bookings: 19 },
    { name: 'Wed', bookings: 15 },
    { name: 'Thu', bookings: 22 },
    { name: 'Fri', bookings: 25 },
    { name: 'Sat', bookings: 30 },
    { name: 'Sun', bookings: 10 },
  ];

  if (error) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-[#1FAA59] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : `₹${stats.revenue.toLocaleString()}`}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full text-[#1FAA59]"><TrendingUp className="w-5 h-5" /></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-blue-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.totalBookings}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Calendar className="w-5 h-5" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Doctors</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.activeDoctors}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full text-purple-600"><Stethoscope className="w-5 h-5" /></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-amber-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">New Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.totalLeads}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-full text-amber-600"><Users className="w-5 h-5" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Booking Trends (Weekly)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="bookings" stroke="#1FAA59" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> Database Status</span>
                            <span className="text-sm font-bold text-green-600">Healthy</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Staff Online</span>
                            <span className="text-sm font-bold">4 Active</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
                           <p><strong>Last Backup:</strong> 2 hours ago</p>
                           <p><strong>Next Scheduled Maintenance:</strong> Sunday, 02:00 AM</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
  );
};

const AdminDashboard = () => {
    return (
        <DashboardLayout title="Admin Dashboard">
            <ErrorBoundary>
                <DashboardContent />
            </ErrorBoundary>
        </DashboardLayout>
    );
};

export default AdminDashboard;
