import type { Metadata } from 'next';

import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy | Teacup',
  description: 'Refund policy for Teacupnet services.',
};

export default function RefundPolicyPage() {
  return (
    <div className='bg-background text-foreground transition-colors duration-300'>
      <div className='mx-auto container'>
        <Navbar />
        <main className='min-h-[70vh] py-12 px-4'>
          <div className='max-w-4xl mx-auto space-y-10'>
            <header className='space-y-3'>
              <h1 className='text-5xl ubuntu-font text-center'>
                Refund Policy
              </h1>
              <p className='text-center text-muted-foreground'>
                Effective date: March 4, 2026
              </p>
              <p className='text-muted-foreground'>
                This Refund Policy outlines the conditions under which refunds
                may be requested and processed for Teacupnet services.
              </p>
              <p className='text-sm text-muted-foreground'>
                This page is provided for general information and is not legal
                advice.
              </p>
            </header>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>1. Strict Eligibility</h2>
              <p className='text-muted-foreground'>
                Refunds are only evaluated if the service has not yet been
                initiated. Once work on your order has begun, we cannot offer a
                refund under any circumstances.
              </p>
            </section>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>2. Change of Mind</h2>
              <p className='text-muted-foreground'>
                &quot;Change of mind&quot; or &quot;Finding another
                provider&quot; after work has started does not qualify for a
                refund. Please ensure you are committed to proceeding with our
                services before placing your order.
              </p>
            </section>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>3. Payment Processing</h2>
              <p className='text-muted-foreground'>
                Our order process is conducted by our online reseller Ocean.sh .
                Ocean.sh is the Merchant of Record for all our orders.
              </p>
              <p className='text-muted-foreground'>
                All payment processing is handled securely through Paddle.com,
                and their terms and conditions apply to all transactions.
              </p>
            </section>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>4. Refund Requests</h2>
              <p className='text-muted-foreground'>
                If you believe you qualify for a refund under our eligibility
                criteria, please contact us at{' '}
                <a
                  className='text-rose-600 hover:underline'
                  href='mailto:support@teacup.com'
                >
                  support@teacup.com
                </a>{' '}
                with your order details and reason for the request. We will
                review your case and respond promptly.
              </p>
            </section>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>5. Processing Time</h2>
              <p className='text-muted-foreground'>
                Approved refunds will be processed within 5-10 business days.
                The refund will be issued to the original payment method used at
                the time of purchase.
              </p>
            </section>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>6. Disputes</h2>
              <p className='text-muted-foreground'>
                If you have a dispute regarding a refund request, please contact
                us first. We are committed to resolving any issues fairly and in
                accordance with applicable laws.
              </p>
            </section>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>
                7. Changes to This Policy
              </h2>
              <p className='text-muted-foreground'>
                We may update this Refund Policy from time to time. Changes are
                effective when posted on this page. Your continued use of the
                Service after changes become effective constitutes acceptance.
              </p>
            </section>

            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold'>8. Contact</h2>
              <p className='text-muted-foreground'>
                Questions about this Refund Policy? Contact us at{' '}
                <a
                  className='text-rose-600 hover:underline'
                  href='mailto:support@teacup.com'
                >
                  support@teacup.com
                </a>{' '}
                .
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
