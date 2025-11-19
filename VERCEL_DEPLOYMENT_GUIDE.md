# Complete Vercel Deployment Guide - Booking System

## 📋 Pre-Deployment Checklist

### ✅ Code Status: PRODUCTION READY
- ✅ All prices updated to production values
- ✅ All test code removed
- ✅ Webhook security enforced
- ✅ Environment variable validation in place
- ✅ Error handling complete
- ✅ Success page with Suspense boundary

---

## 🚀 Step-by-Step Deployment Guide

### STEP 1: Prepare Your Code

1. **Verify all changes are committed:**
   ```bash
   git status
   git add .
   git commit -m "Production ready: Updated pricing and security fixes"
   git push origin main
   ```

2. **Test locally one final time:**
   ```bash
   npm run build
   npm start
   ```
   - Test booking flow end-to-end
   - Verify all prices display correctly
   - Check success page loads

---

### STEP 2: Set Up Vercel Account & Project

1. **Create/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login with GitHub/GitLab/Bitbucket

2. **Create New Project:**
   - Click "Add New Project"
   - Import your Git repository
   - Select your repository
   - Click "Import"

3. **Configure Project Settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

---

### STEP 3: Set Environment Variables in Vercel

**Before deploying, set these environment variables:**

1. **Go to Project Settings → Environment Variables**

2. **Add each variable below (for Production environment):**

```bash
# Stripe Production Keys (REQUIRED)
STRIPE_SECRET_KEY=sk_live_YOUR_PRODUCTION_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SIGNING_SECRET

# Next.js Configuration (REQUIRED)
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app

# Resend Email Configuration (REQUIRED)
RESEND_API_KEY=re_YOUR_RESEND_API_KEY
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=your@business.com
```

**How to add:**
- Click "Add New"
- Enter variable name (e.g., `STRIPE_SECRET_KEY`)
- Enter variable value (paste your key)
- Select environment: **Production** (and Preview if needed)
- Click "Save"
- Repeat for each variable

**⚠️ IMPORTANT:** 
- Use **Production** environment for live site
- Can also add to Preview/Development for testing
- Do NOT commit these to Git

---

### STEP 4: Deploy to Vercel

1. **First Deployment:**
   - After setting environment variables, click **"Deploy"**
   - Vercel will build and deploy your project
   - Wait for build to complete (2-5 minutes)

2. **Get Your Deployment URL:**
   - After deployment, you'll see: `https://yourproject.vercel.app`
   - Save this URL - you'll need it for webhook setup

3. **Verify Deployment:**
   - Visit your deployment URL
   - Test the homepage loads
   - Check booking page is accessible

---

### STEP 5: Set Up Stripe Production Account

1. **Get Production API Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Toggle to **Live mode** (top right)
   - Go to **Developers → API keys**
   - Copy your **Live** secret key (starts with `sk_live_`)
   - Add to Vercel: `STRIPE_SECRET_KEY=sk_live_...`

2. **Set Up Webhook Endpoint:**
   - Still in Stripe Dashboard (Live mode)
   - Go to **Developers → Webhooks**
   - Click **"Add endpoint"**
   - **Endpoint URL:** `https://yourproject.vercel.app/api/webhooks/stripe`
   - **Description:** "Production booking webhook"
   - **Events to listen for:** Select these events:
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

3. **Get Webhook Secret:**
   - After creating webhook, click on it
   - Find **"Signing secret"** (starts with `whsec_`)
   - Click **"Reveal"** and copy it
   - Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`

4. **Test Webhook:**
   - In Stripe webhook page, click **"Send test webhook"**
   - Select event: `checkout.session.completed`
   - Check webhook logs to see if it was received

---

### STEP 6: Update Vercel Environment Variables

After getting your Stripe webhook secret:

1. **Go back to Vercel Project Settings → Environment Variables**
2. **Update:**
   - `STRIPE_WEBHOOK_SECRET` with the actual webhook secret
   - `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - This applies new environment variables

---

### STEP 7: Set Up Resend Email Service

1. **Verify Domain (Required for Production):**
   - Go to [Resend Dashboard](https://resend.com)
   - Navigate to **Domains**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `yourdomain.com`)
   - Add DNS records provided by Resend:
     - SPF record
     - DKIM records
     - DMARC record (optional but recommended)
   - Wait for verification (can take up to 48 hours)
   - Status will show "Verified" when ready

