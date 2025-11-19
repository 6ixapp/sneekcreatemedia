import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { hasSessionBeenProcessed, markSessionAsProcessed } from '@/lib/idempotency';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature for security
      // CRITICAL: Webhook secret is REQUIRED in production
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (!webhookSecret) {
        if (isProduction) {
          // Production: Fail if webhook secret is missing
          console.error('❌ CRITICAL: STRIPE_WEBHOOK_SECRET is required in production');
          return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
          );
        } else {
          // Development: Log warning and parse body (NOT SECURE - only for testing)
          console.warn('⚠️ WARNING: STRIPE_WEBHOOK_SECRET not set. Webhook signature verification is disabled.');
          console.warn('⚠️ This should NEVER be used in production!');
          event = JSON.parse(body) as Stripe.Event;
        }
      } else {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    console.log(`📥 Received webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        
        console.log(`🔍 Processing checkout.session.completed for session: ${sessionId}`);
        console.log(`   Payment Status: ${session.payment_status}`);
        console.log(`   Metadata:`, JSON.stringify(session.metadata, null, 2));
        console.log(`   Customer Email: ${session.customer_email || 'Not set'}`);
        console.log(`   Amount Total: ${session.amount_total || 'Not set'}`);
        
        // Idempotency check: Skip if already processed
        if (hasSessionBeenProcessed(sessionId)) {
          console.log(`⏭️  Session ${sessionId} already processed. Skipping email send.`);
          return NextResponse.json({ 
            received: true, 
            message: 'Session already processed',
            sessionId 
          });
        }

        // CRITICAL: Only process if payment is actually paid
        if (session.payment_status !== 'paid') {
          console.log(`⏸️  Session ${sessionId} payment status: ${session.payment_status}. Emails will NOT be sent.`);
          return NextResponse.json({ 
            received: true, 
            message: `Payment not completed. Status: ${session.payment_status}`,
            sessionId,
            payment_status: session.payment_status
          });
        }

        // Validate required metadata
        const customerEmail = session.metadata?.customer_email || session.customer_email || '';
        const bookingRef = session.metadata?.booking_ref || `BK${Date.now().toString(36).toUpperCase()}`;
        
        // Log metadata status
        if (!session.metadata?.booking_ref || !customerEmail) {
          console.warn(`⚠️  Session ${sessionId} has incomplete metadata:`, {
            has_booking_ref: !!session.metadata?.booking_ref,
            has_customer_email_in_metadata: !!session.metadata?.customer_email,
            has_customer_email_in_session: !!session.customer_email,
            metadata: session.metadata,
            using_fallback_booking_ref: !session.metadata?.booking_ref,
            using_fallback_email: !session.metadata?.customer_email && !!session.customer_email
          });
        }
        
        // Require at least customer email (from metadata or session)
        if (!customerEmail) {
          console.error(`❌ Session ${sessionId} missing customer email in both metadata and session`);
          return NextResponse.json(
            { 
              error: 'Missing required customer email',
              details: {
                metadata_customer_email: session.metadata?.customer_email || 'Not set',
                session_customer_email: session.customer_email || 'Not set',
                metadata: session.metadata
              }
            },
            { status: 400 }
          );
        }

        try {
          // Get payment intent details for transaction ID
          let paymentIntent = null;
          if (session.payment_intent) {
            try {
              paymentIntent = await stripe.paymentIntents.retrieve(
                typeof session.payment_intent === 'string' 
                  ? session.payment_intent 
                  : session.payment_intent.id
              );
            } catch (error) {
              console.error('Failed to retrieve payment intent:', error);
              // Continue without payment intent details
            }
          }

          // Extract booking data from session metadata
          const bookingData = {
            service: session.metadata?.service || 'mls-package',
            date: session.metadata?.date || new Date().toISOString().split('T')[0],
            time: session.metadata?.time || '10:00 AM',
            address: session.metadata?.address || 'Address to be confirmed',
            contact: {
              name: session.metadata?.customer_name || 'Customer',
              email: customerEmail,
              phone: session.metadata?.customer_phone || '',
              notes: session.metadata?.notes || '',
            },
            bookingRef: bookingRef,
            totalAmount: session.amount_total ? (session.amount_total / 100) : 0,
            transactionId: paymentIntent?.id || (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id) || '',
            paymentIntent: paymentIntent?.id || (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id) || '',
            paymentMethod: paymentIntent?.payment_method_types?.[0] || 'card',
            paymentStatus: 'paid',
            currency: session.currency?.toUpperCase() || 'USD',
          };
          
          console.log(`📧 Preparing to send emails with booking data:`, {
            bookingRef: bookingData.bookingRef,
            customerEmail: bookingData.contact.email,
            service: bookingData.service,
            totalAmount: bookingData.totalAmount
          });

          // Send confirmation emails ONLY if payment is paid
          console.log(`Processing payment success for session ${sessionId}. Sending confirmation emails...`);
          const emailResult = await sendBookingConfirmationEmail(bookingData);
          
          if (emailResult.success) {
            // Mark session as processed AFTER successful email send
            markSessionAsProcessed(sessionId, true);
            console.log(`✅ Booking confirmation emails sent successfully for session ${sessionId}:`, {
              customerEmailId: emailResult.customerEmailId,
              businessEmailId: emailResult.businessEmailId,
              bookingRef: bookingData.bookingRef,
            });
          } else {
            // Don't mark as processed if email failed - allows retry
            console.error(`❌ Failed to send confirmation emails for session ${sessionId}:`, emailResult.error);
            return NextResponse.json(
              { 
                error: 'Failed to send confirmation emails', 
                details: emailResult.error,
                sessionId 
              },
              { status: 500 }
            );
          }
        } catch (error) {
          console.error(`Error processing session ${sessionId}:`, error);
          // Don't mark as processed on error - allows retry
          throw error;
        }
        break;

      case 'checkout.session.async_payment_succeeded':
        // Handle async payments (e.g., bank transfers)
        const asyncSession = event.data.object as Stripe.Checkout.Session;
        console.log('Async payment succeeded for session:', asyncSession.id);
        // You can add similar processing here if needed
        break;

      case 'checkout.session.async_payment_failed':
        // Handle failed async payments
        const failedSession = event.data.object as Stripe.Checkout.Session;
        console.error('Async payment failed for session:', failedSession.id);
        // Log failure but don't send emails
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payments
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', failedPayment.id);
        // Log failure but don't send emails
        break;

      case 'payment_intent.succeeded':
        // This event is redundant with checkout.session.completed for checkout sessions
        // but we log it for tracking
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntentSucceeded.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook handler failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}