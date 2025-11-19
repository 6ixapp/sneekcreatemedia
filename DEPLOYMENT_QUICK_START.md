# Quick Deployment Guide

## 🚀 Fast Track Deployment (5 Steps)

### Step 1: Update Service Prices ⚠️ REQUIRED
**Files to update:**
- `app/api/stripe/checkout/route.ts` (lines 44-53)
- `app/components/steps/service-selection.tsx` (lines 15-81)

**Action:** Replace all `price: 0.001` with actual production prices

### Step 2: Get Production API Keys

**Stripe:**
1. Login to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live** mode (toggle top right)
3. Go to Developers → API keys
4. Copy **Live** secret key (`sk_live_...`)

**Resend:**
1. Login to [Resend Dashboard](https://resend.com)
2. Verify your domain (add DNS records)
3. Go to API Keys → Create new key
4. Copy API key (`re_...`)

### Step 3: Set Up Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events: Select `checkout.session.completed`
5. Copy webhook signing secret (`whsec_...`)

### Step 4: Set Environment Variables

Add these in your hosting platform (Vercel/Netlify/etc.):

```bash
# Stripe Production
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# Next.js
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Resend Email
RESEND_API_KEY=re_YOUR_KEY_HERE
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=your@business.com
```

### Step 5: Deploy

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel login
vercel --prod
```

Then add environment variables in Vercel dashboard and redeploy.

**Other Platforms:**
```bash
npm run build
# Then deploy using your platform's method
```

---

## ✅ Post-Deployment Checklist

- [ ] Test booking flow end-to-end
- [ ] Verify emails are sent correctly
- [ ] Check webhook logs in Stripe dashboard
- [ ] Test payment success page
- [ ] Verify all prices are correct (not $0.001)

---

## 🔧 What Was Fixed

✅ Removed unused test Stripe link  
✅ Made webhook secret required in production  
✅ Improved amount validation  
✅ Added TODO comments for price updates  
✅ Enhanced security checks  

---

## 📚 Full Documentation

See `PRODUCTION_READINESS.md` for complete details.

