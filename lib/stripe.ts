import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Stripe product configuration
export const STRIPE_PRODUCTS = {
  PREMIUM_MONTHLY: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_premium_monthly',
    amount: 499, // $4.99 in cents
    interval: 'month',
    name: 'Premium Monthly',
    description: 'Access to all premium features including state-specific scripts, advanced recording, and alert system'
  },
  PREMIUM_YEARLY: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_premium_yearly',
    amount: 4999, // $49.99 in cents (2 months free)
    interval: 'year',
    name: 'Premium Yearly',
    description: 'Annual subscription with 2 months free'
  }
};

export const STRIPE_CONFIG = {
  successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/cancel`,
  customerPortalUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/manage`
};
