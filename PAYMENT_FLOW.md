# Payment Flow Documentation

## Overview

This document explains the secure payment flow for the booking system using Stripe. The implementation follows best practices for security, idempotency, and reliable email delivery.

## Flow Diagram

```
1. User fills booking form
   ↓
2. User submits payment → POST /api/stripe/checkout
   ↓
3. Stripe Checkout Session created
   ↓
4. User redirected to Stripe payment page
   ↓
5. User completes payment
   ↓
6. Stripe sends webhook → POST /api/webhooks/stripe
   ↓
7. Webhook verifies payment status
   ↓
8. If payment = 'paid' → Send confirmation emails
   ↓
9. User redirected to success page → /booking/success
   ↓
10. Success page displays payment confirmation
```

## Key Components

### 1. Checkout Creation (`/api/stripe/checkout`)
- **Purpose**: Creates a Stripe Checkout Session
- **Security**: Validates all input data, email format, service selection, and amount
- **Features**:
  - Validates booking data
  - Generates unique booking reference
  - Creates Stripe session with metadata
  - Returns checkout URL

### 2. Webhook Handler (`/api/webhooks/stripe`)
- **Purpose**: Processes Stripe webhook events (PRIMARY SOURCE OF TRUTH)
- **Security**: 
  - Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
  - Only processes events from Stripe
- **Features**:
  - Idempotency check (prevents duplicate emails)
  - Only sends emails when `payment_status === 'paid'`
  - Handles payment failures gracefully
  - Logs all events for debugging

### 3. Payment Success Endpoint (`/api/stripe/payment-success`)
- **Purpose**: Retrieves payment session details for display
- **Security**: Validates session ID format, retrieves from Stripe
- **Features**:
  - Does NOT send emails (webhook handles this)
  - Checks email status from idempotency store
  - Returns payment details for success page

### 4. Success Page (`/booking/success`)
- **Purpose**: Displays payment confirmation to user
- **Features**:
  - Shows payment details
  - Displays email status
  - Provides booking reference
  - Shows next steps

## Security Features

### 1. Webhook Signature Verification
- All webhook requests are verified using Stripe's signature
- Prevents unauthorized requests
- Required environment variable: `STRIPE_WEBHOOK_SECRET`

### 2. Idempotency
- Prevents duplicate email sends
- Uses in-memory store (can be replaced with database in production)
- Tracks processed sessions by session ID

### 3. Payment Status Verification
- Only processes payments with `payment_status === 'paid'`
- Validates payment before sending emails
- Handles failed payments gracefully

### 4. Input Validation
- Validates email format
- Validates service selection
- Validates amount (prevents invalid amounts)
- Validates booking date (cannot be in past)

## Environment Variables

### Required Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret (from Stripe Dashboard)

# Application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com # Your application URL

# Email Configuration (Resend)
RESEND_API_KEY=re_... # Your Resend API key
RESEND_FROM_EMAIL=noreply@yourdomain.com # Email address to send from
RESEND_TO_EMAIL=your@email.com # Your business email for notifications
```

### Getting Stripe Webhook Secret

1. Go to Stripe Dashboard → Developers → Webhooks
2. Create a new webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the "Signing secret" (starts with `whsec_`)
5. Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

## Email Flow

### When Emails Are Sent

1. **Customer Confirmation Email**: Sent to customer when payment is confirmed
2. **Business Notification Email**: Sent to business owner when payment is confirmed

### Email Sending Logic

- Emails are sent **ONLY** from the webhook handler
- Emails are sent **ONLY** when `payment_status === 'paid'`
- Idempotency prevents duplicate emails
- If email sending fails, webhook can retry (not marked as processed)

### Email Content

Both emails include:
- Booking reference
- Service details
- Date and time
- Property address
- Customer contact information
- Payment details (transaction ID, amount)
- Next steps

## Error Handling

### Payment Failures

- Failed payments are logged but do not trigger emails
- Users are redirected to cancel URL
- No confirmation emails are sent

### Webhook Failures

- If webhook fails to send emails, Stripe will retry
- Session is not marked as processed on failure
- Allows retry on next webhook delivery

### Success Page Errors

- If session ID is invalid, shows error message
- If payment not completed, shows error message
- Provides contact information for support

## Testing

### Test Mode

1. Use Stripe test mode keys
2. Use test cards from Stripe documentation
3. Test webhook locally using Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## Production Checklist

- [ ] Set `STRIPE_WEBHOOK_SECRET` in production environment
- [ ] Use production Stripe keys
- [ ] Configure webhook endpoint in Stripe Dashboard
- [ ] Test webhook signature verification
- [ ] Replace in-memory idempotency store with database
- [ ] Set up monitoring for webhook failures
- [ ] Configure email service (Resend) with production domain
- [ ] Test email delivery
- [ ] Set up error logging and alerting

## Idempotency Store

Currently uses in-memory store. For production, replace with:
- Redis (recommended for high performance)
- PostgreSQL (for persistence)
- MongoDB (for flexible schema)

The idempotency store tracks:
- Session ID
- Processed timestamp
- Email sent status

## Monitoring

### Key Metrics to Monitor

1. Webhook delivery success rate
2. Email sending success rate
3. Payment success rate
4. Failed payment rate
5. Duplicate email prevention rate

### Logging

All important events are logged:
- Webhook received
- Payment status
- Email sending success/failure
- Idempotency checks
- Error conditions

## Troubleshooting

### Emails Not Sending

1. Check webhook is configured correctly
2. Verify `STRIPE_WEBHOOK_SECRET` is set
3. Check webhook logs in Stripe Dashboard
4. Verify email service (Resend) is configured
5. Check email service logs

### Duplicate Emails

1. Check idempotency store is working
2. Verify webhook is not being called multiple times
3. Check for multiple webhook endpoints

### Payment Not Showing as Paid

1. Check Stripe Dashboard for payment status
2. Verify webhook is receiving events
3. Check webhook logs
4. Verify payment was actually completed

## Support

For issues or questions:
- Check Stripe Dashboard for payment details
- Review webhook logs
- Check application logs
- Contact support with booking reference

