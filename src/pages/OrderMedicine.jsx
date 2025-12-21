
import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Upload, FileText, CheckCircle, Trash2, Pill, Loader2, Plus, Minus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { generateReferenceNumber } from '@/utils/notificationService';

// 30 Common Medicines Static List
const COMMON_MEDICINES = [
  { id: 1, name: "Paracetamol 650" },
  { id: 2, name: "Dolo 650" },
  { id: 3, name: "Pantoprazole 40" },
  { id: 4, name: "Omeprazole 20" },
  { id: 5, name: "Azithromycin 500" },
  { id: 6, name: "Amoxicillin 500" },
  { id: 7, name: "Cetirizine 10" },
  { id: 8, name: "Allegra 120" },
  { id: 9, name: "Montelukast LC" },
  { id: 10, name: "ORS Powder" },
  { id: 11, name: "Domperidone" },
  { id: 12, name: "Ondansetron" },
  { id: 13, name: "Metformin 500" },
  { id: 14, name: "Glimepiride 2 mg" },
  { id: 15, name: "Ecosprin 75" },
  { id: 16, name: "Atorvastatin 10" },
  { id: 17, name: "Rosuvastatin 10" },
  { id: 18, name: "Amlodipine 5 mg" },
  { id: 19, name: "Telmisartan 40" },
  { id: 20, name: "Vitamin D3 Tablets" },
  { id: 21, name: "B-Complex Syrup" },
  { id: 22, name: "Calcium + Vitamin D" },
  { id: 23, name: "Iron Folic Acid" },
  { id: 24, name: "Ibuprofen 400" },
  { id: 25, name: "Betadine Gargle" },
  { id: 26, name: "Cough Syrup (Ambroxol)" },
  { id: 27, name: "ORS Apple Flavor" },
  { id: 28, name: "Zinc Tablets" },
  { id: 29, name: "Multivitamin Tablets" },
  { id: 30, name: "Thyronorm 50 mcg" }
];

