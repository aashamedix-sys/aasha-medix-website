
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, CheckCircle, XCircle, Stethoscope, TestTube, Eye, Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ViewBookings = () => {
  const [testBookings, setTestBookings] = useState([]);
  const [doctorBookings, setDoctorBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const fetchBookings = async () => {
    setLoading(true);
    
    // Fetch Diagnostic Bookings
    const { data: tests, error: testError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
    
    // Fetch Doctor Consultations
    const { data: docs, error: docError } = await supabase
        .from('doctor_bookings')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (testError || docError) {
        console.error("Error fetching bookings:", testError || docError);
        toast({ title: "Error", description: "Failed to load bookings", variant: "destructive" });
    }

    setTestBookings(tests || []);
    setDoctorBookings(docs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (table, id, status) => {
     const { error } = await supabase.from(table).update({ status }).eq('id', id);
     if (!error) {
        toast({ title: "Updated", description: `Booking marked as ${status}` });
        fetchBookings(); // Refresh to ensure data consistency
     } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
     }
  };

  // Normalize and merge for "All" view
  const allBookings = [
      ...testBookings.map(b => ({ ...b, type: 'Test', title: Array.isArray(b.test_names) ? b.test_names.join(', ') : b.test_names, table: 'bookings' })),
      ...doctorBookings.map(b => ({ ...b, type: 'Consultation', title: `Dr. ${b.doctor_id}`, table: 'doctor_bookings' })) // Ideally join doctor name
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filterData = (data) => {
      return data.filter(b => {
        const matchSearch = (b.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (b.reference_number || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || (b.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
        return matchSearch && matchStatus;
     });
  };

  const displayedBookings = filterData(
      activeTab === 'all' ? allBookings : 
      activeTab === 'tests' ? allBookings.filter(b => b.type === 'Test') : 
      allBookings.filter(b => b.type === 'Consultation')
  );

  return (
    <DashboardLayout title="View Bookings">
       <div className="space-y-6">
          <Card className="p-4">
             <div className="flex flex-col md:flex-row gap-4 justify-between">
                 <div className="flex flex-col sm:flex-row gap-4 flex-1">
                     <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                           placeholder="Search patient name or Ref ID..." 
                           className="pl-9" 
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Status</SelectItem>
                           <SelectItem value="pending">Pending</SelectItem>
                           <SelectItem value="confirmed">Confirmed</SelectItem>
                           <SelectItem value="completed">Completed</SelectItem>
                           <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                     </Select>
                 </div>
                 
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="tests">Lab Tests</TabsTrigger>
                        <TabsTrigger value="consultations">Doctor Consults</TabsTrigger>
                    </TabsList>
                 </Tabs>
             </div>
          </Card>

          <Card className="overflow-hidden border-gray-200">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Ref ID / Type</th>
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-6 py-4">Service Details</th>
                        <th className="px-6 py-4">Schedule</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1FAA59]" /></td></tr>
                    ) : displayedBookings.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No bookings found.</td></tr>
                    ) : (
                        displayedBookings.map(booking => (
                            <tr key={`${booking.table}-${booking.id}`} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs text-gray-500">{booking.reference_number}</div>
                                    <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded mt-1 ${
                                        booking.type === 'Test' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                    }`}>
                                        {booking.type === 'Test' ? <TestTube className="w-3 h-3" /> : <Stethoscope className="w-3 h-3" />}
                                        {booking.type}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{booking.patient_name}</div>
                                    <div className="text-xs text-gray-500">{booking.phone}</div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="truncate text-gray-700 font-medium" title={booking.title}>
                                        {booking.title || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {booking.type === 'Test' ? 'Home Collection' : 'Video Consult'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {booking.booking_date}</div>
                                    <div className="text-xs pl-4">{booking.booking_time}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        (booking.status || 'pending') === 'completed' ? 'bg-green-100 text-green-700' :
                                        (booking.status || 'pending') === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                        (booking.status || 'pending') === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {booking.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(booking.table, booking.id, 'confirmed')} title="Confirm" disabled={booking.status === 'confirmed'}>
                                            <CheckCircle className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(booking.table, booking.id, 'completed')} title="Complete" disabled={booking.status === 'completed'}>
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(booking.table, booking.id, 'cancelled')} title="Cancel" disabled={booking.status === 'cancelled'}>
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
             </div>
          </Card>
       </div>
    </DashboardLayout>
  );
};

export default ViewBookings;
