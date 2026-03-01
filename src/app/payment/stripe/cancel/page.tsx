'use client';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Suspense } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function CancelContent() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment has been cancelled. No charges were made to your account.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
            <CardDescription>
              You cancelled the payment process before completion
            </CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Possible reasons:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>You decided not to proceed with the purchase</li>
                <li>You encountered an issue during the payment process</li>
                <li>You were redirected away from the payment page</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Next steps:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Your cart has been saved and you can try again</li>
                <li>No payment information was stored</li>
                <li>You can contact support if you need assistance</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <a href="/payment/stripe">Try Again</a>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href="/">Return Home</a>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>If you believe this was an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        <Suspense fallback={
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='animate-pulse text-xl font-medium text-rose-600'>Loading...</div>
          </div>
        }>
          <CancelContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
