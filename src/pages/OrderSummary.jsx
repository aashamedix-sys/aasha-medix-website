
import React, { useRef } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, ArrowRight, User, Phone, MapPin, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderSummary = () => {
  const location = useLocation();
  const { 
    type = 'Order', // 'Medicine', 'Test', 'Doctor'
    referenceNumber,
    items = [],
    totalAmount,
    patientDetails = {},
    status = 'Confirmed',
    date = new Date().toLocaleDateString(),
    time = new Date().toLocaleTimeString()
  } = location.state || {};
  
  // If accessed directly without state, redirect home
  if (!referenceNumber) {
    return <Navigate to="/" replace />;
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(31, 170, 89); // #1FAA59
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("AASHA MEDIX", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Booking Confirmation", 105, 30, { align: "center" });
    
    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Reference ID: ${referenceNumber}`, 20, 50);
    doc.text(`Date: ${date}`, 20, 56);
    doc.text(`Status: ${status}`, 20, 62);
    
    doc.setFontSize(12);
    doc.text("Patient Details", 20, 75);
    doc.setFontSize(10);
    doc.text(`Name: ${patientDetails.name || patientDetails.patientName || 'N/A'}`, 20, 82);
    doc.text(`Phone: ${patientDetails.phone || patientDetails.mobile || 'N/A'}`, 20, 88);
    if (patientDetails.address) doc.text(`Address: ${patientDetails.address}`, 20, 94);
    
    // Items Table
    const tableColumn = ["Item Description", "Qty/Type", "Price"];
    const tableRows = [];

    items.forEach(item => {
      const price = item.price ? `Rs. ${item.price}` : 'TBD';
      const qty = item.quantity ? item.quantity : (type === 'Doctor' ? 'Consultation' : 'Test');
      tableRows.push([item.name || item.test_name, qty, price]);
    });

    doc.autoTable({
      startY: 105,
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [31, 170, 89] },
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    
    if (totalAmount) {
         doc.setFontSize(12);
         doc.text(`Total Amount: Rs. ${totalAmount}`, 140, finalY);
    } else if (type === 'Medicine') {
         doc.setFontSize(10);
         doc.text("Note: Final bill amount will be shared upon order confirmation.", 20, finalY);
    }

    doc.setFontSize(8);
    doc.text("Thank you for choosing AASHA MEDIX.", 105, 280, { align: "center" });
    doc.text("For support, call +91 8332030109", 105, 285, { align: "center" });

    doc.save(`AASHA-MEDIX-${referenceNumber}.pdf`);
  };

  return (
    <>
      <Helmet>
        <title>Booking Confirmed - AASHA MEDIX</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 pt-28 px-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
        >
          <Card className="bg-white overflow-hidden shadow-xl border-0 rounded-2xl">
            {/* Success Header */}
            <div className="bg-[#1FAA59] p-8 text-center text-white relative">
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                 className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
               >
                 <CheckCircle className="w-10 h-10 text-white" />
               </motion.div>
               <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
               <p className="text-green-50 opacity-90">Your {type.toLowerCase()} request has been received successfully.</p>
               <div className="mt-6 inline-block bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
                 <p className="text-xs font-mono opacity-80 uppercase tracking-widest">Reference ID</p>
                 <p className="text-xl font-bold tracking-wider font-mono">{referenceNumber}</p>
               </div>
            </div>
            
            <div className="p-8">
                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide border-b pb-2">Booking Details</h3>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#1FAA59]" />
                            <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="font-medium text-gray-900">{date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[#1FAA59]" />
                            <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="font-medium text-gray-900">{time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#1FAA59]" />
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide border-b pb-2">Patient Information</h3>
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-[#1FAA59]" />
                            <div>
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="font-medium text-gray-900">{patientDetails.name || patientDetails.patientName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-[#1FAA59]" />
                            <div>
                                <p className="text-xs text-gray-500">Contact</p>
                                <p className="font-medium text-gray-900">{patientDetails.phone || patientDetails.mobile}</p>
                            </div>
                        </div>
                        {patientDetails.address && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#1FAA59] mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500">Address</p>
                                    <p className="font-medium text-gray-900 text-sm">{patientDetails.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                <div>
                                    <span className="font-medium text-gray-700">{item.name || item.test_name}</span>
                                    {item.quantity && <span className="text-gray-500 text-xs ml-2">x{item.quantity}</span>}
                                </div>
                                <span className="font-semibold text-gray-900">{item.price ? `₹${item.price}` : 'TBD'}</span>
                            </div>
                        ))}
                    </div>
                    {totalAmount ? (
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <span className="font-bold text-gray-900">Total Amount</span>
                            <span className="font-bold text-xl text-[#1FAA59]">₹{totalAmount}</span>
                        </div>
                    ) : (
                        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 italic text-center">
                            * Final bill amount will be shared upon order confirmation.
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <Button onClick={generatePDF} variant="outline" className="h-12 border-gray-300 hover:bg-gray-50 hover:text-[#1FAA59]">
                        <Download className="w-4 h-4 mr-2" /> Download Receipt
                    </Button>
                    <Link to="/">
                        <Button className="w-full h-12 bg-[#1FAA59] hover:bg-[#168a46]">
                            Return to Home <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSummary;
