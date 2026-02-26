'use client';

import React from 'react';
import { 
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { PaymentFormData } from '@/types/payment';

interface PaymentFormProps {
  formData: PaymentFormData;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  amount: string;
  showCardNumber: boolean;
  showCVV: boolean;
  onToggleCardNumber: () => void;
  onToggleCVV: () => void;
}

export default function PaymentForm({
  formData,
  errors,
  onInputChange,
  onSubmit,
  isProcessing,
  amount,
  showCardNumber,
  showCVV,
  onToggleCardNumber,
  onToggleCVV
}: PaymentFormProps) {

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'cardNumber',
        value: formatted
      }
    };
    onInputChange(syntheticEvent);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'expiryDate',
        value: formatted
      }
    };
    onInputChange(syntheticEvent);
  };

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Card Details */}
      <div className='space-y-4'>
        <h3 className='font-medium text-foreground/80'>Card Information</h3>
        
        <div className='space-y-2'>
          <label className='text-sm font-medium text-foreground/80'>Card Number</label>
          <div className='relative'>
            <input
              type={showCardNumber ? 'text' : 'password'}
              name='cardNumber'
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cardNumber ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors pr-12`}
              placeholder='1234 5678 9012 3456'
              maxLength={19}
            />
            <button
              type='button'
              onClick={onToggleCardNumber}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-rose-500 transition-colors'
            >
              {showCardNumber ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.cardNumber && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <AlertCircle className='w-4 h-4' />
              {errors.cardNumber}
            </p>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-rose-500' />
              Expiry Date
            </label>
            <input
              type='text'
              name='expiryDate'
              value={formData.expiryDate}
              onChange={handleExpiryDateChange}
              className={`w-full px-4 py-3 rounded-xl border-2 ${errors.expiryDate ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors`}
              placeholder='MM/YY'
              maxLength={5}
            />
            {errors.expiryDate && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.expiryDate}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground/80'>CVV</label>
            <div className='relative'>
              <input
                type={showCVV ? 'text' : 'password'}
                name='cvv'
                value={formData.cvv}
                onChange={onInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cvv ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors pr-12`}
                placeholder='123'
                maxLength={4}
              />
              <button
                type='button'
                onClick={onToggleCVV}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-rose-500 transition-colors'
              >
                {showCVV ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {errors.cvv && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.cvv}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className='space-y-4'>
        <h3 className='font-medium text-foreground/80 flex items-center gap-2'>
          <MapPin className='w-4 h-4 text-rose-500' />
          Billing Address
        </h3>
        <div className='space-y-2'>
          <input
            type='text'
            name='billingAddress'
            value={formData.billingAddress}
            onChange={onInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.billingAddress ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors`}
            placeholder='123 Main Street'
          />
          {errors.billingAddress && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <AlertCircle className='w-4 h-4' />
              {errors.billingAddress}
            </p>
          )}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <input
              type='text'
              name='city'
              value={formData.city}
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 ${errors.city ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors`}
              placeholder='City'
            />
            {errors.city && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.city}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <input
              type='text'
              name='postalCode'
              value={formData.postalCode}
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 ${errors.postalCode ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors`}
              placeholder='Postal Code'
            />
            {errors.postalCode && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.postalCode}
              </p>
            )}
          </div>
        </div>
        <div className='space-y-2'>
          <input
            type='text'
            name='country'
            value={formData.country}
            onChange={onInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.country ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors`}
            placeholder='Country'
          />
          {errors.country && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <AlertCircle className='w-4 h-4' />
              {errors.country}
            </p>
          )}
        </div>
      </div>

      {/* Save Payment Info */}
      <div className='flex items-center gap-3'>
        <input
          type='checkbox'
          name='savePaymentInfo'
          checked={formData.savePaymentInfo}
          onChange={onInputChange}
          className='w-4 h-4 text-rose-500 rounded border-border bg-muted focus:ring-rose-500'
        />
        <label className='text-sm text-muted-foreground'>
          Save payment information for future purchases
        </label>
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        disabled={isProcessing}
        className='w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isProcessing ? (
          <>
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
            Processing...
          </>
        ) : (
          <>
            Pay ${amount}
            <CheckCircle className='w-5 h-5' />
          </>
        )}
      </button>
    </form>
  );
}
