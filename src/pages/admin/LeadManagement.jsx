
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Phone, MapPin, Calendar, MoreHorizontal, FileDown } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

const LeadManagementContent = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  const fetchLeads = async () => {
    setLoading(true);
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (serviceFilter !== 'all') query = query.ilike('service', `%${serviceFilter}%`);
    
    const { data, error } = await query;
    
    if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch leads." });
    } else {
        setLeads(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, serviceFilter]);

  // Client-side search for name/mobile - Defensive Programming
  const filteredLeads = leads.filter(lead => {
    if (!lead) return false;
    const name = String(lead.name || '').toLowerCase();
    const mobile = String(lead.mobile || '');
    const search = String(searchTerm || '').toLowerCase();

    return name.includes(search) || mobile.includes(search);
  });

  const handleStatusUpdate = async (id, newStatus) => {
      const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
      if (!error) {
          toast({ title: "Updated", description: "Lead status updated." });
          setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
  };

  const exportToCSV = () => {
      const headers = ["Name", "Mobile", "Service", "Status", "Notes", "Date"];
      const csvContent = [
          headers.join(","),
          ...filteredLeads.map(l => [l.name, l.mobile, l.service, l.status, `"${l.notes || ''}"`, new Date(l.created_at).toLocaleDateString()].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "aasha_leads_export.csv");
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Leads CRM</h1>
                <p className="text-gray-500 text-sm">Manage and track patient inquiries.</p>
            </div>
            <Button variant="outline" onClick={exportToCSV} className="border-green-200 text-green-700 hover:bg-green-50">
                <FileDown className="w-4 h-4 mr-2" /> Export CSV
            </Button>
        </div>

        {/* Filters & Search */}
        <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search name or mobile..." 
                        className="pl-9 bg-white" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Service Interest" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                        <SelectItem value="Home Collection">Home Collection</SelectItem>
                        <SelectItem value="Telemedicine">Telemedicine</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="secondary" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setServiceFilter('all'); }}>
                    <Filter className="w-4 h-4 mr-2" /> Reset
                </Button>
            </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading leads data...</div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No leads found matching criteria.</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Name / Contact</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{lead.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center mt-1">
                                            <Phone className="w-3 h-3 mr-1" /> {lead.mobile}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-100">
                                            {lead.service}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Select 
                                            defaultValue={lead.status} 
                                            onValueChange={(val) => handleStatusUpdate(lead.id, val)}
                                        >
                                            <SelectTrigger className={`h-8 w-[130px] border-0 text-xs font-semibold rounded-full ${
                                                lead.status === 'New' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                                lead.status === 'Converted' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                lead.status === 'Lost' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                                'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="New">New</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Converted">Converted</SelectItem>
                                                <SelectItem value="Lost">Lost</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
      </div>
  );
};

const LeadManagement = () => {
    return (
        <DashboardLayout title="Leads CRM">
            <ErrorBoundary>
                <LeadManagementContent />
            </ErrorBoundary>
        </DashboardLayout>
    );
};

export default LeadManagement;
