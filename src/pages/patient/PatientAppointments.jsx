
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null); // ID of appointment to cancel

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    const { data: patientData } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
    
    if (patientData) {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('appointment_date', { ascending: false });
      
      if (data) setAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const confirmCancel = async () => {
    if (!cancelId) return;
    
    const { error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', cancelId);
    
    if (!error) {
        toast({ title: "Cancelled", description: "Appointment cancelled successfully." });
        setAppointments(prev => prev.map(a => a.id === cancelId ? { ...a, status: 'Cancelled' } : a));
    } else {
        toast({ title: "Error", description: "Could not cancel appointment.", variant: "destructive" });
    }
    setCancelId(null);
  };

  return (
    <DashboardLayout title="My Appointments">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <Link to="/book-appointment">
          <Button className="bg-green-600 hover:bg-green-700 shadow-md">Book New</Button>
        </Link>
      </div>

      {loading ? <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div> : (
        <div className="grid gap-4">
          {appointments.length > 0 ? appointments.map((apt) => (
            <Card key={apt.id} className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">{apt.service_type}</h3>
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                           apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                           apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                           'bg-blue-100 text-blue-700'
                       }`}>
                           {apt.status}
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-green-600" /> {new Date(apt.appointment_date).toLocaleDateString()}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-green-600" /> {apt.appointment_time}</span>
                    </div>
                    
                    {apt.service_type === 'Home Collection' && (
                        <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin className="w-4 h-4 mr-1" /> Home Visit</p>
                    )}
                    {apt.service_type === 'Telemedicine' && (
                        <p className="text-sm text-gray-500 flex items-center mt-1"><Video className="w-4 h-4 mr-1" /> Video Call</p>
                    )}
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <>
                            <Dialog open={cancelId === apt.id} onOpenChange={(open) => !open && setCancelId(null)}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full md:w-auto border-red-200 text-red-600 hover:bg-red-50" onClick={() => setCancelId(apt.id)}>
                                    <XCircle className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cancel Appointment?</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to cancel your {apt.service_type} on {new Date(apt.appointment_date).toLocaleDateString()}? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setCancelId(null)}>Keep Appointment</Button>
                                  <Button variant="destructive" onClick={confirmCancel}>Yes, Cancel</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Button size="sm" variant="outline" className="w-full md:w-auto" onClick={() => toast({ title: "Contact Support", description: "Please call +91 8332030109 to reschedule." })}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Reschedule
                            </Button>
                        </>
                    )}
                    {apt.status === 'Completed' && (
                        <Link to="/patient/reports">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">View Report</Button>
                        </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
             <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                 <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                 <p className="text-gray-500">No appointments found.</p>
                 <Link to="/book-appointment" className="text-green-600 font-semibold hover:underline mt-2 inline-block">Book your first appointment</Link>
             </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientAppointments;
