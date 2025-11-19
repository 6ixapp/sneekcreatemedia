# Production Readiness Report & Deployment Guide

## 🔴 CRITICAL ISSUES TO FIX BEFORE PRODUCTION

### 1. **Test Prices Still Active** ✅ FIXED
**Status:** ✅ COMPLETE - All prices updated to production values

**Production Pricing:**
- ✅ MLS Package: $250
- ✅ MLS + Social Package: $475
- ✅ MLS + SC Prime Package: $675
- ✅ HDR Photos: $250
- ✅ 3D Tour & RMS: $100
- ✅ Essential Video: $300
- ✅ SC Prime Reel: $500
- ✅ Possession Video: $300
- ✅ Drone Photos: $100

### 2. **Hardcoded Test Stripe Link** ✅ FIXED
**Status:** ✅ COMPLETE - Test link removed

### 3. **Webhook Security** ✅ FIXED
**Status:** ✅ COMPLETE - Webhook secret now required in production

**Changes Made:**
- ✅ Production environment check added
- ✅ Webhook fails if secret is missing in production
- ✅ Development mode still allows testing without secret (with warnings)

### 4. **Minimum Charge Logic** ✅ FIXED
**Status:** ✅ COMPLETE - Validation updated for production prices

**Changes Made:**
- ✅ Minimum charge validation set to $0.50 (Stripe requirement)
- ✅ All production prices exceed minimum requirement
- ✅ Clear error messages for invalid amounts

### 5. **Missing Production Environment Variables** ⚠️ CRITICAL

**Required Environment Variables:**
```bash
# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_...          # Production secret key (NOT test key)
STRIPE_WEBHOOK_SECRET=whsec_...        # Production webhook secret (MANDATORY)

# Next.js
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # Production URL

# Resend Email
RESEND_API_KEY=re_...                   # Production Resend API key
RESEND_FROM_EMAIL=noreply@yourdomain.com    # Must be verified domain
RESEND_TO_EMAIL=your@business.com       # Business notification email
```

### 6. **Image URL Placeholder** ⚠️ MINOR
**Location:** `app/api/stripe/checkout/route.ts` (line 103)

**Issue:** Hardcoded placeholder image URL

**Fix Required:** Update to actual service image URLs or remove

---

## ✅ PRODUCTION READY COMPONENTS

1. ✅ **Email Templates** - Well formatted, mobile-responsive
2. ✅ **Payment Flow** - Proper error handling and validation
3. ✅ **Webhook Handling** - Idempotency checks in place
4. ✅ **Email Fallback** - Payment-success endpoint sends emails if webhook fails
5. ✅ **Input Validation** - Email format, date validation, required fields
6. ✅ **Error Handling** - Comprehensive try-catch blocks with logging

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Code Changes Required:
- [x] ✅ Update all service prices from $0.001 to production values
- [x] ✅ Remove test Stripe link from payment-form.tsx
- [x] ✅ Enforce webhook secret requirement in production
- [ ] Update service image URLs in checkout (optional)
- [x] ✅ Update minimum charge validation for production
- [x] ✅ Update all "TEST MODE" comments

### Environment Setup:
- [ ] Get Stripe production API keys
- [ ] Set up Stripe webhook endpoint in dashboard
- [ ] Configure Resend with verified domain
- [ ] Set all required environment variables
- [ ] Test webhook endpoint with Stripe CLI

### Testing:
- [ ] Test complete booking flow end-to-end
- [ ] Verify emails are sent correctly
- [ ] Test webhook signature verification
- [ ] Test payment success page
- [ ] Test error scenarios (failed payments, invalid data)
- [ ] Verify idempotency (no duplicate emails)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Prepare Code for Production

1. **Update Service Prices:**
   ```bash
   # You'll need to update prices in:
   # - app/api/stripe/checkout/route.ts
   # - lib/email.ts  
   # - app/components/steps/service-selection.tsx
   ```

