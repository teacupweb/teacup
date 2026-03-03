'use client';

import { useState } from 'react';
import { PaymentForm } from './payment-form';
import { PaddleProvider } from './paddle-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface PaymentElementWrapperProps {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  priceId?: string;
  onSuccess?: (checkoutData: any) => void;
  onError?: (error: any) => void;
}

export function PaymentElementWrapper({
  amount,
  currency = 'usd',
  metadata = {},
  priceId,
  onSuccess,
  onError
}: PaymentElementWrapperProps) {
  return (
    <PaddleProvider>
      <PaymentForm
        amount={amount}
        plan={metadata.plan || 'Premium Plan'}
        priceId={priceId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </PaddleProvider>
  );
}
