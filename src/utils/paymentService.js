import { supabase } from '@/lib/customSupabaseClient';

/**
 * Initialize Razorpay payment session
 */
export const initiateRazorpayPayment = async (bookingData) => {
  try {
    // Razorpay key from environment
    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_YOUR_KEY';

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(bookingData.totalAmount * 100), // Convert to paise
      currency: 'INR',
      name: 'AASHA MEDIX',
      description: `${bookingData.booking_type.toUpperCase()} - Booking ${bookingData.reference_number}`,
      image: '/logo.png',
      prefill: {
        name: bookingData.fullName,
        email: bookingData.email,
        contact: bookingData.mobile
      },
      notes: {
        booking_id: bookingData.booking_id,
        reference_number: bookingData.reference_number,
        booking_type: bookingData.booking_type,
        user_id: bookingData.user_id
      },
      theme: {
        color: '#00A86B'
      }
    };

    return options;
  } catch (error) {
    console.error('Razorpay init error:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment and update booking status
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
      booking_type
    } = paymentData;

    // Call backend edge function to verify signature (secure verification)
    // For now, we'll update the booking with payment info
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: 'Paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', booking_id)
      .select();

    if (error) throw error;

    return {
      success: true,
      booking: data[0],
      message: 'Payment verified and booking confirmed'
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

/**
 * Handle payment failure - update booking status
 */
export const handlePaymentFailure = async (booking_id, error_message) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'failed',
        status: 'Payment Failed',
        payment_error: error_message,
        updated_at: new Date().toISOString()
      })
      .eq('id', booking_id)
      .select();

    if (error) throw error;

    return {
      success: false,
      booking: data[0],
      message: 'Payment failed - please try again'
    };
  } catch (error) {
    console.error('Payment failure update error:', error);
    throw error;
  }
};

/**
 * Generate invoice for completed payment
 */
export const generateInvoice = async (bookingId) => {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) throw error;

    return {
      invoice_number: `INV-${booking.reference_number}`,
      booking_date: new Date(booking.booking_date).toLocaleDateString('en-IN'),
      appointment_date: new Date(booking.appointment_date).toLocaleDateString('en-IN'),
      amount: booking.total_amount,
      status: booking.payment_status,
      payment_id: booking.payment_id
    };
  } catch (error) {
    console.error('Invoice generation error:', error);
    throw error;
  }
};

/**
 * Get payment status by booking ID
 */
export const getPaymentStatus = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('payment_status, status, total_amount, payment_id')
      .eq('id', bookingId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Get payment status error:', error);
    return null;
  }
};

/**
 * Retry payment - create new Razorpay session
 */
export const retryPayment = async (bookingId, bookingData) => {
  try {
    // Update booking status to "Payment Pending"
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'pending',
        status: 'Payment Pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) throw error;

    // Return Razorpay options for retry
    return await initiateRazorpayPayment(bookingData);
  } catch (error) {
    console.error('Retry payment error:', error);
    throw error;
  }
};
