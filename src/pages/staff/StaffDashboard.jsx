
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { MapPin, Video, CheckCircle, Phone, User, FlaskConical, ClipboardList, ListTodo } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import StaffBookingQueue from '@/components/StaffBookingQueue';
import { getBookingStats } from '@/utils/staffService';

const StaffDashboard = () => {
  const { userRole, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch appointments with patient details
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patients(name, mobile, address)')
        .order('appointment_date', { ascending: true });
      
      if (data) setAppointments(data);

      // Fetch booking statistics
      const bookingStats = await getBookingStats();
      setStats(bookingStats);

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      toast({ 
        title: "Status Updated", 
        description: `Appointment marked as ${newStatus}` 
      });
      setAppointments(prev => 
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );
    }
  };

  const renderPhlebotomistView = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Phlebotomist Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-orange-900 font-bold">Today's Visits</h3>
                        <MapPin className="text-orange-600 w-6 h-6" />
                    </div>
                    <p className="text-4xl font-extrabold text-orange-700">{appointments.filter(a => a.service_type === 'Home Sample Collection').length}</p>
                </CardContent>
            </Card>
             <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-green-900 font-bold">Completed</h3>
                        <CheckCircle className="text-green-600 w-6 h-6" />
                    </div>
                    <p className="text-4xl font-extrabold text-green-700">{appointments.filter(a => a.status === 'Completed').length}</p>
                </CardContent>
            </Card>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mt-4">Home Collection Tasks</h2>
        <div className="space-y-4">
            {appointments.filter(a => a.service_type === 'Home Sample Collection').map(apt => (
                <Card key={apt.id} className="hover:shadow-md transition-all border-l-4 border-l-orange-400">
                    <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="bg-orange-100 p-3 rounded-full h-fit"><User className="w-6 h-6 text-orange-600" /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{apt.patients?.name || 'Unknown Patient'}</h4>
                                <div className="flex items-center text-gray-600 text-sm mt-1 font-medium">
                                    <MapPin className="w-4 h-4 mr-1 text-orange-500" /> {apt.patients?.address || 'No Address'}
                                </div>
                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <Phone className="w-4 h-4 mr-1" /> {apt.patients?.mobile}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                            <span className={`text-center text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide ${
                                apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{apt.status}</span>
                            
                            {apt.status !== 'Completed' && (
                                <Button size="sm" onClick={() => handleStatusChange(apt.id, 'Completed')} className="bg-green-600 hover:bg-green-700 font-semibold">
                                    Sample Collected
                                </Button>
                            )}
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apt.patients?.address)}`)}>
                                Open Map
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );

  const renderDoctorView = () => (
     <div className="space-y-6">
         <h1 className="text-2xl font-bold text-gray-900">Doctor's Console</h1>
         <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-purple-900 font-bold">Tele-Consults</h3>
                        <Video className="text-purple-600 w-6 h-6" />
                    </div>
                    <p className="text-4xl font-extrabold text-purple-700">{appointments.filter(a => a.service_type === 'Telemedicine Consultation').length}</p>
                </CardContent>
            </Card>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mt-4">Appointment Queue</h2>
        <div className="space-y-4">
            {appointments.filter(a => a.service_type === 'Telemedicine Consultation').map(apt => (
                <Card key={apt.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="bg-purple-100 p-3 rounded-full h-fit"><Video className="w-6 h-6 text-purple-600" /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{apt.patients?.name}</h4>
                                <p className="text-sm font-medium text-gray-600 mt-1">Scheduled: {apt.appointment_time}</p>
                                <p className="text-xs text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded-md inline-block font-semibold">General Consultation</p>
                            </div>
                        </div>
                         <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full font-semibold" onClick={() => toast({ title: "Starting Call...", description: "Connecting secure line." })}>
                                Start Video Call
                            </Button>
                             <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => toast({ title: "Prescription", description: "Upload interface opened." })}>
                                Upload Rx
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
     </div>
  );

   const renderLabTechView = () => (
     <div className="space-y-6">
         <h1 className="text-2xl font-bold text-gray-900">Lab Technician Dashboard</h1>
         <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-blue-900 font-bold">Samples Processing</h3>
                        <FlaskConical className="text-blue-600 w-6 h-6" />
                    </div>
                    <p className="text-4xl font-extrabold text-blue-700">{appointments.filter(a => a.status === 'Completed').length}</p>
                </CardContent>
            </Card>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mt-4">Pending Reports</h2>
        <div className="space-y-4">
             {/* Mocking pending reports based on completed appointments */}
            {appointments.filter(a => a.status === 'Completed').map(apt => (
                <Card key={apt.id} className="border-l-4 border-l-blue-400">
                    <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="bg-blue-100 p-3 rounded-full h-fit"><ClipboardList className="w-6 h-6 text-blue-600" /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{apt.patients?.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">Collected: {new Date(apt.appointment_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                         <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full font-semibold" onClick={() => toast({ title: "Upload Report", description: "Opening file uploader..." })}>
                                Upload PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
     </div>
  );

  return (
    <DashboardLayout role="staff" title={`${userRole} Portal`}>
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            Booking Queue
          </TabsTrigger>
          <TabsTrigger value="phlebotomist">
            Phlebotomist
          </TabsTrigger>
          <TabsTrigger value="tech">
            Lab Tech
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          <StaffBookingQueue />
        </TabsContent>

        <TabsContent value="phlebotomist">
          {renderPhlebotomistView()}
        </TabsContent>

        <TabsContent value="tech">
          {renderLabTechView()}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StaffDashboard;
