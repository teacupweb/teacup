'use client';

import { useState } from 'react';
import {
  PaymentElementWrapper,
  PaddleCheckoutWrapper,
} from '@/components/payment';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Suspense } from 'react';

const sampleItems = [
  {
    priceId: process.env.NEXT_PUBLIC_PADDLE_DEFAULT_PRICE_ID || 'price_123',
    name: 'Plan',
    description: 'Monthly subscription to all features',
    price: 50.0,
    quantity: 1,
  },
];

function PaddlePaymentContent() {
  const [paymentMethod, setPaymentMethod] = useState<'element' | 'checkout'>(
    'element',
  );

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>
            Paddle Payment Integration
          </h1>
          <p className='text-muted-foreground'>
            Choose your preferred payment method
          </p>
        </div>

        <Tabs
          value={paymentMethod}
          onValueChange={(value) =>
            setPaymentMethod(value as 'element' | 'checkout')
          }
        >
          <TabsList className='grid w-full grid-cols-2 mb-8'>
            <TabsTrigger value='element'>Payment Form</TabsTrigger>
            <TabsTrigger value='checkout'>Paddle Checkout</TabsTrigger>
          </TabsList>

          <TabsContent value='element' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Direct Payment</CardTitle>
                <CardDescription>
                  Pay directly on this page using Paddle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentElementWrapper
                  amount={29.99}
                  currency='usd'
                  metadata={{
                    product: 'Premium Plan',
                    plan_type: 'monthly',
                  }}
                  onSuccess={(checkoutData) => {
                    console.log('Payment successful:', checkoutData);
                    window.location.href = '/payment/paddle/success';
                  }}
                  onError={(error) => {
                    console.error('Payment failed:', error);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='checkout' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Paddle Checkout</CardTitle>
                <CardDescription>
                  Redirect to Paddle's hosted checkout page for payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaddleCheckoutWrapper
                  items={sampleItems}
                  onSuccess={(checkoutId) => {
                    console.log('Checkout completed:', checkoutId);
                  }}
                  onError={(error) => {
                    console.error('Checkout failed:', error);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className='mt-8 text-center text-sm text-muted-foreground'>
          <p>Test mode: Paddle sandbox environment is active</p>
        </div>
      </div>
    </div>
  );
}

export default function PaddlePaymentPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        <Suspense
          fallback={
            <div className='flex items-center justify-center min-h-[60vh]'>
              <div className='animate-pulse text-xl font-medium text-rose-600'>
                Loading payment page...
              </div>
            </div>
          }
        >
          <PaddlePaymentContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
