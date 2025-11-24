import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    // Validate Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ CRITICAL: STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Payment system configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Validate NEXT_PUBLIC_APP_URL is configured
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('❌ CRITICAL: NEXT_PUBLIC_APP_URL is not set');
      return NextResponse.json(
        { error: 'Application URL is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Initialize Stripe client with validated key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { bookingData, totalAmount } = await request.json();

    // Validate required fields
    if (!bookingData) {
      return NextResponse.json(
        { error: 'Booking data is required' },
        { status: 400 }
      );
    }

    if (!bookingData.service) {
      return NextResponse.json(
        { error: 'Service selection is required' },
        { status: 400 }
      );
    }

    if (!bookingData.contact?.email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.contact.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Service names and prices mapping - TEMPORARY TEST PRICING (₹50 INR - meets Stripe minimum)
    // ⚠️ TODO: RESTORE ORIGINAL CAD PRICES FROM ORIGINAL_PRICES_BACKUP.md AFTER TESTING
    // Note: ₹50 INR meets Stripe's $0.50 USD requirement (converts to ~$0.60 USD)
    const services: Record<string, { name: string; price: number }> = {
      "mls-package": { name: "MLS Package", price: 50 },
      "mls-social-package": { name: "MLS + Social Package", price: 50 },
      "mls-sc-prime-package": { name: "MLS + SC Prime Package", price: 50 },
      hdr: { name: "HDR Photos", price: 50 },
      "3d-tour-rms": { name: "3D Tour & RMS", price: 50 },
      "essential-video": { name: "Essential Video", price: 50 },
      "sc-prime-reel": { name: "SC Prime Reel", price: 50 },
      "possession-video": { name: "Possession Video", price: 50 },
      drone: { name: "Drone Photos", price: 50 },
    };

    const serviceInfo = services[bookingData.service];
    if (!serviceInfo) {
      return NextResponse.json(
        { error: 'Invalid service selected' },
        { status: 400 }
      );
    }

    // Generate unique booking reference
    const bookingRef = "BK" + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Validate and calculate final amount
    const finalAmount = totalAmount || serviceInfo.price;

    // Stripe minimum requirements:
    // - For INR: Minimum ₹50 (converts to ~$0.60 USD, meets Stripe's $0.50 USD global minimum)
    // - For CAD: Minimum $0.50 CAD
    const currency = 'inr'; // Current currency (TEMPORARY: for testing)
    const minAmount = currency === 'inr' ? 50 : 0.50; // ₹50 INR or $0.50 CAD
    
    // Validate amount range
    if (finalAmount < minAmount || finalAmount > 100000) {
      const currencySymbol = currency === 'inr' ? '₹' : '$';
      return NextResponse.json(
        { error: `Invalid amount. Minimum charge is ${currencySymbol}${minAmount} ${currency.toUpperCase()}` },
        { status: 400 }
      );
    }

    // Ensure amount meets minimum requirement
    const stripeAmount = Math.max(finalAmount, minAmount);

    // Validate date if provided
    if (bookingData.date) {
      const bookingDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        return NextResponse.json(
          { error: 'Booking date cannot be in the past' },
          { status: 400 }
        );
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency, // Use currency variable (currently 'inr' for testing)
            product_data: {
              name: serviceInfo.name,
              description: `Professional ${serviceInfo.name} service for ${bookingData.address || 'your property'}`,
              // TODO: Add actual service images or remove images array
              // images: ['https://yourdomain.com/images/services/service-name.jpg'],
            },
            unit_amount: Math.round(stripeAmount * 100), // Convert to paise (minimum 1 paise for Stripe)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking?step=5&cancelled=true`,
      customer_email: bookingData.contact.email,
      metadata: {
        booking_ref: bookingRef,
        service: bookingData.service,
        service_name: serviceInfo.name,
        date: bookingData.date || '',
        time: bookingData.time || '',
        address: bookingData.address || '',
        customer_name: bookingData.contact?.name || '',
        customer_email: bookingData.contact.email,
        customer_phone: bookingData.contact?.phone || '',
        notes: bookingData.contact?.notes || '',
        total_amount: finalAmount.toString(), // Store original amount in metadata
        stripe_amount: stripeAmount.toString(), // Store Stripe amount (may be different if rounded up)
      },
      // Add invoice creation for record keeping
      invoice_creation: {
        enabled: true,
      },
      // Payment intent data for better tracking
      payment_intent_data: {
        metadata: {
          booking_ref: bookingRef,
          service: bookingData.service,
        },
      },
    });

    // Validate checkout URL was generated
    if (!session.url) {
      console.error('❌ Stripe checkout session created but URL is missing:', session.id);
      return NextResponse.json(
        { error: 'Failed to generate checkout URL. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      bookingRef,
      serviceInfo,
    });

  } catch (error) {
    console.error('Stripe checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}