import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Receipt,
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PaymentDashboard = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [userId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          booking:booking_id(
            reference_number,
            booking_type,
            appointment_date,
            patient:patient_id(name, email, phone, address)
          )
        `)
        .or(`user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      'processing': { color: 'bg-blue-100 text-blue-800', icon: RefreshCw, label: 'Processing' },
      'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
      'failed': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
      'refunded': { color: 'bg-purple-100 text-purple-800', icon: AlertCircle, label: 'Refunded' }
    };
    return configs[status] || configs['pending'];
  };

  const generateInvoice = async (payment) => {
    try {
      setGenerating(true);
      const doc = new jsPDF();

      // Header
      doc.setFillColor(0, 168, 107);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('AASHA MEDIX', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Medical Services Invoice', 105, 30, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Invoice Details
      doc.setFontSize(10);
      doc.text(`Invoice Number: ${payment.invoice_number || payment.id.slice(0, 8)}`, 20, 55);
      doc.text(`Date: ${new Date(payment.created_at).toLocaleDateString('en-IN')}`, 20, 62);
      doc.text(`Payment Status: ${payment.status.toUpperCase()}`, 20, 69);

      // Patient Details
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Patient Details:', 20, 85);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Name: ${payment.booking?.patient?.name || 'N/A'}`, 20, 92);
      doc.text(`Email: ${payment.booking?.patient?.email || 'N/A'}`, 20, 99);
      doc.text(`Phone: ${payment.booking?.patient?.phone || 'N/A'}`, 20, 106);
      doc.text(`Address: ${payment.booking?.patient?.address || 'N/A'}`, 20, 113);

      // Booking Details
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Booking Details:', 20, 130);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text(`Booking Reference: ${payment.booking?.reference_number || 'N/A'}`, 20, 137);
      doc.text(`Service Type: ${payment.booking?.booking_type || 'N/A'}`, 20, 144);
      doc.text(`Appointment Date: ${payment.booking?.appointment_date ? new Date(payment.booking.appointment_date).toLocaleDateString('en-IN') : 'N/A'}`, 20, 151);

      // Payment Details Table
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Payment Details:', 20, 170);

      // Table header
      doc.setFillColor(230, 245, 240);
      doc.rect(20, 175, 170, 10, 'F');
      doc.setFontSize(10);
      doc.text('Description', 25, 182);
      doc.text('Amount', 170, 182, { align: 'right' });

      // Table content
      doc.setFont(undefined, 'normal');
      let yPos = 192;
      doc.text(`${payment.booking?.booking_type || 'Service'} Fee`, 25, yPos);
      doc.text(`₹ ${payment.amount.toFixed(2)}`, 185, yPos, { align: 'right' });

      if (payment.discount_amount > 0) {
        yPos += 10;
        doc.text('Discount', 25, yPos);
        doc.text(`- ₹ ${payment.discount_amount.toFixed(2)}`, 185, yPos, { align: 'right' });
      }

      if (payment.tax_amount > 0) {
        yPos += 10;
        doc.text('Tax (GST)', 25, yPos);
        doc.text(`₹ ${payment.tax_amount.toFixed(2)}`, 185, yPos, { align: 'right' });
      }

      // Total
      yPos += 15;
      doc.setFillColor(0, 168, 107);
      doc.rect(20, yPos - 7, 170, 12, 'F');
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('Total Amount', 25, yPos);
      doc.text(`₹ ${payment.total_amount.toFixed(2)}`, 185, yPos, { align: 'right' });

      // Payment Method
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPos += 20;
      doc.text(`Payment Method: ${payment.payment_method || 'Online'}`, 20, yPos);
      doc.text(`Transaction ID: ${payment.transaction_id || 'N/A'}`, 20, yPos + 7);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for choosing Aasha Medix', 105, 270, { align: 'center' });
      doc.text('For queries, contact: support@aashamedix.com | 1800-AASHA-1', 105, 277, { align: 'center' });

      // Save PDF
      doc.save(`Invoice_${payment.invoice_number || payment.id.slice(0, 8)}.pdf`);

      // Update invoice_generated flag
      await supabase
        .from('payments')
        .update({ invoice_generated: true })
        .eq('id', payment.id);

      fetchPayments();
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setGenerating(false);
    }
  };

  const retryPayment = async (paymentId) => {
    try {
      // Implement payment retry logic here
      // This would integrate with your payment gateway
      await supabase
        .from('payments')
        .update({ status: 'processing' })
        .eq('id', paymentId);

      fetchPayments();
    } catch (error) {
      console.error('Error retrying payment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F1F1F]">Payments & Invoices</h1>
          <p className="text-[#6B7280] mt-1">Track your payment history and download invoices</p>
        </div>
        <Button onClick={fetchPayments} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Completed</p>
                <p className="text-xl font-bold text-[#1F1F1F]">
                  {payments.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Pending</p>
                <p className="text-xl font-bold text-[#1F1F1F]">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Failed</p>
                <p className="text-xl font-bold text-[#1F1F1F]">
                  {payments.filter(p => p.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Total Paid</p>
                <p className="text-xl font-bold text-[#1F1F1F]">
                  ₹{payments
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + p.total_amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="w-6 h-6 text-[#00A86B] animate-spin mx-auto mb-2" />
            <p className="text-[#6B7280]">Loading payments...</p>
          </CardContent>
        </Card>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#6B7280] font-medium">No payments found</p>
            <p className="text-sm text-[#9CA3AF]">Your payment history will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => {
            const statusConfig = getPaymentStatusConfig(payment.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-[#E6F5F0] flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-[#00A86B]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1F1F1F]">
                              ₹{payment.total_amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-[#6B7280] font-mono">
                              {payment.invoice_number || payment.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-[#6B7280]">Booking Ref</p>
                            <p className="text-sm font-medium text-[#1F1F1F]">
                              {payment.booking?.reference_number || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280]">Service</p>
                            <p className="text-sm font-medium text-[#1F1F1F] capitalize">
                              {payment.booking?.booking_type || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280]">Payment Date</p>
                            <p className="text-sm font-medium text-[#1F1F1F]">
                              {new Date(payment.created_at).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>

                        {payment.status === 'completed' && (
                          <Button
                            onClick={() => generateInvoice(payment)}
                            disabled={generating}
                            size="sm"
                            className="gap-2 bg-[#00A86B] hover:bg-[#008F5A]"
                          >
                            <Download className="w-4 h-4" />
                            {generating ? 'Generating...' : 'Invoice'}
                          </Button>
                        )}

                        {payment.status === 'failed' && (
                          <Button
                            onClick={() => retryPayment(payment.id)}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;
