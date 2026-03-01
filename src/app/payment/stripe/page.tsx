'use client';

import { useState } from 'react';
import { PaymentElementWrapper } from '@/components/payment';
import { CheckoutForm } from '@/components/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Suspense } from 'react';

const sampleItems = [
  {
    name: 'Premium Plan',
    description: 'Monthly subscription to premium features',
    price: 29.99,
    quantity: 1,
  },
  {
    name: 'Additional Credits',
    description: 'Extra API credits for your account',
    price: 9.99,
    quantity: 3,
  },
];

function StripePaymentContent() {
  const [paymentMethod, setPaymentMethod] = useState<'element' | 'checkout'>('element');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Stripe Payment Integration</h1>
          <p className="text-muted-foreground">
            Choose your preferred payment method
          </p>
        </div>

        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'element' | 'checkout')}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="element">Payment Element</TabsTrigger>
            <TabsTrigger value="checkout">Stripe Checkout</TabsTrigger>
          </TabsList>

          <TabsContent value="element" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct Payment</CardTitle>
                <CardDescription>
                  Pay directly on this page using Stripe's Payment Element
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentElementWrapper
                  amount={29.99}
                  currency="usd"
                  metadata={{
                    product: 'Premium Plan',
                    plan_type: 'monthly',
                  }}
                  onSuccess={(paymentIntent) => {
                    console.log('Payment successful:', paymentIntent);
                    window.location.href = '/payment/stripe/success';
                  }}
                  onError={(error) => {
                    console.error('Payment failed:', error);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Checkout</CardTitle>
                <CardDescription>
                  Redirect to Stripe's hosted checkout page for payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CheckoutForm
                  items={sampleItems}
                  onSuccess={(sessionId) => {
                    console.log('Checkout session created:', sessionId);
                    // User will be redirected to Stripe Checkout
                  }}
                  onError={(error) => {
                    console.error('Checkout failed:', error);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Test mode: Use card number 4242 4242 4242 4242 for testing</p>
        </div>
      </div>
    </div>
  );
}

export default function StripePaymentPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        <Suspense fallback={
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='animate-pulse text-xl font-medium text-rose-600'>Loading payment page...</div>
          </div>
        }>
          <StripePaymentContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
