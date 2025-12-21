
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, MapPin, CreditCard, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  { id: 1, title: 'Service Selection' },
  { id: 2, title: 'Patient Details' },
  { id: 3, title: 'Schedule' },
  { id: 4, title: 'Review & Pay' }
];

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    serviceType: '',
    testType: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    date: '',
    time: '',
    paymentMethod: 'cash',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.serviceType) {
          newErrors.serviceType = 'Please select a service type.';
        }
        break;
      case 2:
        if (!formData.name) newErrors.name = 'Name is required.';
        if (!formData.mobile) {
            newErrors.mobile = 'Mobile number is required.';
        } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (formData.serviceType === 'Home Sample Collection' && !formData.address) {
            newErrors.address = 'Address is required for home collection.';
        }
        break;
      case 3:
        if (!formData.date) newErrors.date = 'Please select a date.';
        if (!formData.time) newErrors.time = 'Please select a time slot.';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
       toast({ variant: "destructive", title: "Validation Error", description: "Please correct the errors before proceeding." });
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let patientId = null;
      const { data: existingPatient } = await supabase.from('patients').select('id').eq('mobile', formData.mobile).single();

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const { data: newPatient, error: createError } = await supabase.from('patients').insert({ name: formData.name, mobile: formData.mobile, email: formData.email, address: formData.address }).select().single();
        if (createError) throw createError;
        patientId = newPatient.id;
      }

      const { error: appointmentError } = await supabase.from('appointments').insert({ patient_id: patientId, service_type: formData.serviceType, appointment_date: formData.date, appointment_time: formData.time, status: 'Scheduled', notes: `${formData.testType ? `Test: ${formData.testType}. ` : ''}${formData.notes}` });
      if (appointmentError) throw appointmentError;
      
      await supabase.from('leads').insert({ name: formData.name, mobile: formData.mobile, service: formData.serviceType, status: 'Converted', notes: 'Auto-created from booking' });

      toast({ title: "Booking Confirmed! 🎉", description: "Your appointment has been successfully scheduled." });
      setFormData({ serviceType: '', testType: '', name: '', mobile: '', email: '', address: '', date: '', time: '', paymentMethod: 'cash', notes: '' });
      setCurrentStep(1);

    } catch (error) {
      toast({ variant: "destructive", title: "Booking Failed", description: error.message || "Please try again or call support." });
    } finally {
      setLoading(false);
    }
  };

  const FormField = ({ name, label, required, children }) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label} {required && <span className="text-red-500">*</span>}</Label>
      {children}
      {errors[name] && <p className="text-sm text-red-500 mt-1 animate-in fade-in-50">{errors[name]}</p>}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl font-bold text-gray-800">Book Appointment</CardTitle>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">Step {currentStep} of 4</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: `${(currentStep / 4) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <FormField name="serviceType" label="Select Service Type" required>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Diagnostics (Lab Test)', 'Home Sample Collection', 'Telemedicine Consultation', 'Health Checkup Package'].map((service) => (
                    <div key={service} onClick={() => handleSelectChange('serviceType', service)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${ formData.serviceType === service ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50' }`} >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{service}</span>
                        {formData.serviceType === service && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </FormField>
              {(formData.serviceType === 'Diagnostics (Lab Test)' || formData.serviceType === 'Home Sample Collection') && (
                <FormField name="testType" label="Specific Test (Optional)">
                   <Select onValueChange={(val) => handleSelectChange('testType', val)} value={formData.testType}>
                      <SelectTrigger><SelectValue placeholder="Select a test..." /></SelectTrigger>
                      <SelectContent><SelectItem value="CBC">Complete Blood Count (CBC)</SelectItem><SelectItem value="Diabetes">Diabetes Screening (HbA1c)</SelectItem><SelectItem value="Thyroid">Thyroid Profile</SelectItem><SelectItem value="Lipid">Lipid Profile</SelectItem><SelectItem value="FullBody">Full Body Checkup</SelectItem></SelectContent>
                   </Select>
                </FormField>
              )}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
               <FormField name="name" label="Full Name" required><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input id="name" name="name" className="pl-9" placeholder="Patient Name" value={formData.name} onChange={handleInputChange} /></div></FormField>
               <FormField name="mobile" label="Mobile Number" required><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input id="mobile" name="mobile" className="pl-9" type="tel" placeholder="10-digit number" value={formData.mobile} onChange={handleInputChange} maxLength={10} /></div></FormField>
               <FormField name="email" label="Email (for report delivery)"><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input id="email" name="email" type="email" className="pl-9" placeholder="example@mail.com" value={formData.email} onChange={handleInputChange} /></div></FormField>
               <FormField name="address" label="Address" required={formData.serviceType === 'Home Sample Collection'}><div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Textarea id="address" name="address" className="pl-9" placeholder="House No, Street, Landmark..." value={formData.address} onChange={handleInputChange} /></div></FormField>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField name="date" label="Preferred Date" required><div className="relative"><Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input type="date" name="date" className="pl-9" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} /></div></FormField>
                <FormField name="time" label="Preferred Time" required><div className="relative"><Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Select onValueChange={(val) => handleSelectChange('time', val)} value={formData.time}><SelectTrigger className="pl-9"><SelectValue placeholder="Select Time Slot" /></SelectTrigger><SelectContent>{['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(time => (<SelectItem key={time} value={time}>{time}</SelectItem>))}</SelectContent></Select></div></FormField>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-yellow-700">Actual appointment time may vary slightly based on staff availability. Our team will call you to confirm.</p></div>
              <FormField name="notes" label="Additional Notes"><Textarea name="notes" placeholder="Any specific symptoms or instructions..." value={formData.notes} onChange={handleInputChange} /></FormField>
            </motion.div>
          )}

          {currentStep === 4 && (
             <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-100"><h3 className="font-semibold text-gray-900 border-b pb-2">Booking Summary</h3><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-gray-500 block">Service</span><span className="font-medium">{formData.serviceType}</span></div><div><span className="text-gray-500 block">Date & Time</span><span className="font-medium">{formData.date} at {formData.time}</span></div><div><span className="text-gray-500 block">Patient</span><span className="font-medium">{formData.name}</span></div><div><span className="text-gray-500 block">Contact</span><span className="font-medium">{formData.mobile}</span></div></div></div>
              <FormField name="paymentMethod" label="Payment Method"><RadioGroup defaultValue="cash" onValueChange={(val) => handleSelectChange('paymentMethod', val)} className="grid grid-cols-2 gap-4"><div><RadioGroupItem value="cash" id="cash" className="peer sr-only" /><Label htmlFor="cash" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 cursor-pointer"><span className="mb-2"><CheckCircle className="h-6 w-6" /></span>Pay Later / Cash</Label></div><div><RadioGroupItem value="online" id="online" className="peer sr-only" disabled /><Label htmlFor="online" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 cursor-not-allowed opacity-50"><span className="mb-2"><CreditCard className="h-6 w-6" /></span>Pay Online (Soon)</Label></div></RadioGroup></FormField>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || loading} className="w-32" >Back</Button>
          {currentStep < 4 ? (<Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 w-32" disabled={loading}>Next</Button>) : (<Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 w-40">{loading ? 'Processing...' : 'Confirm Booking'}</Button>)}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
