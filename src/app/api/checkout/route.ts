import { NextRequest, NextResponse } from 'next/server';
import { stripe, getProductName, getProductDescription } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PackageType } from '@/types/database';

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for hike bookings
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { hikeId, packageType, userId } = body as {
      hikeId: string;
      packageType: PackageType;
      userId?: string;
    };

    // Validate required fields
    if (!hikeId) {
      return NextResponse.json(
        { error: 'Missing required field: hikeId' },
        { status: 400 }
      );
    }

    if (!packageType || !['hike', 'training', 'bundle'].includes(packageType)) {
      return NextResponse.json(
        { error: 'Invalid package type. Must be: hike, training, or bundle' },
        { status: 400 }
      );
    }

    // Fetch hike from database using admin client (bypasses RLS)
    const supabase = createAdminClient();
    
    const { data: hike, error: hikeError } = await supabase
      .from('hikes')
      .select('*')
      .eq('id', hikeId)
      .single();

    if (hikeError || !hike) {
      console.error('Error fetching hike:', hikeError);
      return NextResponse.json(
        { error: 'Hike not found' },
        { status: 404 }
      );
    }

    // Verify hike is published
    if (!hike.is_published) {
      return NextResponse.json(
        { error: 'This hike is not available for booking' },
        { status: 400 }
      );
    }

    // Check availability (only for hike and bundle packages)
    if (packageType !== 'training') {
      const spotsRemaining = hike.max_participants - hike.current_participants;
      if (spotsRemaining <= 0) {
        return NextResponse.json(
          { error: 'This hike is sold out' },
          { status: 400 }
        );
      }
    }

    // Check if hike date hasn't passed
    if (new Date(hike.date) < new Date()) {
      return NextResponse.json(
        { error: 'This hike has already occurred' },
        { status: 400 }
      );
    }

    // Determine price based on package type (server-side price verification)
    let unitAmount: number;
    switch (packageType) {
      case 'hike':
        unitAmount = hike.price_hike_only;
        break;
      case 'training':
        unitAmount = hike.price_training_only;
        break;
      case 'bundle':
        unitAmount = hike.price_bundle;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid package type' },
          { status: 400 }
        );
    }

    // Build URLs
    const origin = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/hikes/${hike.slug || hikeId}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/hikes/${hike.slug || hikeId}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      
      // Customer info
      ...(userId && { client_reference_id: userId }),
      
      // Line items
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            unit_amount: unitAmount, // Already in centavos
            product_data: {
              name: getProductName(packageType, hike.title),
              description: getProductDescription(packageType),
              metadata: {
                hike_id: hikeId,
                package_type: packageType,
              },
            },
          },
          quantity: 1,
        },
      ],

      // Metadata for webhook processing
      metadata: {
        hikeId,
        userId: userId || '',
        packageType,
        hikeTitle: hike.title,
        unitPrice: unitAmount.toString(),
      },

      // Redirect URLs
      success_url: successUrl,
      cancel_url: cancelUrl,

      // Additional options
      locale: 'es',
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    // Return session details
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    
    // Handle Stripe-specific errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

