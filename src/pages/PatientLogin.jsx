
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, Phone, Chrome } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import Logo from '@/components/Logo';

const PatientLogin = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email', 'phone', 'google'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Email + Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      navigate('/patient');
    } catch (err) {
      console.error(err);
      setError(err.message === 'Invalid login credentials' ? 'Invalid email or password.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Phone + OTP Login - Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate phone number (Indian format)
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: `+91${cleanPhone}`,
      });

      if (otpError) throw otpError;
      
      setShowOtpInput(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Phone + OTP Login - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: `+91${cleanPhone}`,
        token: otp,
        type: 'sms',
      });

      if (verifyError) throw verifyError;
      
      navigate('/patient');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (googleError) throw googleError;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Patient Login | AASHA MEDIX</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F5F0] via-white to-white py-12 px-4">
        <Card className="w-full max-w-md p-8 space-y-8 shadow-soft rounded-2xl bg-white border border-gray-200">
          <div className="w-full flex justify-start mb-2">
            <Link to="/" className="text-sm font-semibold text-[#00A86B] hover:text-[#1B7F56]">← Back to Home</Link>
          </div>
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Logo size="lg" showText={false} />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1F1F1F]">Patient Login</h2>
            <p className="text-sm text-[#6B7280]">Access your health records and appointments</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-[#E63946] p-4 rounded-r-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#E63946] shrink-0" />
              <p className="text-sm text-[#E63946] font-medium">{error}</p>
            </div>
          )}

          {/* Login Mode Tabs - Clean Design */}
          <div className="flex gap-3 p-1.5 bg-gray-100 rounded-lg">
            <button
              onClick={() => {
                setLoginMode('email');
                setShowOtpInput(false);
                setError('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-md text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                loginMode === 'email'
                  ? 'bg-white text-[#00A86B] shadow-soft'
                  : 'text-[#6B7280] hover:text-[#1F1F1F]'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => {
                setLoginMode('phone');
                setShowOtpInput(false);
                setError('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-md text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                loginMode === 'phone'
                  ? 'bg-white text-[#00A86B] shadow-soft'
                  : 'text-[#6B7280] hover:text-[#1F1F1F]'
              }`}
            >
              <Phone className="w-4 h-4" /> Phone
            </button>
          </div>

          {/* Email Login Form */}
          {loginMode === 'email' && (
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div>
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#6B7280]" />
                  <Input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="input-medical pl-10" 
                    placeholder="your@email.com" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#6B7280]" />
                  <Input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="input-medical pl-10" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-11 bg-[#00A86B] hover:bg-[#1B7F56] text-white rounded-lg font-bold shadow-soft hover:shadow-medical transition-all duration-300 mt-6"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* Phone OTP Login Form */}
          {loginMode === 'phone' && (
            <form className="space-y-4" onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
              {!showOtpInput ? (
                <div>
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-[#1F1F1F] font-bold">+91</span>
                    <Input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="input-medical pl-12 tracking-wider"
                      placeholder="9876543210"
                      maxLength="10"
                    />
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">📱 We'll send a 6-digit OTP via SMS</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Verify OTP</label>
                  <Input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-medical text-center text-2xl tracking-widest font-bold"
                    placeholder="000000"
                    maxLength="6"
                  />
                  <p className="text-xs text-[#6B7280] mt-2">Code sent to +91{phoneNumber}</p>
                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="text-xs text-[#00A86B] hover:text-[#1B7F56] font-semibold mt-3 transition-colors"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-11 bg-[#00A86B] hover:bg-[#1B7F56] text-white rounded-lg font-bold shadow-soft hover:shadow-medical transition-all duration-300 mt-6"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {showOtpInput ? 'Verify OTP' : 'Send OTP'} <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#6B7280] text-xs font-medium">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-11 bg-white border-2 border-gray-200 text-[#1F1F1F] rounded-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Google Account
              </>
            )}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-[#6B7280]">Don't have an account? </span>
            <Link to="/register" className="font-bold text-[#00A86B] hover:text-[#1B7F56] transition-colors">
              Register now
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PatientLogin;