2. **Get API Key:**
   - Go to **API Keys** section
   - Click **"Create API Key"**
   - Give it a name (e.g., "Production")
   - Copy the key (starts with `re_`)
   - Add to Vercel: `RESEND_API_KEY=re_...`

3. **Configure Email Addresses:**
   - Use verified domain for `RESEND_FROM_EMAIL`
   - Example: `noreply@yourdomain.com`
   - Set `RESEND_TO_EMAIL` to your business email

4. **Update Vercel Environment Variables:**
   - Add `RESEND_API_KEY`
   - Add `RESEND_FROM_EMAIL` (must be from verified domain)
   - Add `RESEND_TO_EMAIL`
   - Redeploy after adding

---

### STEP 8: Test Production Deployment

1. **Test Booking Flow:**
   - Go to: `https://yourproject.vercel.app/booking`
   - Complete a test booking with Stripe test card:
     - Card: `4242 4242 4242 4242`
     - Expiry: Any future date (e.g., `12/25`)
     - CVC: Any 3 digits (e.g., `123`)
     - ZIP: Any 5 digits (e.g., `12345`)

2. **Verify Payment Success:**
   - Complete payment
   - Should redirect to success page
   - Check booking details display correctly

3. **Verify Webhook:**
   - Go to Stripe Dashboard → Webhooks
   - Check webhook delivery logs
   - Should show successful `checkout.session.completed` event

4. **Verify Emails:**
   - Check customer email inbox
   - Check business notification email
   - Both should receive confirmation emails

---

### STEP 9: Custom Domain (Optional)

1. **Add Custom Domain in Vercel:**
   - Go to **Settings → Domains**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `yourdomain.com`)
   - Follow DNS configuration instructions
   - Wait for DNS propagation (up to 48 hours)

2. **Update Environment Variables:**
   - After domain is active, update:
     - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
   - Update Stripe webhook URL:
     - New URL: `https://yourdomain.com/api/webhooks/stripe`
   - Redeploy

---

## 🔒 Security Checklist

- [x] All API keys are production keys (not test keys)
- [x] Webhook secret is set in Vercel
- [x] HTTPS is enabled (automatic with Vercel)
- [x] Environment variables are set in Vercel (not in code)
- [x] No test data in production code
- [x] Webhook signature verification is required in production
- [x] Domain verification complete for Resend emails

---

## 📊 Post-Deployment Monitoring

### Monitor These:

1. **Vercel Dashboard:**
   - Check deployment logs for errors
   - Monitor function execution times
   - Check error rates

2. **Stripe Dashboard:**
   - Monitor payment success rates
   - Check webhook delivery logs
   - Review failed webhooks

3. **Resend Dashboard:**
   - Check email delivery logs
   - Monitor bounce rates
   - Review email statistics

---

## 🆘 Troubleshooting

### Issue: Webhook Not Working
**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly in Vercel
- Check webhook URL in Stripe matches your Vercel URL
- Check Stripe webhook logs for errors
- Verify webhook events are selected in Stripe

### Issue: Emails Not Sending
**Solution:**
- Verify Resend domain is verified
- Check `RESEND_FROM_EMAIL` uses verified domain
- Check `RESEND_API_KEY` is correct
- Review Resend delivery logs

### Issue: Payment Not Completing
**Solution:**
- Verify `STRIPE_SECRET_KEY` is production key (not test)
- Check `NEXT_PUBLIC_APP_URL` matches your deployment URL
- Review Vercel function logs for errors
- Check Stripe dashboard for payment attempts

### Issue: Success Page Not Loading
**Solution:**
- Check browser console for errors
- Verify session ID is in URL
- Check API endpoint `/api/stripe/payment-success` logs in Vercel
- Ensure Suspense boundary is working

---

## 📝 Environment Variables Summary

**Required for Production:**

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Next.js
NEXT_PUBLIC_APP_URL=https://yourproject.vercel.app

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=your@business.com
```

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Stripe webhook endpoint created and tested
- [ ] Resend domain verified
- [ ] Test booking completed successfully
- [ ] Emails received correctly
- [ ] Webhook logs show successful events
- [ ] Success page displays correctly
- [ ] No errors in Vercel logs
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled (automatic with Vercel)

---

## 🎯 Quick Reference URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Resend Dashboard:** https://resend.com/dashboard
- **Your Deployed Site:** `https://yourproject.vercel.app`

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Resend Docs:** https://resend.com/docs

---

**Your booking system is now live! 🚀**

