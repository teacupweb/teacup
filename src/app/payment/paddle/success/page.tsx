'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');
    
    if (sessionId || paymentIntentId) {
      // You can fetch payment details from your backend here
      setPaymentDetails({
        sessionId,
        paymentIntentId,
        status: 'succeeded',
        amount: 29.99,
      });
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              Transaction details for your records
            </CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-4">
            {paymentDetails ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="font-semibold text-green-600">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold">${paymentDetails.amount}</span>
                </div>
                {paymentDetails.sessionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="font-mono text-sm">{paymentDetails.sessionId}</span>
                  </div>
                )}
                {paymentDetails.paymentIntentId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Intent ID:</span>
                    <span className="font-mono text-sm">{paymentDetails.paymentIntentId}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Loading payment details...</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href="/">Return Home</a>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>A confirmation email has been sent to your registered email address.</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        <Suspense fallback={
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='animate-pulse text-xl font-medium text-rose-600'>Loading...</div>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
