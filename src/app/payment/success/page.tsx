'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { CheckCircle, ArrowRight, Home, Download, Mail } from 'lucide-react';

function SuccessContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get order details from URL params or localStorage
    const orderId = searchParams.get('order') || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const planDetails: Record<string, { name: string; price: string; period: string }> = {
      monthly: { name: 'Monthly Plan', price: '30', period: '/month' }
    };

    setOrderDetails({
      id: orderId,
      plan: planDetails.monthly,
      date: new Date().toLocaleDateString(),
      email: user?.email || ''
    });
  }, [searchParams, user]);

  const handleDownloadInvoice = () => {
    // Simulate invoice download for demo
    const invoiceData = {
      orderId: orderDetails?.id,
      plan: orderDetails?.plan.name,
      amount: orderDetails?.plan.price,
      date: orderDetails?.date,
      email: orderDetails?.email,
      note: 'This is a demo invoice for demonstration purposes'
    };
    
    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demo-invoice-${orderDetails?.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='py-12 px-4'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div
          className='absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className='max-w-4xl mx-auto relative'>
        <div className='text-center mb-12'>
          <div className='w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6'>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
          <h1 className='text-4xl font-bold mb-4 ubuntu-font bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
            Demo Payment Successful!
          </h1>
          <p className='text-lg text-muted-foreground'>
            Thank you for testing our payment system. This is a demonstration.
          </p>
        </div>

        {orderDetails && (
          <div className='grid md:grid-cols-2 gap-8 mb-12'>
            {/* Order Details */}
            <div className='bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm bg-opacity-95'>
              <div className='bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white'>
                <h2 className='text-xl font-bold'>Order Details</h2>
              </div>
              <div className='p-6 space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Order ID</span>
                  <span className='font-mono font-semibold'>{orderDetails.id}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Plan</span>
                  <span className='font-semibold'>{orderDetails.plan.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Amount</span>
                  <span className='font-semibold text-green-600'>${orderDetails.plan.price}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Date</span>
                  <span className='font-semibold'>{orderDetails.date}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Email</span>
                  <span className='font-semibold'>{orderDetails.email}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className='bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm bg-opacity-95'>
              <div className='bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white'>
                <h2 className='text-xl font-bold'>What's Next?</h2>
              </div>
              <div className='p-6 space-y-4'>
                <div className='flex items-start gap-3'>
                  <Mail className='w-5 h-5 text-rose-500 mt-1 flex-shrink-0' />
                  <div>
                    <p className='font-medium mb-1'>Check your email</p>
                    <p className='text-sm text-muted-foreground'>
                      We've sent a confirmation email with your order details and receipt.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Home className='w-5 h-5 text-rose-500 mt-1 flex-shrink-0' />
                  <div>
                    <p className='font-medium mb-1'>Access your dashboard</p>
                    <p className='text-sm text-muted-foreground'>
                      Start using your new features right away from your dashboard.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Download className='w-5 h-5 text-rose-500 mt-1 flex-shrink-0' />
                  <div>
                    <p className='font-medium mb-1'>Download invoice</p>
                    <p className='text-sm text-muted-foreground'>
                      Get a copy of your invoice for your records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={() => router.push('/dashboard')}
            className='bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 group'
          >
            Go to Dashboard
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </button>
          
          <button
            onClick={handleDownloadInvoice}
            className='bg-card border-2 border-border text-foreground px-8 py-4 rounded-2xl font-bold hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group'
          >
            <Download className='w-5 h-5' />
            Download Invoice
          </button>
        </div>

        {/* Support Section */}
        <div className='mt-16 text-center'>
          <div className='bg-muted/30 rounded-2xl p-8 max-w-2xl mx-auto'>
            <h3 className='text-xl font-bold mb-4'>Need Help?</h3>
            <p className='text-muted-foreground mb-6'>
              If you have any questions about your order or need assistance, our support team is here to help.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() => router.push('/contact')}
                className='bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:bg-foreground/90 transition-colors'
              >
                Contact Support
              </button>
              <button
                onClick={() => window.open('mailto:support@teacupnet.com')}
                className='bg-card border-2 border-border text-foreground px-6 py-3 rounded-xl font-medium hover:border-rose-500 transition-colors'
              >
                Email Us
              </button>
            </div>
          </div>
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
