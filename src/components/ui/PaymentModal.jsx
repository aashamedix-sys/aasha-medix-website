
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, Smartphone, ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const PaymentModal = ({ isOpen, onClose, amount, serviceName, patientId, appointmentId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('card');

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate Razorpay processing delay
    setTimeout(async () => {
        // Record payment in Supabase
        const { error } = await supabase.from('payments').insert({
            patient_id: patientId,
            appointment_id: appointmentId,
            amount: amount,
            service: serviceName,
            status: 'Completed',
            payment_gateway_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
        });

        if (error) {
            toast({ title: "Payment Failed", description: "Could not record transaction.", variant: "destructive" });
        } else {
            toast({ 
                title: "Payment Successful! 🎉", 
                description: `₹${amount} paid successfully for ${serviceName}.` 
            });
            if (onSuccess) onSuccess();
            onClose();
        }
        setLoading(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Secure Payment</DialogTitle>
          <DialogDescription>
            Complete your payment for <strong>{serviceName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-2xl font-bold text-green-700">₹{amount}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Button 
                    variant={method === 'card' ? 'default' : 'outline'} 
                    className={method === 'card' ? 'bg-green-600' : ''}
                    onClick={() => setMethod('card')}
                >
                    <CreditCard className="w-4 h-4 mr-2" /> Card
                </Button>
                <Button 
                    variant={method === 'upi' ? 'default' : 'outline'}
                    className={method === 'upi' ? 'bg-green-600' : ''}
                    onClick={() => setMethod('upi')}
                >
                    <Smartphone className="w-4 h-4 mr-2" /> UPI
                </Button>
                <Button 
                    variant={method === 'wallet' ? 'default' : 'outline'}
                    className={method === 'wallet' ? 'bg-green-600' : ''}
                    onClick={() => setMethod('wallet')}
                >
                    <Wallet className="w-4 h-4 mr-2" /> Wallet
                </Button>
            </div>

            {method === 'card' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="MM/YY" />
                        <Input placeholder="CVV" />
                    </div>
                </div>
            )}
             {method === 'upi' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input id="upiId" placeholder="username@bank" />
                </div>
            )}
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
           <Button onClick={handlePayment} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-lg h-12">
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-2">
            <ShieldCheck className="w-3 h-3 text-green-600" />
            Secured by Razorpay (Test Mode)
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
