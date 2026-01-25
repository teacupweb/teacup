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
          <div className='max-w-4xl mx-auto text-center mb-16'>
            <h1 className='text-5xl ubuntu-font mb-6'>Simple, Transparent Pricing</h1>
            <p className='text-xl text-muted-foreground'>
              Choose the plan that fits your business needs. No hidden fees, just pure value.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
