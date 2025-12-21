
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

const ManageDoctorsContent = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    qualification: '',
    experience_years: '',
    consultation_fee: '',
    rating: '5.0',
    email: '',
    phone: '',
    image_url: '',
    active: true
  });

  const specialties = [
    "General Physician", "Gynecologist", "Dermatologist", "Pediatrician", 
    "Orthopedic", "ENT Specialist", "Psychiatrist", "Cardiologist", 
    "Neurologist", "Ophthalmologist"
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setDoctors(data || []);
    } catch (error) {
        console.error("Fetch doctors error:", error);
        toast({ title: "Error", description: "Failed to fetch doctors", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentDoctor) {
        // Edit Mode
        const { error } = await supabase
          .from('doctors')
          .update(formData)
          .eq('id', currentDoctor.id);
        if (error) throw error;
        toast({ title: "Success", description: "Doctor updated successfully" });
      } else {
        // Add Mode
        const { error } = await supabase
          .from('doctors')
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Success", description: "Doctor added successfully" });
      }
      
      setIsAddOpen(false);
      setIsEditOpen(false);
      fetchDoctors();
      resetForm();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    
    try {
        const { error } = await supabase.from('doctors').delete().eq('id', id);
        if (error) throw error;
        toast({ title: "Deleted", description: "Doctor record removed." });
        fetchDoctors();
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete doctor", variant: "destructive" });
    }
  };

  const openEdit = (doctor) => {
    setCurrentDoctor(doctor);
    setFormData(doctor);
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setCurrentDoctor(null);
    setFormData({
      name: '',
      specialty: '',
      qualification: '',
      experience_years: '',
      consultation_fee: '',
      rating: '5.0',
      email: '',
      phone: '',
      image_url: '',
      active: true
    });
  };

  // DEFENSIVE FILTERING LOGIC - FIXES THE BUG
  const filteredDoctors = doctors.filter(doc => {
    if (!doc) return false;
    
    // Safely handle potentially missing or non-string properties
    const docName = String(doc.name || '').toLowerCase();
    const search = String(searchTerm || '').toLowerCase();
    
    const matchesSearch = docName.includes(search);
    const matchesSpecialty = specialtyFilter === 'all' || doc.specialty === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  });

  return (
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-1 gap-4 w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by name..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">All Specialties</SelectItem>
                   {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
             </Select>
          </div>
          
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-[#1FAA59] hover:bg-green-700 w-full md:w-auto">
             <Plus className="w-4 h-4 mr-2" /> Add Doctor
          </Button>
        </div>

        {/* Doctors Grid */}
        {loading ? (
           <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1FAA59]" /></div>
        ) : filteredDoctors.length === 0 ? (
           <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">
             {doctors.length === 0 ? "No doctors in database." : "No doctors found matching criteria."}
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map(doctor => (
                 <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-all group">
                    <div className="p-6">
                       <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${doctor.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                             {doctor.name ? doctor.name.charAt(0) : '?'}
                          </div>
                          <div className="flex gap-1">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => openEdit(doctor)}>
                                <Edit className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(doctor.id)}>
                                <Trash2 className="w-4 h-4" />
                             </Button>
                          </div>
                       </div>
                       
                       <h3 className="font-bold text-gray-900 truncate" title={doctor.name}>{doctor.name || "Unknown Name"}</h3>
                       <p className="text-sm text-[#1FAA59] font-medium mb-2">{doctor.specialty || "General"}</p>
                       
                       <div className="space-y-1 text-sm text-gray-500 mb-4">
                          <p>{doctor.qualification || "N/A"}</p>
                          <p>{doctor.experience_years || 0} Years Exp.</p>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-yellow-600 text-xs font-bold">
                             <Star className="w-3 h-3 fill-current" /> {doctor.rating || "5.0"}
                          </div>
                          <div className="font-bold text-gray-900">₹{doctor.consultation_fee || 0}</div>
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isAddOpen || isEditOpen} onOpenChange={(val) => !val && (isAddOpen ? setIsAddOpen(false) : setIsEditOpen(false))}>
           <DialogContent className="max-w-2xl">
              <DialogHeader>
                 <DialogTitle>{currentDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input name="name" value={formData.name} onChange={handleInputChange} required />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Specialty</label>
                    <Select value={formData.specialty} onValueChange={(val) => setFormData(p => ({...p, specialty: val}))}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                           {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Qualification</label>
                    <Input name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. MBBS, MD" required />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Experience (Years)</label>
                    <Input name="experience_years" type="number" value={formData.experience_years} onChange={handleInputChange} required />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Fee (₹)</label>
                    <Input name="consultation_fee" type="number" value={formData.consultation_fee} onChange={handleInputChange} required />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input name="phone" value={formData.phone} onChange={handleInputChange} />
                 </div>
                 <div className="col-span-2 space-y-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} className="w-4 h-4 text-[#1FAA59] rounded" />
                        <span className="text-sm font-medium">Available for Booking</span>
                     </label>
                 </div>

                 <div className="col-span-2 flex justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}>Cancel</Button>
                    <Button type="submit" className="bg-[#1FAA59] hover:bg-green-700">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (currentDoctor ? 'Update Doctor' : 'Save Doctor')}
                    </Button>
                 </div>
              </form>
           </DialogContent>
        </Dialog>
      </div>
  );
};

const ManageDoctors = () => {
    return (
        <DashboardLayout title="Manage Doctors">
            <ErrorBoundary>
                <ManageDoctorsContent />
            </ErrorBoundary>
        </DashboardLayout>
    );
};

export default ManageDoctors;
