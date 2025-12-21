
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Search, Edit, Trash2, Mail, Phone, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

const StaffManagementContent = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    status: 'Active'
  });

  const roles = [
    { value: 'lab', label: 'Lab Technician' },
    { value: 'phlebotomist', label: 'Phlebotomist' },
    { value: 'reception', label: 'Receptionist' },
    { value: 'admin', label: 'Administrator' },
    { value: 'doctor', label: 'Doctor' }
  ];

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaffList(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load staff list.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.email || !formData.full_name || !formData.role) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Name, Email and Role are required.'
      });
      return;
    }

    setSaveLoading(true);
    try {
      if (currentStaff) {
        // Update
        const { error } = await supabase
          .from('staff')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            phone: formData.phone,
            department: formData.department,
            status: formData.status
          })
          .eq('id', currentStaff.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Staff member updated.' });
      } else {
        // Create (In a real app, this should likely interact with Auth too, or use an Edge Function)
        // For now, we insert into public profile. Note: Actual auth user creation is separate.
        const { error } = await supabase
          .from('staff')
          .insert([{ ...formData, created_at: new Date() }]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Staff member added.' });
      }

      await fetchStaff();
      setIsAddOpen(false);
      setIsEditOpen(false);
      resetForm();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save staff member.'
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Staff member removed.' });
      fetchStaff();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete staff member.'
      });
    }
  };

  const openEdit = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      full_name: staff.full_name || '',
      email: staff.email || '',
      role: staff.role || '',
      phone: staff.phone || '',
      department: staff.department || '',
      status: staff.status || 'Active'
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setCurrentStaff(null);
    setFormData({
      full_name: '',
      email: '',
      role: '',
      phone: '',
      department: '',
      status: 'Active'
    });
  };

  // Safe Filtering
  const filteredStaff = staffList.filter(staff => {
    if (!staff) return false;
    const search = (searchTerm || '').toLowerCase();
    const name = (staff.full_name || '').toLowerCase();
    const email = (staff.email || '').toLowerCase();
    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-1 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search staff..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-[#1FAA59] hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array(6).fill(0).map((_, i) => (
             <Card key={i} className="h-40 animate-pulse bg-gray-100 border-0" />
           ))
        ) : filteredStaff.length === 0 ? (
           <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed text-gray-500">
             No staff members found.
           </div>
        ) : (
          filteredStaff.map((staff) => (
            <Card key={staff.id} className="overflow-hidden hover:shadow-md transition-all group border-l-4 border-l-[#1FAA59]">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1FAA59] font-bold text-lg">
                    {staff.full_name ? staff.full_name.charAt(0) : '?'}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {staff.status || 'Active'}
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 truncate">{staff.full_name || 'Unknown'}</h3>
                <p className="text-sm text-gray-500 mb-4 capitalize">{staff.role || 'No Role'}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{staff.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                    <span className="capitalize">{staff.department || 'General'}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(staff)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(staff.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(v) => !v && (setIsAddOpen(false), setIsEditOpen(false))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentStaff ? 'Edit Staff Member' : 'Add New Staff'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="staff@aashamedix.com" disabled={!!currentStaff} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={formData.role} onValueChange={v => setFormData({...formData, role: v})}>
                  <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Pathology, Reception" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}>Cancel</Button>
            <Button onClick={handleSave} className="bg-[#1FAA59] hover:bg-green-700" disabled={saveLoading}>
              {saveLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save Staff Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StaffManagement = () => {
  return (
    <DashboardLayout title="Staff Directory">
      <ErrorBoundary>
        <StaffManagementContent />
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default StaffManagement;
