import { supabase } from '@/lib/customSupabaseClient';

/**
 * Get all pending bookings for staff approval
 */
export const getPendingBookings = async (filters = {}) => {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        patients(name, mobile, email, age),
        tests(name, category),
        doctors(name, specialty)
      `)
      .eq('payment_status', 'completed')
      .in('status', ['Paid', 'Payment Pending'])
      .order('appointment_date', { ascending: true });

    // Apply filters
    if (filters.booking_type) {
      query = query.eq('booking_type', filters.booking_type);
    }
    if (filters.date) {
      query = query.eq('appointment_date', filters.date);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get pending bookings error:', error);
    return [];
  }
};

/**
 * Get single booking details
 */
export const getBookingDetails = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        patients(name, mobile, email, age, address),
        tests(name, category, mrp),
        doctors(name, specialty, qualifications)
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get booking details error:', error);
    return null;
  }
};

/**
 * Approve booking by staff
 */
export const approveBooking = async (bookingId, staffId, notes = '') => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'Approved',
        approved_by: staffId,
        approved_at: new Date().toISOString(),
        staff_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select();

    if (error) throw error;

    // Send approval SMS to patient
    if (data && data[0]) {
      await sendApprovalNotification(data[0]);
    }

    return {
      success: true,
      booking: data[0],
      message: 'Booking approved and patient notified'
    };
  } catch (error) {
    console.error('Approve booking error:', error);
    throw error;
  }
};

/**
 * Reject booking with reason
 */
export const rejectBooking = async (bookingId, staffId, reason) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'Rejected',
        rejected_by: staffId,
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select();

    if (error) throw error;

    // Send rejection SMS to patient
    if (data && data[0]) {
      await sendRejectionNotification(data[0], reason);
    }

    return {
      success: true,
      booking: data[0],
      message: 'Booking rejected and patient notified'
    };
  } catch (error) {
    console.error('Reject booking error:', error);
    throw error;
  }
};

/**
 * Reschedule booking
 */
export const rescheduleBooking = async (bookingId, newDate, newTime, reason = '') => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        appointment_date: newDate,
        appointment_time: newTime,
        status: 'Rescheduled',
        reschedule_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select();

    if (error) throw error;

    // Send reschedule SMS to patient
    if (data && data[0]) {
      await sendRescheduleNotification(data[0], newDate, newTime);
    }

    return {
      success: true,
      booking: data[0],
      message: 'Booking rescheduled and patient notified'
    };
  } catch (error) {
    console.error('Reschedule booking error:', error);
    throw error;
  }
};

/**
 * Send approval notification SMS to patient
 */
export const sendApprovalNotification = async (booking) => {
  try {
    const appointmentDate = new Date(booking.appointment_date).toLocaleDateString('en-IN');
    const message = `AASHA MEDIX: Your ${booking.booking_type} appointment is confirmed for ${appointmentDate} at ${booking.appointment_time}. Ref: ${booking.reference_number}. See you soon!`;
    
    console.log(`SMS to ${booking.mobile}: ${message}`);
    
    return true;
  } catch (error) {
    console.error('Approval notification error:', error);
    return false;
  }
};

/**
 * Send rejection notification SMS to patient
 */
export const sendRejectionNotification = async (booking, reason) => {
  try {
    const message = `AASHA MEDIX: Your ${booking.booking_type} booking (${booking.reference_number}) could not be processed. Reason: ${reason}. Please contact us at 1800-AASHA-1 for alternatives.`;
    
    console.log(`SMS to ${booking.mobile}: ${message}`);
    
    return true;
  } catch (error) {
    console.error('Rejection notification error:', error);
    return false;
  }
};

/**
 * Send reschedule notification SMS to patient
 */
export const sendRescheduleNotification = async (booking, newDate, newTime) => {
  try {
    const rescheduleDate = new Date(newDate).toLocaleDateString('en-IN');
    const message = `AASHA MEDIX: Your appointment has been rescheduled to ${rescheduleDate} at ${newTime}. Ref: ${booking.reference_number}. Thank you for your patience!`;
    
    console.log(`SMS to ${booking.mobile}: ${message}`);
    
    return true;
  } catch (error) {
    console.error('Reschedule notification error:', error);
    return false;
  }
};

/**
 * Get booking statistics for staff dashboard
 */
export const getBookingStats = async () => {
  try {
    const { data: allBookings } = await supabase
      .from('bookings')
      .select('status, booking_type');

    if (!allBookings) return {};

    return {
      total: allBookings.length,
      pending: allBookings.filter(b => b.status === 'Payment Pending').length,
      approved: allBookings.filter(b => b.status === 'Approved').length,
      rejected: allBookings.filter(b => b.status === 'Rejected').length,
      tests: allBookings.filter(b => b.booking_type === 'test').length,
      doctors: allBookings.filter(b => b.booking_type === 'doctor').length,
      medicine: allBookings.filter(b => b.booking_type === 'medicine').length
    };
  } catch (error) {
    console.error('Get booking stats error:', error);
    return {};
  }
};
