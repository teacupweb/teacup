'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface PaymentFormProps {
  clientSecret: string;
  customerEmail: string;
  customerName: string;
  plan: string;
  amount: number;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: any) => void;
}

export function PaymentForm({ 
  clientSecret, 
  customerEmail, 
  customerName, 
  plan, 
  amount,
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/stripe/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        onError?.(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create order in backend after successful payment
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/payment/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: customerEmail,
              name: customerName,
              plan,
              amount,
              stripePaymentIntentId: paymentIntent.id,
              metadata: {
                paymentMethod: 'payment_element',
                timestamp: new Date().toISOString(),
              },
            }),
          });

          if (response.ok) {
            const orderData = await response.json();
            console.log('Order created:', orderData);
            toast.success('Payment successful and order created!');
            onSuccess?.({ ...paymentIntent, order: orderData.order });
          } else {
            console.error('Failed to create order');
            toast.success('Payment successful! (Order creation failed)');
            onSuccess?.(paymentIntent);
          }
        } catch (orderError) {
          console.error('Order creation error:', orderError);
          toast.success('Payment successful! (Order creation failed)');
          onSuccess?.(paymentIntent);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('An unexpected error occurred');
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}
