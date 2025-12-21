import { supabase } from '@/lib/customSupabaseClient';

/**
 * Send booking data to Make.com webhook for CRM integration
 */
export const sendBookingToWebhook = async (bookingData) => {
  const WEBHOOK_URL = 'https://hook.eu2.make.com/781nmlxgteqkuh0g1zft2ktrwrddesbc';
  
  try {
    const payload = {
      patient_name: bookingData.fullName,
      patient_phone: bookingData.mobile,
      patient_email: bookingData.email,
      patient_address: bookingData.address,
      booking_type: bookingData.booking_type, // 'test', 'doctor', 'medicine'
      appointment_date: bookingData.appointment_date,
      appointment_time: bookingData.appointment_time,
      reference_number: bookingData.reference_number,
      booking_status: bookingData.status,
      total_amount: bookingData.total_amount,
      notes: bookingData.notes,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn('Webhook response not OK:', response.status);
      // Don't throw - webhook failure shouldn't block booking
    }

    return true;
  } catch (error) {
    console.error('Webhook send error:', error);
    // Don't throw - webhook failure shouldn't block booking
    return false;
  }
};

/**
 * Send SMS confirmation to patient
 */
export const sendBookingConfirmationSMS = async (phone, refNum, appointmentDate) => {
  try {
    // Using Supabase's edge function (if configured) or external SMS service
    const message = `AASHA MEDIX: Your booking is confirmed! Ref: ${refNum}. Appointment: ${appointmentDate}. We'll call you soon. Reply STOP to opt out.`;
    
    // For now, log it - actual SMS integration depends on SMS service setup
    console.log(`SMS to ${phone}: ${message}`);
    
    return true;
  } catch (error) {
    console.error('SMS send error:', error);
    return false;
  }
};

/**
 * Create booking in Supabase and trigger integrations
 */
export const createBooking = async (bookingData) => {
  try {
    // 1. Insert into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();

    if (error) throw error;

    const createdBooking = data[0];

    // 2. Send to Make.com webhook (async, non-blocking)
    await sendBookingToWebhook({
      ...bookingData,
      id: createdBooking.id
    });

    // 3. Send SMS confirmation (async, non-blocking)
    await sendBookingConfirmationSMS(
      bookingData.mobile,
      bookingData.reference_number,
      bookingData.appointment_date
    );

    return {
      success: true,
      booking: createdBooking
    };
  } catch (error) {
    console.error('Booking creation error:', error);
    throw error;
  }
};

/**
 * Get booking by reference number
 */
export const getBookingByRef = async (refNum) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('reference_number', refNum)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get booking error:', error);
    return null;
  }
};

/**
 * Update booking status (for staff)
 */
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Update booking error:', error);
    throw error;
  }
};
