import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { initiateRazorpayPayment, verifyRazorpayPayment, handlePaymentFailure } from '@/utils/paymentService';

const PaymentCheckout = ({ 
  booking,
  onPaymentSuccess,
  onPaymentFailure 
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaymentClick = async () => {
    if (!booking || !booking.total_amount) {
      toast({
        title: 'Error',
        description: 'Booking details missing',
        variant: 'destructive'
      });
      return;
    }

    setPaymentProcessing(true);

    try {
      // Get Razorpay options
      const razorpayOptions = await initiateRazorpayPayment({
        ...booking,
        booking_id: booking.id
      });

      // Razorpay handler
      razorpayOptions.handler = async (response) => {
        try {
          setLoading(true);

          // Verify payment on server
          const result = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            booking_id: booking.id,
            booking_type: booking.booking_type
          });

          if (result.success) {
            toast({
              title: 'Payment Successful!',
              description: `Reference: ${booking.reference_number}`,
              duration: 3000
            });

            // Callback to parent with updated booking
            if (onPaymentSuccess) {
              onPaymentSuccess(result.booking);
            }
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
          toast({
            title: 'Verification Failed',
            description: error.message,
            variant: 'destructive'
          });

          // Update booking with failure
          await handlePaymentFailure(booking.id, error.message);

          if (onPaymentFailure) {
            onPaymentFailure();
          }
        } finally {
          setLoading(false);
        }
      };

      // Error handler
      razorpayOptions.modal = {
        ondismiss: async () => {
          console.log('Payment modal closed');
          await handlePaymentFailure(booking.id, 'User closed payment modal');
          
          if (onPaymentFailure) {
            onPaymentFailure();
          }
        }
      };

      // Open Razorpay modal
      const rzp = new window.Razorpay(razorpayOptions);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive'
      });

      if (onPaymentFailure) {
        onPaymentFailure();
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  const amount = booking?.total_amount || 0;
  const gst = Math.round(amount * 0.18 * 100) / 100;
  const total = Math.round((amount + gst) * 100) / 100;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="rounded-2xl shadow-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-[#00A86B]/10 to-[#E6F5F0] rounded-t-2xl border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="w-5 h-5 text-[#00A86B]" />
            Secure Payment
          </CardTitle>
          <p className="text-sm text-[#6B7280] mt-2">Complete your booking with a secure payment</p>
        </CardHeader>

        <CardContent className="pt-8 space-y-6">
          {/* Price Breakdown */}
          <div className="bg-[#F9FAFB] rounded-xl p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-[#1F1F1F]">
                <span className="font-medium">Service Amount</span>
                <span className="font-semibold">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span className="text-sm">GST (18%)</span>
                <span className="text-sm">₹{gst.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-3 flex justify-between">
              <span className="font-bold text-[#1F1F1F]">Total Amount</span>
              <span className="text-2xl font-bold text-[#00A86B]">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Reference & Details */}
          <div className="space-y-3 p-4 bg-[#E6F5F0]/30 rounded-xl border border-[#00A86B]/20">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Reference Number</span>
              <span className="font-mono font-semibold text-[#1F1F1F]">{booking?.reference_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Service Type</span>
              <span className="font-semibold text-[#1F1F1F] capitalize">{booking?.booking_type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Appointment Date</span>
              <span className="font-semibold text-[#1F1F1F]">
                {new Date(booking?.appointment_date).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* Security Info */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700 mt-1">
                Your payment is protected by 256-bit SSL encryption. We accept all major cards, UPI, and wallets.
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-900">
                By clicking "Pay Now", you agree to our terms and confirm that the booking details are correct. 
                Cancellations are subject to our cancellation policy.
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePaymentClick}
            disabled={loading || paymentProcessing || !booking?.total_amount}
            className="w-full h-12 bg-[#00A86B] hover:bg-[#1B7F56] text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            {loading || paymentProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay ₹{total.toFixed(2)} Now
              </>
            )}
          </Button>

          {/* Alternative Payment Methods Info */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-[#6B7280] mb-3">We accept all payment methods</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-[#6B7280]">💳 Debit Card</span>
              <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-[#6B7280]">💳 Credit Card</span>
              <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-[#6B7280]">📱 UPI</span>
              <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-[#6B7280]">💰 Wallet</span>
              <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-[#6B7280]">🏦 Net Banking</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCheckout;
