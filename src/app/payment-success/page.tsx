'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, Bell, ArrowLeft } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4'>
      <div className='text-center max-w-lg'>
        {/* Icon */}
        <div className='mb-8 flex justify-center'>
          <div className='relative'>
            <div className='w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl'>
              <CheckCircle className='w-16 h-16 text-white' />
            </div>
            <div className='absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-pulse'>
              <Loader2 className='w-4 h-4 text-white animate-spin' />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className='text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
          Your Payment is Confirmed
        </h1>

        <div className='space-y-4 mb-8'>
          <div className='flex items-center justify-center gap-3 text-lg text-muted-foreground'>
            <Loader2 className='w-5 h-5 text-amber-500 animate-spin' />
            <span>Order Processing</span>
          </div>

          <div className='flex items-center justify-center gap-3 text-lg text-muted-foreground'>
            <Bell className='w-5 h-5 text-rose-500' />
            <span>We will notify you soon</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className='inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-rose-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/30'
        >
          <ArrowLeft className='w-5 h-5' />
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-background flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-rose-600' />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
