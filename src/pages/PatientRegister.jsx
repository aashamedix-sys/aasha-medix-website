
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Mail, Phone, Lock, MapPin, Calendar, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PatientRegister = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    terms: false,
    privacy: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validate Password Strength
  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.fullName.length < 3) newErrors.fullName = "Name must be at least 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Invalid 10-digit Indian mobile number";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (formData.address.length < 10) newErrors.address = "Address too short";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid 6-digit Pincode";
    
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 chars";
    else if (passwordStrength < 3) newErrors.password = "Password is too weak";
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.terms) newErrors.terms = "You must accept Terms & Conditions";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fix the errors in the form.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Supabase trigger (handle_new_patient_auth) will create the patient row after signup.
      // We only need to create the auth user here.
      const { data: authData, error: authError } = await signUp(formData.email, formData.password, {
        data: {
          full_name: formData.fullName,
          role: 'patient',
          phone: formData.phone
        }
      });

      if (authError) throw authError;
      if (!authData?.user) throw new Error("Registration failed. Please try again.");

      toast({ 
        title: "Registration Successful! 🎉", 
        description: "Please check your email to verify your account. Your profile will be ready after verification." 
      });
      
      navigate('/patient-login');

    } catch (error) {
      console.error(error);
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ];

  return (
    <>
      <Helmet><title>Patient Registration | AASHA MEDIX</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <Card className="w-full max-w-3xl mx-auto p-8 shadow-xl rounded-2xl bg-white border-0">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Create Patient Account</h1>
            <p className="mt-2 text-gray-600">Join AASHA MEDIX for seamless healthcare access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    value={formData.fullName} 
                    onChange={(e) => handleChange('fullName', e.target.value)} 
                    className={`pl-9 ${errors.fullName ? "border-red-500" : ""}`} 
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email Address <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => handleChange('email', e.target.value)} 
                    className={`pl-9 ${errors.email ? "border-red-500" : ""}`} 
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>Mobile Number <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => handleChange('phone', e.target.value)} 
                    className={`pl-9 ${errors.phone ? "border-red-500" : ""}`} 
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label>Date of Birth <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="date"
                    value={formData.dob} 
                    onChange={(e) => handleChange('dob', e.target.value)} 
                    className={`pl-9 ${errors.dob ? "border-red-500" : ""}`} 
                  />
                </div>
                {errors.dob && <p className="text-xs text-red-500">{errors.dob}</p>}
              </div>

              <div className="space-y-2">
                <Label>Gender <span className="text-red-500">*</span></Label>
                <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-gray-900">Address Details</h3>
              
              <div className="space-y-2">
                <Label>Street Address <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea 
                    value={formData.address} 
                    onChange={(e) => handleChange('address', e.target.value)} 
                    className={`pl-9 min-h-[80px] ${errors.address ? "border-red-500" : ""}`} 
                    placeholder="House No, Street, Landmark"
                  />
                </div>
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>City <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.city} 
                    onChange={(e) => handleChange('city', e.target.value)} 
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label>State <span className="text-red-500">*</span></Label>
                  <Select value={formData.state} onValueChange={(val) => handleChange('state', val)}>
                    <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Pincode <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.pincode} 
                    onChange={(e) => handleChange('pincode', e.target.value)} 
                    className={errors.pincode ? "border-red-500" : ""}
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-gray-900">Security</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Password <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={formData.password} 
                      onChange={(e) => handleChange('password', e.target.value)} 
                      className={`pl-9 pr-10 ${errors.password ? "border-red-500" : ""}`} 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  {formData.password && (
                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? (passwordStrength < 3 ? 'bg-orange-500' : 'bg-green-500') : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword} 
                      onChange={(e) => handleChange('confirmPassword', e.target.value)} 
                      className={`pl-9 ${errors.confirmPassword ? "border-red-500" : ""}`} 
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => handleChange('terms', checked === true)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <Link to="/terms-conditions" className="text-green-600 hover:underline">Terms & Conditions</Link> and <Link to="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</Link>
                </Label>
              </div>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-[#0FA958] hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-100 transition-all text-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <span className="flex items-center">Create Account <ArrowRight className="ml-2 w-5 h-5"/></span>}
            </Button>

            <div className="text-center text-sm">
               <span className="text-gray-500">Already have an account? </span>
               <Link to="/patient-login" className="font-bold text-[#0FA958] hover:underline">Login here</Link>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default PatientRegister;
