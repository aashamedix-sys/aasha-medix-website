
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingDetails from '@/components/BookingDetails';
import { Helmet } from 'react-helmet';

const OrderMedicineCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = location.state || {};

  // If accessed directly without items, redirect
  if (!cartItems && !location.state?.prescriptionFile) {
     // For testing/dev, we might allow direct access, but usually redirect
     // navigate('/order-medicine');
  }

  const items = cartItems || [];
  const displayAmount = totalAmount || 0;

  return (
    <>
      <Helmet><title>Checkout - Medicine Order</title></Helmet>
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
          <BookingDetails 
             type="medicine"
             items={items}
             totalAmount={displayAmount}
             onBack={() => navigate('/order-medicine')}
          />
        </div>
      </div>
    </>
  );
};

export default OrderMedicineCheckout;
