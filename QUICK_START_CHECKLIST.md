# ⚡ Quick Start Checklist - Stripe Payment Setup

**Site:** https://www.sneekcreatemedia.com  
**Time Required:** ~40 minutes  
**Mode:** Start with TEST, then go LIVE

---

## 🧪 PHASE 1: TEST MODE SETUP (30 minutes)

### ✅ Step 1: Get Test API Keys (5 min)

- [ ] Go to: https://dashboard.stripe.com/test/apikeys
- [ ] Verify "Test mode" toggle is ON (top-right)
- [ ] Copy **Publishable key** (starts with `pk_test_`)
- [ ] Copy **Secret key** (click "Reveal" - starts with `sk_test_`)

**Save these for next step!**

---

### ✅ Step 2: Create Test Webhook (5 min)

- [ ] Go to: https://dashboard.stripe.com/test/webhooks
- [ ] Verify "Test mode" toggle is ON
- [ ] Click "Add endpoint"
- [ ] Enter URL: `https://www.sneekcreatemedia.com/api/webhooks/stripe`
- [ ] Click "Select events"
- [ ] Add these 5 events:
  - [ ] `checkout.session.completed`
  - [ ] `checkout.session.async_payment_succeeded`
  - [ ] `checkout.session.async_payment_failed`
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
- [ ] Click "Add endpoint"
- [ ] Click on your new webhook
- [ ] Click "Reveal" on "Signing secret"
- [ ] Copy webhook secret (starts with `whsec_`)

**Save this for next step!**

---

### ✅ Step 3: Add Environment Variables (10 min)

**Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 6 variables:

```
1. NEXT_PUBLIC_APP_URL
   Value: https://www.sneekcreatemedia.com
   Environment: Production, Preview, Development

2. STRIPE_SECRET_KEY
   Value: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from Step 1)
   Environment: Production, Preview, Development

3. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   Value: pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from Step 1)
   Environment: Production, Preview, Development

4. STRIPE_WEBHOOK_SECRET
   Value: whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from Step 2)
   Environment: Production, Preview, Development

5. RESEND_API_KEY
   Value: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (your existing key)
   Environment: Production, Preview, Development

6. BUSINESS_EMAIL
   Value: your-business@example.com (your email)
   Environment: Production, Preview, Development
```

- [ ] All 6 variables added
- [ ] Click "Save" for each
- [ ] **Redeploy application** (Deployments tab → Redeploy)

---

### ✅ Step 4: Test Webhook (5 min)

- [ ] Go to: https://dashboard.stripe.com/test/webhooks
- [ ] Click on your webhook endpoint
- [ ] Click "Send test webhook"
- [ ] Select event: `checkout.session.completed`
- [ ] Click "Send test webhook"
- [ ] **Verify:** Status shows **"200 OK"** ✅

**If you see error:** Check troubleshooting in main guide

---

### ✅ Step 5: Test Real Payment (5 min)

- [ ] Go to: https://www.sneekcreatemedia.com/booking
- [ ] Fill out booking form (use your real email)
- [ ] Use test card:
  ```
  Card: 4242 4242 4242 4242
  Expiry: 12/25
  CVC: 123
  ZIP: 12345
  ```
- [ ] Complete payment
- [ ] **Verify:** Redirected to success page ✅
- [ ] **Verify:** Received confirmation email ✅
- [ ] **Verify:** Business received notification email ✅

---

### ✅ Step 6: Verify in Stripe Dashboard (2 min)

**Check Payment:**
- [ ] Go to: https://dashboard.stripe.com/test/payments
- [ ] See your test payment
- [ ] Status is "Succeeded"

**Check Webhook:**
- [ ] Go to: https://dashboard.stripe.com/test/webhooks
- [ ] Click on your webhook
- [ ] Click "Recent deliveries"
- [ ] See webhook delivery with "200 OK"

---

## 🎉 TEST MODE COMPLETE!

If all checkboxes above are checked, you're ready for live mode!

---

## 🚀 PHASE 2: LIVE MODE SETUP (10 minutes)

**⚠️ Only proceed if test mode works perfectly!**

### ✅ Step 1: Get Live API Keys (3 min)

- [ ] Go to: https://dashboard.stripe.com/apikeys
- [ ] Toggle to **"Live mode"** (top-right)
- [ ] Copy **Publishable key** (starts with `pk_live_`)
- [ ] Copy **Secret key** (click "Reveal" - starts with `sk_live_`)

