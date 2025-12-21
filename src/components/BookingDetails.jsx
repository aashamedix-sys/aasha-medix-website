
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Clock, MapPin, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { generateReferenceNumber } from '@/utils/notificationService';
import { createBooking } from '@/utils/bookingService';

const BookingDetails = ({ 
  type = 'test', 
  items = [], 
  totalAmount = 0, 
  onBack 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    date: '',
    time: '',
    instructions: '',
    terms: false
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const { data } = await supabase.from('patients').select('*').eq('user_id', user.id).single();
        if (data) {
          setFormData(prev => ({
            ...prev,
            fullName: data.full_name || '',
            email: user.email || '',
            mobile: data.mobile || data.phone || '',
            address: data.address || ''
          }));
        }
      }
    };
    loadProfile();
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Valid 10-digit mobile required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.address || formData.address.length < 10) newErrors.address = "Address must be at least 10 chars";
    if (!formData.date) newErrors.date = "Preferred date is required";
    if (!formData.time) newErrors.time = "Preferred time is required";
    if (!formData.terms) newErrors.terms = "You must agree to terms";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast({ title: "Validation Error", description: "Please check the form fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const refNum = generateReferenceNumber(type === 'doctor' ? 'DR' : type === 'medicine' ? 'MED' : 'BK');

    try {
      const payload = {
        user_id: user?.id || null,
        booking_type: type,
        
        // Updated schema fields
        mobile: formData.mobile,
        address: formData.address,
        booking_date: new Date().toISOString(),
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.instructions,
        
        total_amount: totalAmount,
        status: 'Confirmed',
        reference_number: refNum,
        
        // Specific IDs
        test_ids: type === 'test' ? items.map(i => i.id) : null,
        medicine_ids: type === 'medicine' ? items : null,
        doctor_id: type === 'doctor' ? items[0]?.id : null
      };

      // Use new booking service that integrates with Make.com webhook
      const { success, booking } = await createBooking(payload);

      if (success) {
        toast({ title: "Booking Confirmed!", description: `Reference: ${refNum}` });
        
        navigate('/booking-confirmation', {
          state: {
            booking: { ...payload, id: booking.id, items },
            refNum
          }
        });
      }

    } catch (error) {
      console.error(error);
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" /> Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input 
                    value={formData.fullName} 
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      value={formData.mobile} 
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      className={`pl-9 ${errors.mobile ? "border-red-500" : ""}`}
                      placeholder="10 digit mobile"
                      maxLength={10}
                    />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      value={formData.email} 
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" /> Location & Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{type === 'medicine' ? 'Delivery Address' : 'Collection Address'} *</Label>
                <Textarea 
                  value={formData.address} 
                  onChange={(e) => handleChange('address', e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                  placeholder="House No, Street, Landmark, City, Pincode"
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      type="date"
                      value={formData.date} 
                      onChange={(e) => handleChange('date', e.target.value)}
                      className={`pl-9 ${errors.date ? "border-red-500" : ""}`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Preferred Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      type="time"
                      value={formData.time} 
                      onChange={(e) => handleChange('time', e.target.value)}
                      className={`pl-9 ${errors.time ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Special Instructions (Optional)</Label>
                <Textarea 
                  value={formData.instructions} 
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  placeholder="E.g., Landmark near park, specific symptoms..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start space-x-2 bg-gray-50 p-4 rounded-lg">
            <Checkbox 
              id="terms" 
              checked={formData.terms} 
              onCheckedChange={(c) => handleChange('terms', c)}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the Terms and Conditions
              </label>
              <p className="text-sm text-muted-foreground">
                By booking, you agree to our privacy policy and service terms.
              </p>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="w-1/3" onClick={onBack}>Back</Button>
            <Button className="w-2/3 bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming...</> : 'Confirm Booking'}
            </Button>
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="truncate w-3/4">{item.name || item.test_name}</span>
                    <span className="font-semibold">₹{item.price || item.mrp || 0}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
