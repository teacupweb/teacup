'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { toast } from 'sonner';
import { DEFAULT_PLAN } from '@/lib/config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle,
  Loader2,
  Building,
  User,
  Mail,
  MapPin,
} from 'lucide-react';

const paymentSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Full name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

function PaymentContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: '',
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  const planPrice = parseFloat(DEFAULT_PLAN.price);
  const tax = 0;
  const total = planPrice + tax;

  useEffect(() => {
    if (user === 'userNotFound') {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, router]);

  useEffect(() => {
    // Pre-fill user data if logged in
    if (user && user !== 'userNotFound') {
      reset({
        email: user.email || '',
        name: user.user_metadata?.name || '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      });
    }
  }, [user, reset]);

  if (user === null || user === 'userNotFound') {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='animate-pulse text-xl font-medium text-rose-600'>
          Redirecting to login...
        </div>
      </div>
    );
  }

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);

    // Implement your own payment logic here
    console.log('Payment submitted:', {
      data,
      total,
    });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/payment/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        total,
      }),
    }).then((res) => {
      console.log(res);
    });
    // .then((res) => res.json())
    // .then((response) => {
    //   console.log('Payment API response:', response);
    //   toast.success('Payment successful! Implement your own success logic.');
    // })
    // .catch((error) => {
    //   console.error('Payment API error:', error);
    //   toast.error('Payment failed. Please try again.');
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });

    setIsLoading(false);
  };

  return (
    <div className='py-8 px-4'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div
          className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className='max-w-4xl mx-auto relative'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-2 ubuntu-font bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent'>
            Checkout
          </h1>
          <p className='text-muted-foreground'>Complete your purchase</p>
        </div>

        {/* Single Payment Card */}
        <div className='bg-card rounded-3xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm bg-opacity-95'>
          {/* Card Header */}
          <div className='bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold'>Payment Details</h2>
                <p className='text-rose-100 text-sm mt-1'>
                  Enter your information to complete the purchase
                </p>
              </div>
              <div className='flex gap-2'>
                <div className='bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium'>
                  Secure Form
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='p-6 space-y-8'>
              {/* Order Summary Section */}
              <section>
                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-rose-600' />
                  Order Summary
                </h3>
                <div className='bg-muted/50 rounded-2xl p-4 space-y-3'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='font-semibold'>{DEFAULT_PLAN.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {DEFAULT_PLAN.period}
                      </p>
                    </div>
                    <p className='text-lg font-bold'>${planPrice.toFixed(2)}</p>
                  </div>
                  <div className='border-t border-border pt-3 space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Subtotal</span>
                      <span>${planPrice.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className='border-t border-border pt-3 flex justify-between items-center'>
                      <span className='font-bold'>Total</span>
                      <div className='text-right'>
                        <span className='text-2xl font-bold text-rose-600'>
                          ${total.toFixed(2)}
                        </span>
                        <span className='block text-xs text-muted-foreground'>
                          {DEFAULT_PLAN.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Information Section */}
              <section>
                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <User className='w-5 h-5 text-rose-600' />
                  Contact Information
                </h3>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium' htmlFor='email'>
                      Email Address
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                      <input
                        id='email'
                        type='email'
                        placeholder='your@email.com'
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 bg-background focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-rose-500'
                        }`}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className='text-sm text-red-500'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium' htmlFor='name'>
                      Full Name
                    </label>
                    <div className='relative'>
                      <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                      <input
                        id='name'
                        type='text'
                        placeholder='John Doe'
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 bg-background focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-rose-500'
                        }`}
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className='text-sm text-red-500'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Billing Address Section */}
              <section>
                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <Building className='w-5 h-5 text-rose-600' />
                  Billing Address (Optional)
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium' htmlFor='address'>
                      Street Address
                    </label>
                    <div className='relative'>
                      <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                      <input
                        id='address'
                        type='text'
                        placeholder='123 Main Street, Apt 4B'
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 bg-background focus:outline-none transition-colors ${
                          errors.address
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-rose-500'
                        }`}
                        {...register('address')}
                      />
                    </div>
                    {errors.address && (
                      <p className='text-sm text-red-500'>
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className='grid md:grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium' htmlFor='city'>
                        City
                      </label>
                      <input
                        id='city'
                        type='text'
                        placeholder='New York'
                        className={`w-full px-4 py-2.5 rounded-xl border-2 bg-background focus:outline-none transition-colors ${
                          errors.city
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-rose-500'
                        }`}
                        {...register('city')}
                      />
                      {errors.city && (
                        <p className='text-sm text-red-500'>
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label
                        className='text-sm font-medium'
                        htmlFor='postalCode'
                      >
                        Postal Code
                      </label>
                      <input
                        id='postalCode'
                        type='text'
                        placeholder='10001'
                        className={`w-full px-4 py-2.5 rounded-xl border-2 bg-background focus:outline-none transition-colors ${
                          errors.postalCode
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-rose-500'
                        }`}
                        {...register('postalCode')}
                      />
                      {errors.postalCode && (
                        <p className='text-sm text-red-500'>
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium' htmlFor='country'>
                        Country
                      </label>
                      <input
                        id='country'
                        type='text'
                        placeholder='United States'
                        className={`w-full px-4 py-2.5 rounded-xl border-2 bg-background focus:outline-none transition-colors ${
                          errors.country
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-rose-500'
                        }`}
                        {...register('country')}
                      />
                      {errors.country && (
                        <p className='text-sm text-red-500'>
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Notice */}
              <div className='bg-muted/50 rounded-2xl p-4'>
                <div className='flex items-start gap-3'>
                  <ShieldCheck className='w-6 h-6 text-green-600 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='font-medium text-sm'>Secure Form</p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      This is a payment information collection form. Implement
                      your own payment processing logic.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className='w-5 h-5' />
                    Submit Payment
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className='flex flex-wrap justify-center gap-4 pt-2 border-t border-border'>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <ShieldCheck className='w-4 h-4 text-green-600' />
                  <span>Secure Form</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <Lock className='w-4 h-4 text-rose-600' />
                  <span>Data Protected</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <CheckCircle className='w-4 h-4 text-blue-600' />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className='text-center mt-6 text-sm text-muted-foreground'>
          <p>
            By completing this purchase, you agree to our{' '}
            <a href='/terms' className='text-rose-600 hover:underline'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='/refund-policy' className='text-rose-600 hover:underline'>
              Refund Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
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
          <PaymentContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
