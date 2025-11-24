# 🚀 Complete Stripe Payment Setup Guide
## From Zero to Production-Ready

**Your Site:** https://www.sneekcreatemedia.com  
**Deployed:** ✅ Live  
**Status:** Ready to configure Stripe payments

---

## 📋 Table of Contents

1. [Code Review Summary](#code-review-summary)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Test Mode Setup (Do This First)](#test-mode-setup)
4. [Testing Your Integration](#testing-your-integration)
5. [Live Mode Setup (Production)](#live-mode-setup)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Code Review Summary

I've reviewed your payment implementation. **Great news - your code is well-implemented!**

### **What's Working:**
- ✅ Stripe checkout session creation (`/api/stripe/checkout`)
- ✅ Webhook handler with signature verification (`/api/webhooks/stripe`)
- ✅ Payment success handler (`/api/stripe/payment-success`)
- ✅ Email confirmation system
- ✅ Proper error handling
- ✅ Input validation
- ✅ Metadata tracking
- ✅ Idempotency pattern (prevents duplicate emails)

### **Currency Note:**
- Your payments are in **CAD (Canadian Dollars)** (line 115 in checkout route)
- Prices: MLS Package = $250 CAD, MLS + Social = $475 CAD, etc.

### **One Consideration:**
- Currently using in-memory session storage (will work fine for 60 bookings/month)
- For 100% reliability, consider Redis later (optional, not critical)

---

## 🔐 Environment Variables Setup

Your application needs these environment variables to work:

### **Required Variables:**

```env
# Application URL
NEXT_PUBLIC_APP_URL=https://www.sneekcreatemedia.com

# Stripe API Keys (Test mode first, then live)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUSINESS_EMAIL=your-business@example.com
```

---

## 🧪 Test Mode Setup (Do This First)

**Always test in test mode before going live!**

### **Step 1: Get Stripe Test API Keys**

1. **Go to Stripe Dashboard:**
   ```
   https://dashboard.stripe.com/test/apikeys
   ```

2. **Make sure you're in TEST MODE:**
   - Look for toggle in top-right corner
   - Should say "Test mode" (not "Live mode")

3. **Copy your keys:**
   - **Publishable key:** Starts with `pk_test_`
   - **Secret key:** Click "Reveal" - starts with `sk_test_`

**Example:**
```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### **Step 2: Create Test Webhook Endpoint**

1. **Go to Stripe Webhooks:**
   ```
   https://dashboard.stripe.com/test/webhooks
   ```

2. **Verify you're in TEST MODE** (toggle top-right)

3. **Click "Add endpoint"**

4. **Enter endpoint URL:**
   ```
   https://www.sneekcreatemedia.com/api/webhooks/stripe
   ```

5. **Add description (optional):**
   ```
   Test webhook for booking confirmations
   ```

6. **Select events - Click "Select events" and add these 5:**
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_succeeded`
   - ✅ `checkout.session.async_payment_failed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

7. **Click "Add endpoint"**

8. **Copy webhook secret:**
   - Click on your new webhook endpoint
   - Find "Signing secret" section
   - Click "Reveal"
   - Copy the secret (starts with `whsec_`)

**Example:**
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### **Step 3: Add Environment Variables to Production**

**If using Vercel:**

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:

```
Name: NEXT_PUBLIC_APP_URL
Value: https://www.sneekcreatemedia.com
Environment: Production, Preview, Development

Name: STRIPE_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (your actual test secret key)
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (your actual test publishable key)
Environment: Production, Preview, Development

Name: STRIPE_WEBHOOK_SECRET
Value: whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (your actual webhook secret)
Environment: Production, Preview, Development

Name: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environment: Production, Preview, Development

Name: BUSINESS_EMAIL
Value: your-business@example.com
Environment: Production, Preview, Development
```

4. **Click "Save"** for each variable

5. **Redeploy your application:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - OR: Push a new commit to trigger deployment

---

## 🧪 Testing Your Integration

### **Test 1: Send Test Webhook from Stripe**

1. **Go to your webhook in Stripe:**
   ```
   https://dashboard.stripe.com/test/webhooks
   ```

2. **Click on your webhook endpoint**

3. **Click "Send test webhook"**

4. **Select event:** `checkout.session.completed`

5. **Click "Send test webhook"**

6. **Check result:**
   - ✅ Should see **"200 OK"** with green checkmark
   - ❌ If you see error, see [Troubleshooting](#troubleshooting)

---

### **Test 2: Make a Real Test Payment**

This tests the complete end-to-end flow.

**Step 1: Go to your booking page**
```
https://www.sneekcreatemedia.com/booking
```

**Step 2: Fill out the form**
- Select any service (e.g., "MLS Package")
- Choose a future date
- Enter your real email (you'll receive confirmation)
- Fill in other details

**Step 3: Use Stripe test card**
```
Card Number: 4242 4242 4242 4242
Expiry Date: 12/25 (any future date)
CVC: 123 (any 3 digits)
ZIP Code: 12345 (any 5 digits)
Name: Test User
```

**Step 4: Complete payment**

**Step 5: Verify success**
- ✅ Redirected to success page
- ✅ See booking details and confirmation
- ✅ Receive confirmation email (check inbox/spam)
- ✅ Business receives notification email

---

### **Test 3: Verify in Stripe Dashboard**

**Check Payment:**
1. Go to: https://dashboard.stripe.com/test/payments
2. You should see your test payment
3. Status should be "Succeeded"
4. Amount should match (e.g., $250.00 CAD)

**Check Webhook Delivery:**
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Click "Recent deliveries" tab
4. You should see webhook events with **200 OK** status

---

### **Test 4: Test Different Scenarios**

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expected: Payment succeeds, emails sent
```

**Declined Card:**
```
Card: 4000 0000 0000 0002
Expected: Payment fails, no emails
```

**Requires Authentication (3D Secure):**
```
Card: 4000 0025 0000 3155
Expected: Shows authentication prompt, then succeeds
```

**Insufficient Funds:**
```
Card: 4000 0000 0000 9995
Expected: Payment fails with "insufficient funds"
```

---

## ✅ Success Criteria for Test Mode

You're ready for live mode when:

- ✅ Test webhook returns 200 OK
- ✅ Test payment completes successfully
- ✅ Confirmation emails received (customer + business)
- ✅ Payment appears in Stripe Dashboard
- ✅ Webhook deliveries show 200 OK
- ✅ No errors in application logs
- ✅ Success page displays correctly

---

## 🚀 Live Mode Setup (Production)

**⚠️ Only do this after test mode works perfectly!**

### **Step 1: Get Live API Keys**

1. **Go to Stripe Dashboard:**
   ```
   https://dashboard.stripe.com/apikeys
   ```

2. **Toggle to LIVE MODE** (top-right corner)

3. **Copy your LIVE keys:**
   - **Publishable key:** Starts with `pk_live_`
   - **Secret key:** Click "Reveal" - starts with `sk_live_`

**⚠️ IMPORTANT:** Live keys are different from test keys!

---

### **Step 2: Create Live Webhook Endpoint**

1. **Go to Stripe Webhooks:**
   ```
   https://dashboard.stripe.com/webhooks
   ```

2. **Make sure you're in LIVE MODE** (toggle top-right)

3. **Click "Add endpoint"**

4. **Enter endpoint URL:**
   ```
   https://www.sneekcreatemedia.com/api/webhooks/stripe
   ```
   (Same URL as test mode)

5. **Add description:**
   ```
   Production webhook for booking confirmations
   ```

6. **Select the same 5 events:**
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_succeeded`
   - ✅ `checkout.session.async_payment_failed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

7. **Click "Add endpoint"**

8. **Copy LIVE webhook secret:**
   - Click on your new webhook
   - Find "Signing secret"
   - Click "Reveal"
   - Copy the secret (starts with `whsec_`)

**⚠️ IMPORTANT:** Live webhook secret is different from test!

---

### **Step 3: Update Production Environment Variables**

**In Vercel (or your hosting platform):**

Update these 3 variables to use LIVE values:

```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Keep these the same:**
```
NEXT_PUBLIC_APP_URL=https://www.sneekcreatemedia.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUSINESS_EMAIL=your-business@example.com
```

**Save and redeploy!**

---

### **Step 4: Test with Real Payment**

**Make a small real payment ($1-5 CAD) to test:**

1. Go to: https://www.sneekcreatemedia.com/booking
2. Fill out form
3. **Use a REAL credit card** (you'll be charged!)
4. Complete payment
5. Verify:
   - ✅ Payment succeeds
   - ✅ Emails received
   - ✅ Payment in Stripe Dashboard (live mode)
   - ✅ Webhook delivery successful

**⚠️ You will be charged real money! Start with a small amount.**

---

### **Step 5: Monitor for 24 Hours**

After going live:

1. **Check webhook deliveries:**
   - https://dashboard.stripe.com/webhooks
   - Monitor "Recent deliveries"
   - Look for any failures

2. **Check payments:**
   - https://dashboard.stripe.com/payments
   - Verify all payments process correctly

3. **Check emails:**
   - Confirm customers receive emails
   - Confirm business receives notifications

4. **Review logs:**
   - Check application logs for errors
   - Monitor webhook processing

---

## 🔍 Troubleshooting

### **Issue: Webhook returns 400 "Webhook signature verification failed"**

**Cause:** Webhook secret doesn't match

**Fix:**
1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook
3. Click "Reveal" on signing secret
4. Copy the exact secret
5. Update `STRIPE_WEBHOOK_SECRET` in production environment
6. Make sure there are no extra spaces
7. Redeploy application
8. Try again

---

### **Issue: Webhook returns 500 "Internal Server Error"**

**Cause:** Error in webhook handler

**Fix:**
1. Check application logs (Vercel logs)
2. Common causes:
   - Missing `RESEND_API_KEY`
   - Missing `BUSINESS_EMAIL`
   - Email service down
3. Verify all environment variables are set
4. Check logs for specific error message

---

### **Issue: Payment succeeds but no emails sent**

**Cause:** Webhook not firing or email service issue

**Fix:**
1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. If no deliveries: Webhook not configured correctly
3. If deliveries show errors: Check application logs
4. Verify `RESEND_API_KEY` is valid
5. Check Resend dashboard for email delivery status

---

### **Issue: "STRIPE_SECRET_KEY is not set"**

**Cause:** Environment variable not loaded

**Fix:**
1. Verify variable is set in hosting platform
2. Check variable name is exactly `STRIPE_SECRET_KEY`
3. Redeploy application after adding variable
4. Check deployment logs

---

### **Issue: Duplicate emails sent**

**Cause:** Webhook fired multiple times (rare with current setup)

**Fix:**
- Your code already has idempotency protection
- Check logs to see if session was processed multiple times
- If happens frequently, consider adding Redis (optional)

---

## 📊 Quick Reference

### **Test Mode URLs:**
- API Keys: https://dashboard.stripe.com/test/apikeys
- Webhooks: https://dashboard.stripe.com/test/webhooks
- Payments: https://dashboard.stripe.com/test/payments
- Logs: https://dashboard.stripe.com/test/logs

### **Live Mode URLs:**
- API Keys: https://dashboard.stripe.com/apikeys
- Webhooks: https://dashboard.stripe.com/webhooks
- Payments: https://dashboard.stripe.com/payments
- Logs: https://dashboard.stripe.com/logs

### **Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
Insufficient Funds: 4000 0000 0000 9995
```

### **Your Webhook Endpoint:**
```
https://www.sneekcreatemedia.com/api/webhooks/stripe
```

### **Your Services & Prices (CAD):**
```
MLS Package: $250
MLS + Social Package: $475
MLS + SC Prime Package: $675
HDR Photos: $250
3D Tour & RMS: $100
Essential Video: $300
SC Prime Reel: $500
Possession Video: $300
Drone Photos: $100
```

---

## ✅ Complete Checklist

### **Test Mode Setup:**
- [ ] Get test API keys from Stripe
- [ ] Create test webhook endpoint
- [ ] Add test environment variables to production
- [ ] Redeploy application
- [ ] Send test webhook from Stripe (should return 200 OK)
- [ ] Make test payment with test card
- [ ] Receive confirmation emails
- [ ] Verify payment in Stripe Dashboard
- [ ] Check webhook deliveries show 200 OK

### **Live Mode Setup:**
- [ ] Test mode working perfectly
- [ ] Get live API keys from Stripe
- [ ] Create live webhook endpoint
- [ ] Update environment variables with live keys
- [ ] Redeploy application
- [ ] Make small real payment ($1-5)
- [ ] Verify everything works
- [ ] Monitor for 24 hours

---

## 🎯 Summary

**Your Code:** ✅ Excellent - well implemented  
**Currency:** CAD (Canadian Dollars)  
**Webhook Endpoint:** `https://www.sneekcreatemedia.com/api/webhooks/stripe`  
**Next Step:** Set up test mode first, then go live

**Estimated Time:**
- Test mode setup: 15 minutes
- Testing: 15 minutes
- Live mode setup: 10 minutes
- **Total: ~40 minutes**

---

**You're ready to go! Start with test mode and follow this guide step by step.** 🚀

**Questions?** Check the troubleshooting section or review your application logs.
