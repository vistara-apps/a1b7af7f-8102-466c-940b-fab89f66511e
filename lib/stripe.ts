import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Client-side Stripe instance
let stripePromise: Promise<StripeJS | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Stripe configuration
export const STRIPE_CONFIG = {
  prices: {
    premium: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Helper functions for subscription management
export const stripeHelpers = {
  async createCustomer(email: string, userId: string) {
    return await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });
  },

  async createSubscription(customerId: string, priceId: string) {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  },

  async createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });
  },

  async cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.cancel(subscriptionId);
  },

  async updateSubscription(subscriptionId: string, priceId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });
  },

  async getSubscription(subscriptionId: string) {
    return await stripe.subscriptions.retrieve(subscriptionId);
  },

  async getCustomer(customerId: string) {
    return await stripe.customers.retrieve(customerId);
  },

  async createPortalSession(customerId: string, returnUrl: string) {
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  },

  // Webhook helpers
  constructEvent(payload: string | Buffer, signature: string) {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  },
};

// Subscription status helpers
export const subscriptionHelpers = {
  isActive(status: string): boolean {
    return ['active', 'trialing'].includes(status);
  },

  isPastDue(status: string): boolean {
    return status === 'past_due';
  },

  isCanceled(status: string): boolean {
    return ['canceled', 'incomplete_expired', 'unpaid'].includes(status);
  },

  needsPayment(status: string): boolean {
    return ['incomplete', 'past_due'].includes(status);
  },
};
