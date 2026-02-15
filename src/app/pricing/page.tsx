'use client';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Monthly',
      price: '40',
      period: '/month',
      description: 'Perfect for small businesses looking to get started.',
      features: [
        'Unlimited products',
        'Custom domain support',
        '24/7 Priority support',
        'Advanced analytics',
        'No-code website builder',
      ],
      buttonText: 'Buy Monthly',
      href: '/checkout?plan=monthly',
      highlight: false,
    },
    {
      name: 'Lifetime',
      price: '500',
      period: ' one-time',
      description: 'The ultimate choice for long-term growth and savings.',
      features: [
        'Everything in Monthly',
        'Lifetime access',
        'No monthly fees ever',
        'Early access to new features',
        'Dedicated account manager',
      ],
      buttonText: 'Buy Lifetime',
      href: '/checkout?plan=lifetime',
      highlight: true,
    },
  ];

  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        
        <div className='py-20 px-4'>
          <div className='max-w-4xl mx-auto text-center mb-10'>
            <h1 className='text-5xl ubuntu-font mb-6'>Simple, Transparent Pricing</h1>
            <p className='text-xl text-muted-foreground mb-16'>
              Choose the plan that fits your business needs. No hidden fees, just pure value.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20'>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-3xl border ${
                  plan.highlight
                    ? 'border-rose-500 shadow-2xl shadow-rose-500/10'
                    : 'border-border bg-card'
                } flex flex-col`}
              >
                {plan.highlight && (
                  <span className='absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-4 py-1 rounded-full text-sm font-bold'>
                    Most Popular
                  </span>
                )}
                
                <div className='mb-8'>
                  <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
                  <div className='flex items-baseline gap-1'>
                    <span className='text-4xl font-bold'>${plan.price}</span>
                    <span className='text-muted-foreground'>{plan.period}</span>
                  </div>
                  <p className='mt-4 text-muted-foreground'>{plan.description}</p>
                </div>

                <ul className='space-y-4 mb-8 flex-grow'>
                  {plan.features.map((feature) => (
                    <li key={feature} className='flex gap-3 items-start'>
                      <div className='mt-1 bg-rose-100 dark:bg-rose-900/30 p-1 rounded-full'>
                        <Check className='w-4 h-4 text-rose-600' />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className='block w-full'>
                  <button
                    className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
                      plan.highlight
                        ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30'
                        : 'bg-secondary text-secondary-foreground hover:bg-rose-600 hover:text-white border border-border'
                    } cursor-pointer`}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Banner for new users at bottom */}
          <div className='bg-linear-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white text-left md:flex items-center justify-between gap-6 shadow-xl shadow-rose-500/20 max-w-3xl mx-auto'>
            <div className='flex items-center gap-4 mb-4 md:mb-0'>
              <div className='bg-white/20 p-3 rounded-xl'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h2 className='text-2xl font-bold'>Don't have a website yet?</h2>
                <p className='text-rose-50 font-medium'>Order one—don't worry, it's free!</p>
              </div>
            </div>
            <Link href='/order-site'>
              <button className='bg-white text-rose-600 px-6 py-3 rounded-xl font-bold hover:bg-rose-50 transition-colors whitespace-nowrap'>
                Order Free Site
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
