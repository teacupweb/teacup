'use client';

import React from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle } from 'lucide-react';
import type { PaymentPlan } from '@/types/payment';

interface PaymentSummaryProps {
  plan: PaymentPlan;
  className?: string;
}

export default function PaymentSummary({ plan, className = '' }: PaymentSummaryProps) {
  return (
    <div className={`bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm bg-opacity-95 sticky top-8 ${className}`}>
      <div className='bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white'>
        <h2 className='text-xl font-bold mb-2'>Order Summary</h2>
        <p className='text-rose-50/90 text-sm'>{plan.name}</p>
      </div>
      
      <div className='p-6'>
        <div className='space-y-3 mb-6'>
          {plan.features.map((feature, index) => (
            <div key={index} className='flex items-center gap-3'>
              <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0' />
              <span className='text-sm text-muted-foreground'>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className='border-t border-border pt-4 space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span>${plan.price}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Tax</span>
            <span>$0</span>
          </div>
          <div className='border-t border-border pt-3 flex justify-between items-center'>
            <span className='text-xl font-bold'>Total</span>
            <div className='text-right'>
              <span className='text-2xl font-bold text-rose-600'>${plan.price}</span>
              <span className='block text-xs text-muted-foreground'>{plan.period}</span>
            </div>
          </div>
        </div>
        
        <div className='mt-6 space-y-3'>
          <div className='flex gap-3 text-sm text-muted-foreground items-center'>
            <ShieldCheck className='w-5 h-5 text-green-500' />
            <span>256-bit SSL encryption</span>
          </div>
          <div className='flex gap-3 text-sm text-muted-foreground items-center'>
            <Lock className='w-5 h-5 text-rose-500' />
            <span>PCI DSS compliant</span>
          </div>
          <div className='flex gap-3 text-sm text-muted-foreground items-center'>
            <CreditCard className='w-5 h-5 text-blue-500' />
            <span>Credit/debit card payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
