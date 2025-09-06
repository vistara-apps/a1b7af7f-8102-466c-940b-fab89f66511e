import { NextRequest, NextResponse } from 'next/server';
import { stripe, stripeHelpers, STRIPE_CONFIG } from '@/lib/stripe';
import { dbHelpers } from '@/lib/supabase';

interface SubscriptionRequest {
  userId: string;
  email: string;
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionRequest = await request.json();
    const { userId, email, priceId = STRIPE_CONFIG.prices.premium, successUrl, cancelUrl } = body;

    // Validate required fields
    if (!userId || !email || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email, successUrl, and cancelUrl' },
        { status: 400 }
      );
    }

    // Check if user already exists in our database
    let user = await dbHelpers.getUser(userId);
    
    // Create user if doesn't exist
    if (!user) {
      user = await dbHelpers.createUser({
        user_id: userId,
        subscription_status: 'free',
        preferred_language: 'en',
        saved_state_laws: []
      });
    }

    // Create or retrieve Stripe customer
    let customerId: string;
    
    try {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        // Create new customer
        const customer = await stripeHelpers.createCustomer(email, userId);
        customerId = customer.id;
      }
    } catch (error) {
      console.error('Error handling Stripe customer:', error);
      return NextResponse.json(
        { error: 'Failed to create customer account' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    try {
      const session = await stripeHelpers.createCheckoutSession(
        customerId,
        priceId,
        successUrl,
        cancelUrl
      );

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
        customerId,
        priceId,
        userId
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription request' },
      { status: 500 }
    );
  }
}

// Handle subscription management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const user = await dbHelpers.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'portal') {
      // Create customer portal session for subscription management
      const returnUrl = searchParams.get('returnUrl') || `${request.nextUrl.origin}`;
      
      // Find customer by user metadata
      const customers = await stripe.customers.list({
        limit: 100
      });
      
      const customer = customers.data.find(c => 
        c.metadata?.userId === userId
      );

      if (!customer) {
        return NextResponse.json(
          { error: 'No subscription found for this user' },
          { status: 404 }
        );
      }

      const portalSession = await stripeHelpers.createPortalSession(
        customer.id,
        returnUrl
      );

      return NextResponse.json({
        url: portalSession.url
      });
    }

    // Default: return subscription status
    return NextResponse.json({
      userId,
      subscriptionStatus: user.subscription_status,
      preferredLanguage: user.preferred_language,
      savedStateLaws: user.saved_state_laws
    });

  } catch (error) {
    console.error('Error handling subscription request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
