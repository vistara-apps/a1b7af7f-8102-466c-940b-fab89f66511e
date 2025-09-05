import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { STRIPE_PRODUCTS, STRIPE_CONFIG } from '@/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, priceType = 'PREMIUM_MONTHLY', walletAddress } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const product = STRIPE_PRODUCTS[priceType as keyof typeof STRIPE_PRODUCTS];
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid price type' },
        { status: 400 }
      );
    }

    // Create or retrieve customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: `${userId}@knowyourrightscard.app`,
        limit: 1
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: `${userId}@knowyourrightscard.app`,
          metadata: {
            userId,
            walletAddress: walletAddress || ''
          }
        });
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error);
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.amount,
            recurring: {
              interval: product.interval as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        userId,
        walletAddress: walletAddress || ''
      },
      subscription_data: {
        metadata: {
          userId,
          walletAddress: walletAddress || ''
        }
      }
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
