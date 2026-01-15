import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PackageType, PaymentStatus } from '@/types/database';

/**
 * Stripe webhook secret for signature verification
 */
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session expired: ${session.id}`);
        // Optionally track expired sessions
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${paymentIntent.id}`);
        // Could update booking status to 'failed' if we have the reference
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  // Extract metadata
  const metadata = session.metadata;
  if (!metadata) {
    console.error('No metadata found in session');
    return;
  }

  const { hikeId, userId, packageType, unitPrice } = metadata;

  if (!hikeId || !packageType) {
    console.error('Missing required metadata:', { hikeId, packageType });
    return;
  }

  // Initialize Supabase admin client
  const supabase = createAdminClient();

  // Check if booking already exists (idempotency)
  const { data: existingBooking } = await supabase
    .from('bookings')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single();

  if (existingBooking) {
    console.log('Booking already exists for session:', session.id);
    return;
  }

  // Prepare booking data
  const bookingData = {
    user_id: userId || null,
    hike_id: hikeId,
    package_type: packageType as PackageType,
    quantity: 1,
    unit_price: parseInt(unitPrice || '0', 10),
    total_amount: session.amount_total || parseInt(unitPrice || '0', 10),
    currency: (session.currency || 'mxn').toUpperCase(),
    payment_status: 'completed' as PaymentStatus,
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent?.id || null,
    paid_at: new Date().toISOString(),
  };

  // Insert booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (bookingError) {
    console.error('Error creating booking:', bookingError);
    // In production, you might want to:
    // 1. Send an alert to your team
    // 2. Queue for retry
    // 3. Store in a dead letter queue
    throw new Error(`Failed to create booking: ${bookingError.message}`);
  }

  console.log('Booking created successfully:', booking.id);
  console.log('Confirmation code:', booking.confirmation_code);

  // Update hike participant count (for hike and bundle packages)
  if (packageType !== 'training') {
    const { error: updateError } = await supabase.rpc('increment_participants', {
      hike_id: hikeId,
      amount: 1,
    });

    // If RPC doesn't exist, fall back to direct update
    if (updateError) {
      console.log('RPC not available, using direct update');
      const { data: hike } = await supabase
        .from('hikes')
        .select('current_participants')
        .eq('id', hikeId)
        .single();

      if (hike) {
        await supabase
          .from('hikes')
          .update({ current_participants: hike.current_participants + 1 })
          .eq('id', hikeId);
      }
    }
  }

  // Optional: Send confirmation email
  // await sendConfirmationEmail(booking, session.customer_email);

  // Optional: Send notification to Slack/Discord
  // await sendBookingNotification(booking);
}

/**
 * Disable body parsing for webhook route (needed for raw body)
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

