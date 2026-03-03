'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface PaymentFormProps {
  customerEmail?: string;
  customerName?: string;
  plan?: string;
  amount?: number;
  priceId?: string;
  onSuccess?: (checkoutData: any) => void;
  onError?: (error: any) => void;
}

export function PaymentForm({
  customerEmail: propEmail,
  customerName: propName,
  plan = 'Premium Plan',
  amount = 0,
  priceId,
  onSuccess,
  onError
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(propEmail || '');
  const [customerName, setCustomerName] = useState(propName || '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerEmail || !customerName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            priceId: priceId || process.env.NEXT_PUBLIC_PADDLE_DEFAULT_PRICE_ID,
            quantity: 1,
            name: plan,
            price: amount,
          }],
          customerEmail,
          customerName,
          successUrl: `${window.location.origin}/payment/paddle/success`,
          cancelUrl: `${window.location.origin}/payment/paddle/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Open Paddle checkout
      if (typeof window !== 'undefined' && (window as any).Paddle) {
        (window as any).Paddle.Checkout.open({
          checkout: data.checkoutId || data.sessionId,
          successCallback: async (checkoutData: any) => {
            console.log('Checkout success:', checkoutData);
            
            // Create order in backend after successful payment
            try {
              const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/payment/create-order`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: customerEmail,
                  name: customerName,
                  plan,
                  amount,
                  paddleOrderId: checkoutData.checkoutId,
                  metadata: {
                    paymentMethod: 'paddle',
                    timestamp: new Date().toISOString(),
                  },
                }),
              });

              if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                console.log('Order created:', orderData);
                toast.success('Payment successful and order created!');
                onSuccess?.({ ...checkoutData, order: orderData.order });
              } else {
                console.error('Failed to create order');
                toast.success('Payment successful!');
                onSuccess?.(checkoutData);
              }
            } catch (orderError) {
              console.error('Order creation error:', orderError);
              toast.success('Payment successful!');
              onSuccess?.(checkoutData);
            }
          },
          exitCallback: () => {
            console.log('Checkout exited');
          },
        });
      } else {
        // Fallback: redirect to checkout URL
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your information to complete the purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Plan: <span className="font-semibold">{plan}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Amount: <span className="font-semibold">${amount.toFixed(2)}</span>
          </p>
        </div>

        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !customerEmail || !customerName}
          className="w-full"
        >
          {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </Button>
      </CardContent>
    </Card>
  );
}
