
// Mock OTP Service for frontend simulation
// In a real production environment, this would call a Supabase Edge Function connecting to Twilio/Msg91

export const sendOTP = async (phoneNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[OTP SERVICE] OTP sent to ${phoneNumber}: 123456`);
      resolve({ success: true, message: "OTP sent successfully" });
    }, 1500);
  });
};

export const verifyOTP = async (phoneNumber, otp) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock verification - Accept '123456' or any 6-digit for demo purposes if needed, 
      // but let's enforce '123456' for specific testing or allow any for broad testing.
      // For this user request "Generate 6-digit random OTP", we simulate the validation.
      
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        resolve({ success: true, token: "mock-jwt-token-" + Date.now() });
      } else {
        reject({ success: false, message: "Invalid OTP" });
      }
    }, 1000);
  });
};
