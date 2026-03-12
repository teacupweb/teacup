'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if payment was successful
    const checkoutId = searchParams.get('checkout_id');
    const orderId = searchParams.get('order_id');

    if (checkoutId || orderId) {
      console.log('Payment successful!', { checkoutId, orderId });
      setIsChecking(false);
    } else {
      // If no payment info, redirect to pricing after delay
      const timer = setTimeout(() => {
        router.push('/pricing');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (isChecking) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 animate-spin mx-auto text-rose-600 mb-4' />
          <p className='text-lg font-medium text-foreground'>Verifying payment...</p>
        </div>
      </div>
    );
  }

  const checkoutId = searchParams.get('checkout_id');
  const orderId = searchParams.get('order_id');

  if (!checkoutId && !orderId) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <p className='text-lg font-medium text-foreground'>No payment information found</p>
          <p className='text-sm text-muted-foreground mt-2'>Redirecting to pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='py-12 px-4'>
      <div className='max-w-2xl mx-auto'>
        {/* Success Card */}
        <div className='bg-card rounded-3xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm bg-opacity-95'>
          {/* Header */}
          <div className='bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center'>
            <div className='flex justify-center mb-4'>
              <CheckCircle className='w-20 h-20' />
            </div>
            <h1 className='text-3xl font-bold mb-2'>Payment Successful!</h1>
            <p className='text-green-100'>Thank you for your purchase</p>
          </div>

          {/* Content */}
          <div className='p-8 space-y-6'>
            <div className='bg-muted/50 rounded-2xl p-6 space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Order ID</span>
                <span className='font-mono font-medium'>{orderId || 'N/A'}</span>
              </div>
              {checkoutId && (
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Checkout ID</span>
                  <span className='font-mono font-medium'>{checkoutId}</span>
                </div>
              )}
              <div className='border-t border-border pt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Status</span>
                  <span className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium'>
                    <CheckCircle className='w-4 h-4' />
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>What's Next?</h2>
              <ul className='space-y-3'>
                <li className='flex items-start gap-3'>
                  <CheckCircle className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span className='text-foreground'>You'll receive a confirmation email shortly</span>
                </li>
                <li className='flex items-start gap-3'>
                  <CheckCircle className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span className='text-foreground'>Your subscription is now active</span>
                </li>
                <li className='flex items-start gap-3'>
                  <CheckCircle className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
                  <span className='text-foreground'>Access all premium features from your dashboard</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className='flex flex-col sm:flex-row gap-4 pt-6'>
              <Button
                onClick={() => router.push('/dashboard')}
                className='flex-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-6 rounded-xl font-bold text-lg hover:from-rose-700 hover:to-pink-700 transition-all'
              >
                Go to Dashboard
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
              <Button
                onClick={() => router.push('/pricing')}
                variant='outline'
                className='flex-1 py-6 rounded-xl font-bold text-lg'
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className='text-center mt-8 text-sm text-muted-foreground'>
          <p>Need help? Contact our support team at{' '}
            <a href='mailto:support@teacup.website' className='text-rose-600 hover:underline'>
              support@teacup.website
            </a>
          </p>
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
        <Suspense
          fallback={
            <div className='flex items-center justify-center min-h-[60vh]'>
              <div className='animate-pulse text-xl font-medium text-rose-600'>
                Loading...
              </div>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
