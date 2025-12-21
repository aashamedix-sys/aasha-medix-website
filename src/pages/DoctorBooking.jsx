
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Video, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { generateReferenceNumber, sendEmailNotification, sendSMSNotification, createDoctorBookingEmail, createDoctorBookingSMS } from '@/utils/notificationService';

const getNextDays = () => {
  const days = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
};

const DoctorBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState(location.state?.selectedSpecialty || 'General Physician');
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getNextDays()[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('doctors').select('*').eq('specialty', selectedSpecialty).eq('active', true);
        if (error) throw error;
        setDoctors(data || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        toast({ title: "Error", description: "Failed to load doctors list.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [selectedSpecialty]);

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const confirmBooking = async () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast({ title: "Missing Info", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    const refNum = generateReferenceNumber('DR');
    const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    try {
      const { error } = await supabase.from('doctor_bookings').insert([{
        doctor_id: selectedDoctor.id,
        booking_date: new Date().toISOString(),
        booking_time: selectedTime,
        consultation_fee: selectedDoctor.consultation_fee,
        patient_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        symptoms: formData.symptoms,
        reference_number: refNum,
        notification_status: 'sent'
      }]);

      if (error) throw error;

      await sendEmailNotification({
        email: formData.email,
        subject: `Consultation Confirmed - ${selectedDoctor.name}`,
        data: createDoctorBookingEmail({
            patientName: formData.name,
            doctorName: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            bookingDate: formattedDate,
            bookingTime: selectedTime,
            referenceNumber: refNum
        })
      });

      await sendSMSNotification({
        phone: formData.phone,
        message: createDoctorBookingSMS({
            doctorName: selectedDoctor.name,
            bookingDate: formattedDate,
            bookingTime: selectedTime,
            referenceNumber: refNum
        })
      });

      navigate('/order-summary', {
        state: {
            type: 'Doctor',
            referenceNumber: refNum,
            items: [{ name: `Consultation: ${selectedDoctor.name} (${selectedDoctor.specialty})`, price: selectedDoctor.consultation_fee, quantity: 1 }],
            totalAmount: selectedDoctor.consultation_fee,
            patientDetails: formData,
            status: 'Confirmed',
            date: formattedDate,
            time: selectedTime
        }
      });

    } catch (err) {
      console.error(err);
      toast({ title: "Booking Failed", description: "Could not complete booking.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet><title>Book Doctor Appointment - AASHA MEDIX</title></Helmet>

      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1000px]">
          <div className="mb-8">
             <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-gray-500">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back to Specialties
             </Button>
             <h1 className="text-3xl font-bold text-gray-900">
               {step === 1 ? `Select ${selectedSpecialty}` : 
                step === 2 ? "Select Time Slot" : "Confirm Booking"}
             </h1>
             <div className="flex gap-2 mt-4">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#1FAA59]' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#1FAA59]' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-[#1FAA59]' : 'bg-gray-200'}`}></div>
             </div>
          </div>

          {step === 1 && (
             <div className="grid gap-6">
                {loading ? <div className="text-center py-20 text-gray-500">Loading doctors...</div> : doctors.length === 0 ? <div className="text-center py-20 text-gray-500">No doctors available.</div> : (
                   doctors.map(doc => (
                      <Card key={doc.id} className="p-6 hover:shadow-lg transition-all border-gray-100">
                         <div className="flex flex-col md:flex-row gap-6 items-start">
                            <img src={doc.image_url} alt={doc.name} className="w-24 h-24 rounded-full object-cover bg-gray-100" />
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                  <div>
                                     <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                                     <p className="text-[#1FAA59] font-medium">{doc.specialty}</p>
                                     <p className="text-gray-500 text-sm">{doc.qualification}</p>
                                  </div>
                                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                                     <Star className="w-3 h-3 fill-current" /> {doc.rating}
                                  </div>
                               </div>
                               <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {doc.experience_years}+ Yrs Exp</span>
                                  <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Video Consult</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs text-gray-500">Consultation Fee</p>
                               <p className="text-xl font-bold text-[#1FAA59] mb-4">₹{doc.consultation_fee}</p>
                               <Button onClick={() => handleBook(doc)} className="bg-[#1FAA59] hover:bg-green-700">Book Appointment</Button>
                            </div>
                         </div>
                      </Card>
                   ))
                )}
             </div>
          )}

          {step === 2 && selectedDoctor && (
             <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6 h-fit">
                   <div className="flex items-center gap-4 mb-4">
                      <img src={selectedDoctor.image_url} className="w-16 h-16 rounded-full" alt="" />
                      <div>
                         <h3 className="font-bold">{selectedDoctor.name}</h3>
                         <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
                      </div>
                   </div>
                   <div className="border-t pt-4 text-sm space-y-2">
                      <div className="flex justify-between"><span>Fee</span><span className="font-bold">₹{selectedDoctor.consultation_fee}</span></div>
                   </div>
                </Card>
                <div className="md:col-span-2 space-y-6">
                   <Card className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#1FAA59]" /> Select Date</h3>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                         {getNextDays().map((date, i) => (
                            <button key={i} onClick={() => setSelectedDate(date)} className={`min-w-[100px] p-3 rounded-xl border text-center transition-all ${selectedDate.toDateString() === date.toDateString() ? 'border-[#1FAA59] bg-green-50 text-[#1FAA59]' : 'border-gray-200 hover:border-gray-300'}`}>
                               <span className="block text-xs uppercase text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                               <span className="block text-lg font-bold">{date.getDate()}</span>
                            </button>
                         ))}
                      </div>
                      <h3 className="font-bold mb-4 mt-8 flex items-center gap-2"><Clock className="w-5 h-5 text-[#1FAA59]" /> Select Time</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                         {timeSlots.map(time => (
                            <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${selectedTime === time ? 'bg-[#1FAA59] text-white border-[#1FAA59]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                               {time}
                            </button>
                         ))}
                      </div>
                   </Card>
                   <Button onClick={() => selectedTime ? setStep(3) : toast({title: "Select Time", description: "Please choose a time slot"})} className="w-full h-12 text-lg bg-[#1FAA59] hover:bg-green-700" disabled={!selectedTime}>Continue</Button>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
                <div className="space-y-6">
                   <Card className="p-6">
                      <h3 className="font-bold text-lg mb-4">Patient Details</h3>
                      <div className="space-y-4">
                         <div><label className="text-sm font-medium text-gray-700">Full Name</label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Patient Name" /></div>
                         <div><label className="text-sm font-medium text-gray-700">Phone Number</label><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="10-digit Mobile" /></div>
                         <div><label className="text-sm font-medium text-gray-700">Email Address</label><Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" /></div>
                         <div><label className="text-sm font-medium text-gray-700">Symptoms (Optional)</label><Input value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} placeholder="Briefly describe the issue" /></div>
                      </div>
                   </Card>
                   <Button onClick={confirmBooking} disabled={isProcessing} className="w-full h-12 bg-[#1FAA59] hover:bg-green-700 text-lg">
                      {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Booking...</> : "Confirm Appointment"}
                   </Button>
                </div>
                <div>
                   <Card className="p-6 bg-green-50/50 border-green-100">
                      <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                      <div className="space-y-4">
                         <div className="flex gap-4 items-center">
                            <img src={selectedDoctor.image_url} className="w-16 h-16 rounded-full" alt="" />
                            <div><p className="font-bold text-gray-900">{selectedDoctor.name}</p><p className="text-sm text-gray-600">{selectedDoctor.specialty}</p></div>
                         </div>
                         <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate.toDateString()}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Time</span><span className="font-medium">{selectedTime}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Fee</span><span className="font-bold text-[#1FAA59]">₹{selectedDoctor.consultation_fee}</span></div>
                         </div>
                      </div>
                   </Card>
                </div>
             </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorBooking;
