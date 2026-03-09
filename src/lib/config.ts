/**
 * Centralized configuration for the application
 */

export const PRICING = {
  DEFAULT_PRICE: process.env.NEXT_PUBLIC_DEFAULT_PRICE || '50',
} as const;

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  href: string;
  highlight?: boolean;
};

export const DEFAULT_PLAN: PricingPlan = {
  name: 'Monthly Plan',
  price: PRICING.DEFAULT_PRICE,
  period: '/month',
  features: [
    'Full access to all features',
    'Monthly billing',
    'Cancel anytime',
    'Priority support',
  ],
  buttonText: 'Buy Monthly',
  href: '#',
  highlight: false,
};
