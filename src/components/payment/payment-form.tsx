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
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function PaymentForm({
  customerEmail: propEmail,
  customerName: propName,
  plan = 'Premium Plan',
  amount = 0,
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

    // Form submission handler - implement your own logic here
    console.log('Payment form submitted:', {
      customerEmail,
      customerName,
      plan,
      amount,
    });

    toast.success('Form submitted - implement your own payment logic');
    
    onSuccess?.({
      email: customerEmail,
      name: customerName,
      plan,
      amount,
    });
    
    setIsLoading(false);
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
