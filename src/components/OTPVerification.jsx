
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Phone, User, Loader2, ArrowRight, Lock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { sendOTP, verifyOTP } from '@/utils/otpService';

const OTPVerification = ({ onVerified }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (userInfo.name.length < 3) {
      toast({ title: "Invalid Name", description: "Name must be at least 3 characters", variant: "destructive" });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(userInfo.phone)) {
      toast({ title: "Invalid Phone", description: "Please enter a valid 10-digit Indian mobile number", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await sendOTP(userInfo.phone);
      setStep(2);
      setTimer(30);
      toast({ title: "OTP Sent", description: `Code sent to +91 ${userInfo.phone}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send OTP. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter the complete 6-digit code", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(userInfo.phone, otpString);
      // Persist verification
      localStorage.setItem('aasha_auth_token', 'verified');
      localStorage.setItem('aasha_user_info', JSON.stringify(userInfo));
      toast({ title: "Verified!", description: "Welcome to AASHA MEDIX" });
      onVerified();
    } catch (error) {
      toast({ title: "Verification Failed", description: "Incorrect OTP code", variant: "destructive" });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50 opacity-50 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100"
      >
        {/* Header */}
        <div className="bg-[#0FA958] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Secure Gateway</h2>
            <p className="text-green-50 text-sm">Verify your identity to access AASHA MEDIX</p>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
                onSubmit={handleSendOTP}
              >
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Full Name" 
                      className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="WhatsApp Number" 
                      className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !userInfo.name || !userInfo.phone}
                  className="w-full h-12 bg-[#0FA958] hover:bg-green-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-200"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="ml-2 w-5 h-5" /></>}
                </Button>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                  By continuing, you agree to our Terms & Privacy Policy.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="mb-2">
                  <p className="text-gray-600 text-sm">Enter the 6-digit code sent to</p>
                  <p className="text-gray-900 font-bold text-lg">+91 {userInfo.phone}</p>
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-xs text-green-600 hover:underline mt-1"
                  >
                    Change Number
                  </button>
                </div>

                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-slate-800 bg-gray-50"
                    />
                  ))}
                </div>

                <Button 
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.some(d => !d)}
                  className="w-full h-12 bg-[#0FA958] hover:bg-green-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-200"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                </Button>

                <div className="text-sm">
                  {timer > 0 ? (
                    <p className="text-gray-400">Resend code in <span className="text-gray-800 font-medium">{timer}s</span></p>
                  ) : (
                    <button 
                      onClick={handleSendOTP} 
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 text-center">
        <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Secured by AASHA MEDIX
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
