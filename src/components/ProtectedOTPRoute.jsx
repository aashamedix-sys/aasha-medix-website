
import React, { useState } from 'react';
import OTPVerification from './OTPVerification';

const ProtectedOTPRoute = ({ children }) => {
  const [isVerified, setIsVerified] = useState(() => localStorage.getItem('aasha_auth_token') === 'verified');
  const [loading, setLoading] = useState(false);

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  if (loading) {
    return null; // Or a simple spinner
  }

  if (!isVerified) {
    return <OTPVerification onVerified={handleVerificationSuccess} />;
  }

  return children;
};

export default ProtectedOTPRoute;