2. **Remove Test Code:**
   - Remove `STRIPE_TEST_LINK` from payment-form.tsx
   - Update all "TEST MODE" comments

3. **Fix Webhook Security:**
   - Ensure webhook secret is required in production

### Step 2: Set Up Stripe Production Account

1. **Get Production Keys:**
   - Log into Stripe Dashboard
   - Switch to "Live" mode
   - Go to Developers → API keys
   - Copy your **Live** secret key (starts with `sk_live_`)

2. **Set Up Webhook:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret (starts with `whsec_`)

### Step 3: Set Up Resend Email

1. **Verify Domain:**
   - Log into Resend Dashboard
   - Go to Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification (can take up to 48 hours)

2. **Get API Key:**
   - Go to API Keys
   - Create new API key
   - Copy the key (starts with `re_`)

### Step 4: Choose Deployment Platform

#### Option A: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables (see above)
   - Redeploy after adding variables

#### Option B: Other Platforms (Netlify, Railway, etc.)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your platform's dashboard

3. **Deploy** using platform-specific commands

### Step 5: Configure Production Environment Variables

Add these in your hosting platform:

```bash
# Stripe Production
STRIPE_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Next.js
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Resend Email
RESEND_API_KEY=re_YOUR_RESEND_KEY
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=your@business.com
```

### Step 6: Update Stripe Webhook URL

1. Go to Stripe Dashboard → Webhooks
2. Update webhook endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
3. Test webhook delivery

### Step 7: Post-Deployment Testing

1. **Test Booking Flow:**
   - Create a test booking
   - Complete payment with test card: `4242 4242 4242 4242`
   - Verify emails are received
   - Check webhook logs in Stripe dashboard

2. **Monitor Logs:**
   - Check application logs for errors
   - Monitor Stripe webhook delivery
   - Check Resend email delivery logs

3. **Verify Security:**
   - Test webhook signature verification
   - Ensure no test keys are exposed
   - Verify HTTPS is enabled

---

## 🔒 SECURITY CHECKLIST

- [ ] All API keys are production keys (not test keys)
- [ ] Webhook secret is set and verified
- [ ] HTTPS is enabled
- [ ] Environment variables are secure (not in code)
- [ ] No test data in production code
- [ ] Error messages don't expose sensitive info
- [ ] Rate limiting is configured (if needed)

---

## 📊 MONITORING & MAINTENANCE

### Key Metrics to Monitor:
1. **Payment Success Rate** - Track successful vs failed payments
2. **Email Delivery Rate** - Monitor Resend delivery logs
3. **Webhook Delivery** - Check Stripe webhook logs
4. **Error Rates** - Monitor application errors

### Regular Tasks:
- Review Stripe dashboard weekly
- Check Resend email delivery logs
- Monitor webhook failures
- Review error logs monthly

---

## 🆘 TROUBLESHOOTING

### Emails Not Sending:
- Check Resend API key is correct
- Verify domain is verified in Resend
- Check email addresses are valid
- Review Resend delivery logs

### Webhook Not Working:
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure endpoint is accessible (not behind auth)
- Review Stripe webhook logs

### Payments Failing:
- Verify Stripe keys are production keys
- Check Stripe dashboard for declined reasons
- Review payment logs
- Ensure minimum charge requirements are met

---

## 📝 NOTES

- **Test Mode:** Currently all prices are $0.001 - MUST be updated before production
- **Minimum Charge:** Stripe requires minimum $0.50 USD - ensure production prices meet this
- **Webhook Security:** Never skip webhook signature verification in production
- **Email Domain:** Must be verified in Resend before sending emails

---

## 🎯 NEXT STEPS

1. **Immediate:** Update all service prices
2. **Before Deploy:** Set up Stripe and Resend production accounts
3. **Deploy:** Follow deployment steps above
4. **Post-Deploy:** Complete testing checklist
5. **Ongoing:** Monitor and maintain as needed

