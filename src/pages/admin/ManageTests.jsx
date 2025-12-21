
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Loader2, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import ErrorBoundary from '@/components/ErrorBoundary';

const ManageTestsContent = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    test_name: '', // Fixed: Changed from name to test_name based on DB schema inferred
    category: '',
    mrp: '',
    description: '',
    status: 'Active' // Fixed: Changed from boolean active to string status
  });

  const categories = [
    "Blood", "Diabetes", "Cardiac", "Hormones", "Liver", 
    "Kidney", "Vitamins", "Thyroid", "Allergy", "Infection", 
    "Bone", "Nerve", "General"
  ];

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
     setLoading(true);
     try {
         // Sort by ID to keep T001, T002 etc in order
         const { data, error } = await supabase
            .from('tests')
            .select('*')
            .order('id', { ascending: true });
         
         if (error) throw error;
         setTests(data || []);
     } catch (error) {
         console.error("Error fetching tests:", error);
         toast({ title: "Error", description: "Failed to load tests", variant: "destructive" });
     } finally {
         setLoading(false);
     }
  };

  // DEFENSIVE FILTERING LOGIC
  const filteredTests = tests.filter(test => {
     if (!test) return false;
     
     const search = String(searchTerm || '').toLowerCase();
     const testName = String(test.test_name || '').toLowerCase();
     const testId = String(test.id || '').toLowerCase();
     
     const matchSearch = testName.includes(search) || testId.includes(search);
     const matchCat = categoryFilter === 'all' || test.category === categoryFilter;
     
     return matchSearch && matchCat;
  });

  const handleSave = async () => {
     if (!formData.id || !formData.test_name || !formData.mrp || !formData.category) {
        toast({ title: "Validation Error", description: "ID, Name, MRP and Category are required", variant: "destructive" });
        return;
     }

     setSaveLoading(true);
     try {
        if (currentTest) {
            // Update
            const { error } = await supabase
                .from('tests')
                .update({
                    test_name: formData.test_name,
                    category: formData.category,
                    mrp: formData.mrp,
                    description: formData.description,
                    status: formData.status
                })
                .eq('id', currentTest.id);
            
            if (error) throw error;
            toast({ title: "Updated", description: "Test updated successfully" });
        } else {
            // Create
            const { error } = await supabase
                .from('tests')
                .insert([{
                    id: formData.id,
                    test_name: formData.test_name,
                    category: formData.category,
                    mrp: formData.mrp,
                    description: formData.description,
                    status: formData.status,
                    created_at: new Date()
                }]);
            
            if (error) throw error;
            toast({ title: "Created", description: "Test created successfully" });
        }
        
        await fetchTests();
        setIsAddOpen(false);
        setIsEditOpen(false);
        resetForm();
     } catch (error) {
        console.error("Error saving test:", error);
        toast({ title: "Error", description: error.message || "Failed to save test", variant: "destructive" });
     } finally {
        setSaveLoading(false);
     }
  };

  const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this test?")) return;
      
      try {
          const { error } = await supabase.from('tests').delete().eq('id', id);
          if (error) throw error;
          toast({ title: "Deleted", description: "Test deleted successfully" });
          fetchTests();
      } catch (error) {
          toast({ title: "Error", description: "Failed to delete test. It might be linked to existing bookings.", variant: "destructive" });
      }
  };

  const openEdit = (test) => {
      setCurrentTest(test);
      setFormData({
          id: test.id,
          test_name: test.test_name || test.name || '',
          category: test.category || '',
          mrp: test.mrp || '',
          description: test.description || '',
          status: test.status || 'Active'
      });
      setIsEditOpen(true);
  };

  const resetForm = () => {
      setFormData({ 
        id: '', 
        test_name: '', 
        category: '', 
        mrp: '', 
        description: '', 
        status: 'Active' 
      });
      setCurrentTest(null);
  };

  return (
       <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex flex-1 gap-4">
                <div className="relative w-full md:w-64">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                   <Input 
                      placeholder="Search test name/code..." 
                      className="pl-9" 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                   />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                   <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                   </SelectContent>
                </Select>
             </div>
             <div className="flex gap-2">
                 <Button variant="outline" onClick={fetchTests}><RefreshCcw className="w-4 h-4 mr-2" /> Refresh</Button>
                 <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-[#1FAA59] hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Test
                 </Button>
             </div>
          </div>

          <Card className="overflow-hidden border-gray-200">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Code</th>
                        <th className="px-6 py-4">Test Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Price (₹)</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1FAA59]" /></td></tr>
                    ) : filteredTests.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No tests found.</td></tr>
                    ) : (
                        filteredTests.map(test => (
                            <tr key={test.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono font-bold text-gray-700">{test.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {test.test_name || test.name}
                                    {test.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{test.description}</p>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">{test.category}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">{test.mrp}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${test.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="text-xs text-gray-600">{test.status}</span>
                                </td>
                                <td className="px-6 py-4 flex justify-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => openEdit(test)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(test.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
             </div>
          </Card>

          <Dialog open={isAddOpen || isEditOpen} onOpenChange={(v) => !v && (setIsAddOpen(false), setIsEditOpen(false))}>
             <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>{currentTest ? 'Edit Test' : 'Add New Test'}</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Test Code (Unique)</label>
                         <Input 
                            value={formData.id} 
                            onChange={e => setFormData({...formData, id: e.target.value})} 
                            placeholder="e.g. T001" 
                            disabled={!!currentTest} 
                            className="font-mono uppercase"
                        />
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Price (₹)</label>
                         <Input type="number" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} placeholder="0.00" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">Test Name</label>
                        <Input value={formData.test_name} onChange={e => setFormData({...formData, test_name: e.target.value})} placeholder="Full test name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Status</label>
                         <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                         </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Textarea 
                            value={formData.description || ''} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            placeholder="Brief details about the test..." 
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                   <Button variant="outline" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}>Cancel</Button>
                   <Button onClick={handleSave} className="bg-[#1FAA59] hover:bg-green-700" disabled={saveLoading}>
                       {saveLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save Test'}
                   </Button>
                </DialogFooter>
             </DialogContent>
          </Dialog>
       </div>
  );
};

const ManageTests = () => {
    return (
        <DashboardLayout title="Manage Tests">
            <ErrorBoundary>
                <ManageTestsContent />
            </ErrorBoundary>
        </DashboardLayout>
    );
};

export default ManageTests;
