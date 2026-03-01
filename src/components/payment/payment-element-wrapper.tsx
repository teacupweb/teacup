'use client';

import { useState, useEffect } from 'react';
import { PaymentForm } from './payment-form';
import { StripeProvider } from './stripe-provider';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface PaymentElementWrapperProps {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: any) => void;
}

export function PaymentElementWrapper({ 
  amount, 
  currency = 'usd', 
  metadata = {},
  onSuccess, 
  onError 
}: PaymentElementWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
  });

  useEffect(() => {
    createPaymentIntent();
  }, [amount, currency]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Payment intent creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initialize payment');
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Initializing payment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Failed to initialize payment</p>
            <Button onClick={createPaymentIntent}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <StripeProvider>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Enter your payment information securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Amount: <span className="font-semibold">${amount.toFixed(2)} {currency.toUpperCase()}</span>
            </p>
          </div>
          
          {customerInfo.email && customerInfo.name && (
            <PaymentForm 
              clientSecret={clientSecret}
              customerEmail={customerInfo.email}
              customerName={customerInfo.name}
              plan={metadata.plan || 'Premium Plan'}
              amount={amount}
              onSuccess={onSuccess}
              onError={onError}
            />
          )}
        </CardContent>
      </Card>
    </StripeProvider>
  );
}
