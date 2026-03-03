'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface PaddleCheckoutItem {
  priceId: string;
  quantity?: number;
  name?: string;
  price?: number;
}

interface PaddleCheckoutWrapperProps {
  items: PaddleCheckoutItem[];
  customerEmail?: string;
  customerName?: string;
  onSuccess?: (checkoutId: string) => void;
  onError?: (error: any) => void;
}

export function PaddleCheckoutWrapper({
  items,
  customerEmail: propEmail,
  customerName: propName,
  onSuccess,
  onError
}: PaddleCheckoutWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(propEmail || '');
  const [customerName, setCustomerName] = useState(propName || '');

  const handleCheckout = async () => {
    if (!customerEmail) {
      toast.error('Please enter your email address');
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
          items,
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
          successCallback: (checkoutData: any) => {
            console.log('Checkout success:', checkoutData);
            toast.success('Payment successful!');
            onSuccess?.(checkoutData.checkoutId);
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
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete your purchase securely with Paddle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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

        <div className="space-y-2">
          <h3 className="font-semibold">Order Summary</h3>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.name || `Item ${index + 1}`} x {item.quantity || 1}</span>
              <span>${(item.price || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={handleCheckout}
          disabled={isLoading || !customerEmail || !customerName}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </CardContent>
    </Card>
  );
}
