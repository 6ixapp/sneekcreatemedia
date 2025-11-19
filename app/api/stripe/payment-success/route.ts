import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionStatus, markSessionAsProcessed } from '@/lib/idempotency';
import { sendBookingConfirmationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * This endpoint retrieves payment session details for display on the success page.
 * 
 * EMAIL SENDING:
 * - Primary: Emails are sent from the webhook handler when payment is confirmed by Stripe.
 * - Fallback: If webhook hasn't processed the session yet, emails are sent here as backup.
 * - Idempotency: Prevents duplicate emails using session ID tracking.
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Validate sessionId format (basic security check)
    if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Invalid session ID format' },
        { status: 400 }
      );
    }

    // Retrieve the Stripe session with all details
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent', 'customer']
      });
    } catch (error) {
      console.error('Failed to retrieve Stripe session:', error);
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 404 }
      );
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { 
          error: 'Payment not completed', 
          payment_status: session.payment_status,
          message: 'Your payment has not been completed. Please contact support if you believe this is an error.'
        },
        { status: 400 }
      );
    }

    // Check if emails have been sent (from webhook processing)
    const sessionStatus = getSessionStatus(sessionId);
    let emailSent = sessionStatus?.emailSent ?? false;

    // Extract booking data from session metadata
    const customerEmail = session.metadata?.customer_email || session.customer_email || '';
    const bookingRef = session.metadata?.booking_ref || `BK${Date.now()}`;
    
    const bookingData = {
      service: session.metadata?.service || 'mls-package',
      service_name: session.metadata?.service_name || 'MLS Package',
      date: session.metadata?.date || new Date().toISOString().split('T')[0],
      time: session.metadata?.time || '10:00 AM',
      address: session.metadata?.address || '',
      contact: {
        name: session.metadata?.customer_name || 'Customer',
        email: customerEmail,
        phone: session.metadata?.customer_phone || '',
        notes: session.metadata?.notes || '',
      },
      bookingRef: bookingRef,
      totalAmount: session.amount_total ? (session.amount_total / 100) : 0,
      paymentIntent: typeof session.payment_intent === 'object' 
        ? session.payment_intent?.id 
        : session.payment_intent || '',
      transactionId: typeof session.payment_intent === 'object' 
        ? session.payment_intent?.id 
        : session.payment_intent || '',
      paymentMethod: 'Credit Card',
      paymentStatus: session.payment_status,
      currency: session.currency?.toUpperCase() || 'USD',
    };

    // FALLBACK: If webhook hasn't sent emails yet, send them here as backup
    // This ensures emails are sent even if webhook doesn't fire
    if (!emailSent && customerEmail) {
      console.log(`📧 Webhook hasn't processed session ${sessionId} yet. Sending emails as fallback...`);
      
      try {
        const emailResult = await sendBookingConfirmationEmail(bookingData);
        
        if (emailResult.success) {
          // Mark as processed to prevent duplicates
          markSessionAsProcessed(sessionId, true);
          emailSent = true;
          console.log(`✅ Emails sent successfully via fallback for session ${sessionId}`);
        } else {
          console.error(`❌ Failed to send emails via fallback:`, emailResult.error);
        }
      } catch (error) {
        console.error(`❌ Error sending emails via fallback:`, error);
        // Don't fail the request if email fails
      }
    }

    // Return payment details for the success page
    return NextResponse.json({
      success: true,
      emailSent, // True if emails were sent (from webhook or fallback)
      paymentDetails: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: customerEmail,
        payment_status: session.payment_status,
        payment_intent: typeof session.payment_intent === 'object' 
          ? session.payment_intent?.id 
          : session.payment_intent,
        metadata: session.metadata,
        created: session.created,
      },
      bookingData,
      message: emailSent 
        ? 'Payment confirmed and confirmation emails have been sent.'
        : 'Payment confirmed. Confirmation emails are being processed and will be sent shortly.',
    });

  } catch (error) {
    console.error('Payment success processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process payment success', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}