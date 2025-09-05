import { NextRequest, NextResponse } from 'next/server';
import { stripeHelpers } from '@/lib/stripe';
import { dbHelpers } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripeHelpers.constructEvent(body, signature);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        // Get customer to find userId
        const customer = await stripeHelpers.getCustomer(customerId);
        const userId = (customer as any).metadata?.userId;

        if (!userId) {
          console.error('No userId found in customer metadata');
          break;
        }

        // Update user subscription status
        const subscriptionStatus = subscription.status === 'active' || subscription.status === 'trialing' 
          ? 'premium' 
          : 'free';

        await dbHelpers.updateUser(userId, {
          subscription_status: subscriptionStatus
        });

        // Create or update subscription record
        try {
          await dbHelpers.supabase
            .from('subscriptions')
            .upsert({
              id: subscription.id,
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              price_id: subscription.items.data[0]?.price.id || '',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            });
        } catch (dbError) {
          console.error('Error upserting subscription:', dbError);
        }

        console.log(`Subscription ${event.type} for user ${userId}: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        // Get customer to find userId
        const customer = await stripeHelpers.getCustomer(customerId);
        const userId = (customer as any).metadata?.userId;

        if (!userId) {
          console.error('No userId found in customer metadata');
          break;
        }

        // Update user to free tier
        await dbHelpers.updateUser(userId, {
          subscription_status: 'free'
        });

        // Update subscription record
        try {
          await dbHelpers.supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);
        } catch (dbError) {
          console.error('Error updating canceled subscription:', dbError);
        }

        console.log(`Subscription canceled for user ${userId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        
        // Get customer to find userId
        const customer = await stripeHelpers.getCustomer(customerId);
        const userId = (customer as any).metadata?.userId;

        if (!userId) {
          console.error('No userId found in customer metadata');
          break;
        }

        console.log(`Payment succeeded for user ${userId}: $${invoice.amount_paid / 100}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        
        // Get customer to find userId
        const customer = await stripeHelpers.getCustomer(customerId);
        const userId = (customer as any).metadata?.userId;

        if (!userId) {
          console.error('No userId found in customer metadata');
          break;
        }

        // Optionally downgrade user or send notification
        console.log(`Payment failed for user ${userId}: $${invoice.amount_due / 100}`);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer as string;
        
        // Get customer to find userId
        const customer = await stripeHelpers.getCustomer(customerId);
        const userId = (customer as any).metadata?.userId;

        if (!userId) {
          console.error('No userId found in customer metadata');
          break;
        }

        console.log(`Checkout completed for user ${userId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
