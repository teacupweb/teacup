'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { CreditCard, ShieldCheck, Mail, User, ArrowRight } from 'lucide-react';

function CheckoutContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'monthly';

  const planDetails: Record<string, { name: string; price: string; period: string }> = {
    monthly: { name: 'Monthly Plan', price: '40', period: '/month' },
    lifetime: { name: 'Lifetime Access', price: '500', period: ' one-time' },
  };

  const selectedPlan = planDetails[plan] || planDetails.monthly;

  useEffect(() => {
    if (user === 'userNotFound') {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, router]);

  if (user === null || user === 'userNotFound') {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='animate-pulse text-xl font-medium text-rose-600'>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className='py-12 px-4'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 ubuntu-font'>Complete Your Purchase</h1>
        
        <div className='grid lg:grid-cols-3 gap-12'>
          {/* Order Summary - Right side on desktop, top on mobile */}
          <div className='lg:order-2 lg:col-span-1'>
            <div className='bg-card border border-border rounded-3xl p-8 sticky top-8 shadow-sm'>
              <h2 className='text-xl font-bold mb-6'>Order Summary</h2>
              
              <div className='flex justify-between mb-4'>
                <span className='text-muted-foreground'>{selectedPlan.name}</span>
                <span className='font-semibold'>${selectedPlan.price}</span>
              </div>
              
              <div className='border-t border-border my-4 pt-4 flex justify-between items-center'>
                <span className='text-xl font-bold'>Total</span>
                <div className='text-right'>
                  <span className='text-2xl font-bold text-rose-600'>${selectedPlan.price}</span>
                  <span className='block text-xs text-muted-foreground'>{selectedPlan.period}</span>
                </div>
              </div>
              
              <div className='mt-8 space-y-4'>
                <div className='flex gap-3 text-sm text-muted-foreground items-center'>
                  <ShieldCheck className='w-5 h-5 text-green-500' />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className='flex gap-3 text-sm text-muted-foreground items-center'>
                  <CreditCard className='w-5 h-5 text-rose-500' />
                  <span>Safe & reliable payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className='lg:order-1 lg:col-span-2 space-y-8'>
            <div className='bg-card border border-border rounded-3xl p-8'>
              <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <User className='w-5 h-5 text-rose-600' />
                Billing Information
              </h2>
              
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Full Name</label>
                  <input 
                    type='text' 
                    defaultValue={user.user_metadata?.name || ''}
                    className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-rose-500 focus:outline-none transition-colors'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Email Address</label>
                  <input 
                    type='email' 
                    defaultValue={user.email || ''}
                    disabled
                    className='w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-muted-foreground'
                  />
                </div>
              </div>
            </div>

            <div className='bg-card border border-border rounded-3xl p-8'>
              <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <CreditCard className='w-5 h-5 text-rose-600' />
                Payment Method
              </h2>
              
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Card Number</label>
                  <div className='relative'>
                    <input 
                      type='text' 
                      placeholder='0000 0000 0000 0000'
                      className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-rose-500 focus:outline-none transition-colors pr-12'
                    />
                    <CreditCard className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5' />
                  </div>
                </div>
                
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Expiry Date</label>
                    <input 
                      type='text' 
                      placeholder='MM / YY'
                      className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-rose-500 focus:outline-none transition-colors'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>CVC</label>
                    <input 
                      type='text' 
                      placeholder='123'
                      className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-rose-500 focus:outline-none transition-colors'
                    />
                  </div>
                </div>
              </div>
              
              <button 
                className='w-full mt-10 bg-linear-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 group'
                onClick={() => alert('This is a demo checkout page. No payment was processed.')}
              >
                Complete Payment ${selectedPlan.price}
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </button>
              
              <p className='text-center text-xs text-muted-foreground mt-4 italic'>
                By clicking "Complete Payment", you agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        <Suspense fallback={<div className='flex items-center justify-center min-h-[60vh]'>Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