**⚠️ These are different from test keys!**

---

### ✅ Step 2: Create Live Webhook (3 min)

- [ ] Go to: https://dashboard.stripe.com/webhooks
- [ ] Verify **"Live mode"** toggle is ON
- [ ] Click "Add endpoint"
- [ ] Enter URL: `https://www.sneekcreatemedia.com/api/webhooks/stripe`
- [ ] Select the same 5 events as test mode
- [ ] Click "Add endpoint"
- [ ] Click on your new webhook
- [ ] Click "Reveal" on "Signing secret"
- [ ] Copy webhook secret (starts with `whsec_`)

**⚠️ Live webhook secret is different from test!**

---

### ✅ Step 3: Update Environment Variables (2 min)

**In Vercel → Settings → Environment Variables**

**Update these 3 variables with LIVE values:**

```
STRIPE_SECRET_KEY
   New Value: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from Step 1)

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   New Value: pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from Step 1)

STRIPE_WEBHOOK_SECRET
   New Value: whsec_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from Step 2)
```

- [ ] All 3 variables updated
- [ ] Click "Save"
- [ ] **Redeploy application**

---

### ✅ Step 4: Test with Real Payment (2 min)

**⚠️ You will be charged real money!**

- [ ] Go to: https://www.sneekcreatemedia.com/booking
- [ ] Fill out form
- [ ] **Use REAL credit card** (start with small amount)
- [ ] Complete payment
- [ ] **Verify:** Payment succeeds ✅
- [ ] **Verify:** Emails received ✅
- [ ] Go to: https://dashboard.stripe.com/payments (LIVE mode)
- [ ] **Verify:** Payment appears ✅

---

## ✅ LIVE MODE COMPLETE!

You're now accepting real payments! 🎉

---

## 📊 Post-Launch Monitoring (24 hours)

### Daily Checks:

**Day 1:**
- [ ] Check webhook deliveries (should all be 200 OK)
- [ ] Verify emails are sending
- [ ] Review any failed payments
- [ ] Check application logs for errors

**Week 1:**
- [ ] Monitor payment success rate
- [ ] Check customer feedback
- [ ] Review webhook delivery success rate
- [ ] Verify all bookings processed correctly

---

## 🆘 Troubleshooting Quick Reference

### Webhook returns 400 error:
→ Check webhook secret matches Stripe Dashboard
→ Redeploy after updating environment variables

### Webhook returns 500 error:
→ Check application logs
→ Verify all environment variables are set
→ Check RESEND_API_KEY is valid

### No emails sent:
→ Check webhook deliveries in Stripe
→ Verify RESEND_API_KEY and BUSINESS_EMAIL are set
→ Check Resend dashboard for delivery status

### Payment succeeds but no confirmation:
→ Check webhook was delivered (Stripe Dashboard)
→ Check application logs for errors
→ Verify webhook secret is correct

---

## 📞 Support Resources

**Stripe Dashboard:**
- Test: https://dashboard.stripe.com/test
- Live: https://dashboard.stripe.com

**Documentation:**
- Main Guide: `STRIPE_COMPLETE_SETUP_GUIDE.md`
- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] Test mode working perfectly
- [ ] Live mode configured
- [ ] Real payment tested successfully
- [ ] Emails sending to customers
- [ ] Emails sending to business
- [ ] Webhook deliveries showing 200 OK
- [ ] No errors in application logs
- [ ] Monitored for 24 hours without issues

---

## 🎯 Current Status

**Check your progress:**

```
Phase 1: Test Mode Setup
[ ] Step 1: Get test API keys
[ ] Step 2: Create test webhook
[ ] Step 3: Add environment variables
[ ] Step 4: Test webhook
[ ] Step 5: Test real payment
[ ] Step 6: Verify in dashboard

Phase 2: Live Mode Setup
[ ] Step 1: Get live API keys
[ ] Step 2: Create live webhook
[ ] Step 3: Update environment variables
[ ] Step 4: Test with real payment

Post-Launch
[ ] Monitor for 24 hours
[ ] All systems operational
```

---

**Time to Complete:** ~40 minutes  
**Difficulty:** Easy (just follow steps)  
**Your Code:** Already perfect! ✅

**Start with Phase 1 and work through each checkbox. You've got this!** 🚀