const OrderMedicine = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeds, setSelectedMeds] = useState({}); // { medId: quantity }
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [patientForm, setPatientForm] = useState({
    name: '',
    mobile: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewState, setViewState] = useState('select'); // 'select' | 'review'

  // Pre-fill user data
  useEffect(() => {
    if (user) {
       const fetchUserData = async () => {
         const { data } = await supabase.from('patients').select('full_name, mobile, address').eq('user_id', user.id).single();
         if (data) {
            setPatientForm(prev => ({
                ...prev,
                name: data.full_name || '',
                mobile: data.mobile || '',
                address: data.address || ''
            }));
         }
       };
       fetchUserData();
    }
  }, [user]);

  // Filter medicines
  const filteredMeds = useMemo(() => {
    if (!searchTerm.trim()) return COMMON_MEDICINES;
    return COMMON_MEDICINES.filter(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Handlers
  const handleMedToggle = (medId) => {
    setSelectedMeds(prev => {
      const newState = { ...prev };
      if (newState[medId]) {
        delete newState[medId];
      } else {
        newState[medId] = 1;
      }
      return newState;
    });
  };

  const updateQuantity = (medId, change) => {
    setSelectedMeds(prev => {
      const currentQty = prev[medId] || 0;
      const newQty = Math.max(1, Math.min(10, currentQty + change));
      return { ...prev, [medId]: newQty };
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validation
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB allowed.", variant: "destructive" });
      return;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid File Type", description: "Only PDF, JPG, PNG allowed.", variant: "destructive" });
      return;
    }
    
    setPrescriptionFile(file);
    toast({ title: "File Selected", description: file.name });
  };

  const handleFormChange = (e) => {
    setPatientForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateOrder = () => {
    if (Object.keys(selectedMeds).length === 0 && !prescriptionFile) {
      toast({ title: "Empty Order", description: "Please select medicines OR upload a prescription.", variant: "destructive" });
      return false;
    }
    if (!patientForm.name.trim()) {
      toast({ title: "Name Required", description: "Please enter patient name.", variant: "destructive" });
      return false;
    }
    if (!/^\d{10}$/.test(patientForm.mobile)) {
      toast({ title: "Invalid Mobile", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return false;
    }
    if (!patientForm.address.trim()) {
      toast({ title: "Address Required", description: "Please enter delivery address.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateOrder()) return;
    
    setIsSubmitting(true);
    let fileUrl = null;

    try {
      // 1. Upload File if exists
      if (prescriptionFile) {
        const fileName = `${Date.now()}-${prescriptionFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const { error: uploadError } = await supabase.storage
          .from('medicines_prescriptions')
          .upload(fileName, prescriptionFile, {
             cacheControl: '3600',
             upsert: false
          });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('medicines_prescriptions')
          .getPublicUrl(fileName);
          
        fileUrl = publicUrl;
      }

      // 2. Prepare Order Data
      const selectedItems = Object.keys(selectedMeds).map(id => {
         const med = COMMON_MEDICINES.find(m => m.id === parseInt(id));
         return { name: med.name, quantity: selectedMeds[id], price: null }; // Price is TBD
      });

      const refNum = generateReferenceNumber('MED');
      
      const orderData = {
        patient_name: patientForm.name,
        patient_phone: patientForm.mobile,
        patient_address: patientForm.address,
        notes: patientForm.notes,
        medicines: selectedItems,
        prescription_file_url: fileUrl,
        order_date: new Date().toISOString(),
        status: 'Pending',
        reference_number: refNum,
        // Optional link to user if logged in (handle error gracefully if not found)
      };

      if (user) {
         // Try to get patient ID
         const { data: pData } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
         if (pData) orderData.patient_id = pData.id;
      }

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('medicine_orders')
        .insert([orderData]);
        
      if (dbError) throw dbError;

      // 4. Redirect to Summary
      navigate('/order-summary', { 
        state: {
           type: 'Medicine',
           referenceNumber: refNum,
           items: selectedItems,
           totalAmount: null, // To be calculated by pharmacy
           patientDetails: patientForm,
           status: 'Received',
           date: new Date().toLocaleDateString(),
           time: new Date().toLocaleTimeString()
        }
      });

    } catch (err) {
      console.error("Order failed:", err);
      toast({ title: "Order Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (viewState === 'review') {
      const selectedList = Object.keys(selectedMeds).map(id => {
         const med = COMMON_MEDICINES.find(m => m.id === parseInt(id));
         return { ...med, quantity: selectedMeds[id] };
      });

      return (
          <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
              <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                  <h1 className="text-3xl font-bold mb-8">Review Order</h1>
                  <Card className="p-6 mb-6">
                      <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Selected Medicines</h3>
                      {selectedList.length > 0 ? (
                          <ul className="space-y-2 mb-4">
                              {selectedList.map(item => (
                                  <li key={item.id} className="flex justify-between border-b border-gray-100 py-2 last:border-0">
                                      <span>{item.name}</span>
                                      <span className="font-bold">x{item.quantity}</span>
                                  </li>
                              ))}
                          </ul>
                      ) : <p className="text-gray-500 italic mb-4">No medicines selected from list.</p>}

                      {prescriptionFile && (
                          <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2 mb-4">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">{prescriptionFile.name}</span>
                          </div>
                      )}

                      <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 mt-6">Delivery Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-gray-500">Name:</span> <p className="font-medium text-lg">{patientForm.name}</p></div>
                          <div><span className="text-gray-500">Mobile:</span> <p className="font-medium text-lg">{patientForm.mobile}</p></div>
                          <div className="col-span-2"><span className="text-gray-500">Address:</span> <p className="font-medium text-lg">{patientForm.address}</p></div>
                          {patientForm.notes && <div className="col-span-2"><span className="text-gray-500">Notes:</span> <p className="font-medium">{patientForm.notes}</p></div>}
                      </div>
                  </Card>

                  <div className="flex gap-4">
                      <Button variant="outline" className="w-full h-12" onClick={() => setViewState('select')}>Edit Order</Button>
                      <Button className="w-full bg-[#1FAA59] hover:bg-[#168a46] h-12 text-lg" onClick={handleSubmitOrder} disabled={isSubmitting}>
                          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : "Confirm Order"}
                      </Button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <>
      <Helmet><title>Order Medicine - AASHA MEDIX</title></Helmet>
      
      <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <nav className="flex text-sm text-gray-500 mb-2">
                 <Link to="/" className="hover:text-[#1FAA59]">Home</Link>
                 <span className="mx-2">/</span>
                 <span className="font-semibold text-gray-900">Order Medicines</span>
              </nav>
              <h1 className="text-3xl font-bold text-slate-900">Order Medicines</h1>
              <p className="text-gray-500">Search for medicines or upload your prescription.</p>
            </div>
            
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                   placeholder="Search medicines (e.g., Dolo, Crocin)..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#1FAA59] focus:border-[#1FAA59]"
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
             
             {/* Left Column: Medicines Grid */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* Medicines List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-[#1FAA59]" /> Common Medicines
                   </h2>
                   
                   {filteredMeds.length === 0 ? (
                       <div className="text-center py-12 text-gray-500">
                           No medicines found matching "{searchTerm}"
                       </div>
                   ) : (
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {filteredMeds.map(med => {
                              const isSelected = !!selectedMeds[med.id];
                              return (
                                  <div 
                                    key={med.id} 
                                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                                        isSelected ? 'border-[#1FAA59] bg-green-50' : 'border-gray-100 hover:border-green-200 hover:shadow-md'
                                    }`}
                                    onClick={() => !isSelected && handleMedToggle(med.id)}
                                  >
                                      <div className="flex justify-between items-start mb-2">
                                          <h3 className={`font-semibold ${isSelected ? 'text-green-800' : 'text-gray-800'}`}>{med.name}</h3>
                                          {isSelected && <CheckCircle className="w-5 h-5 text-[#1FAA59]" />}
                                      </div>
                                      
                                      {isSelected ? (
                                          <div className="flex items-center justify-between mt-3 bg-white rounded-lg p-1 border border-green-100">
                                              <button onClick={(e) => { e.stopPropagation(); updateQuantity(med.id, -1); }} className="p-1 hover:bg-gray-100 rounded">
                                                  <Minus className="w-3 h-3 text-gray-600" />
                                              </button>
                                              <span className="text-sm font-bold w-6 text-center">{selectedMeds[med.id]}</span>
                                              <button onClick={(e) => { e.stopPropagation(); updateQuantity(med.id, 1); }} className="p-1 hover:bg-gray-100 rounded">
                                                  <Plus className="w-3 h-3 text-gray-600" />
                                              </button>
                                          </div>
                                      ) : (
                                          <p className="text-xs text-gray-400 mt-2">Click to add</p>
                                      )}
                                      
                                      {isSelected && (
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); handleMedToggle(med.id); }}
                                            className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <X className="w-4 h-4" />
                                          </button>
                                      )}
                                  </div>
                              );
                          })}
                       </div>
                   )}
                </div>

                {/* Prescription Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <Upload className="w-5 h-5 text-blue-600" /> Upload Prescription
                    </h2>
                    
                    {!prescriptionFile ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                            <input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6" />
                            </div>
                            <p className="font-medium text-gray-900">Click to upload prescription</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{prescriptionFile.name}</p>
                                    <p className="text-xs text-gray-500">{(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setPrescriptionFile(null)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
             </div>

             {/* Right Column: Patient Details */}
             <div className="space-y-6">
                <Card className="p-6 sticky top-24 shadow-lg border-t-4 border-t-[#1FAA59]">
                    <h2 className="text-lg font-bold mb-6">Patient Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                            <Input name="name" value={patientForm.name} onChange={handleFormChange} placeholder="Enter name" className="bg-gray-50/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number *</label>
                            <Input name="mobile" value={patientForm.mobile} onChange={handleFormChange} placeholder="10-digit number" maxLength={10} className="bg-gray-50/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Delivery Address *</label>
                            <textarea 
                                name="address" 
                                value={patientForm.address} 
                                onChange={handleFormChange} 
                                placeholder="House no, Street, Area..."
                                className="w-full min-h-[80px] rounded-md border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1FAA59] bg-gray-50/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Optional Notes</label>
                            <Input name="notes" value={patientForm.notes} onChange={handleFormChange} placeholder="Any specific instructions..." className="bg-gray-50/50" />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                         <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                             <span>Medicines Selected:</span>
                             <span className="font-bold">{Object.keys(selectedMeds).length}</span>
                         </div>
                         {Object.keys(selectedMeds).length === 0 && !prescriptionFile && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                Please select medicines or upload a prescription to proceed.
                            </div>
                         )}
                         <Button onClick={() => setViewState('review')} className="w-full h-12 bg-[#1FAA59] hover:bg-[#168a46] text-lg font-medium shadow-lg shadow-green-200">
                             Review Order
                         </Button>
                    </div>
                </Card>
             </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default OrderMedicine;
