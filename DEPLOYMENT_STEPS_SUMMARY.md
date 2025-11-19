# 🚀 Quick Deployment Steps Summary

## ✅ Booking System: PRODUCTION READY

All code is production-ready with:
- ✅ Production pricing ($250-$675)
- ✅ Webhook security enforced
- ✅ Error handling complete
- ✅ Success page fixed
- ✅ Service name mappings updated

---

## 📝 Step-by-Step Deployment

### 1️⃣ Deploy to Vercel (5 minutes)

1. **Create Vercel Account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab
   - Click "Add New Project"
   - Import your repository
   - Click "Deploy" (don't worry about env vars yet)

2. **Get Your Vercel URL:**
   - After deployment: `https://yourproject.vercel.app`
   - Save this URL

---

### 2️⃣ Set Up Stripe Production (10 minutes)

1. **Get Stripe Production Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Toggle to **Live mode** (top right)
   - **Developers → API keys**
   - Copy **Live secret key** (`sk_live_...`)

2. **Create Webhook Endpoint:**
   - **Developers → Webhooks → Add endpoint**
   - URL: `https://yourproject.vercel.app/api/webhooks/stripe`
   - Events: Select `checkout.session.completed`
   - Click "Add endpoint"
   - Copy **Signing secret** (`whsec_...`)

---

### 3️⃣ Set Up Resend Email (15-30 minutes)

1. **Verify Domain:**
   - Go to [Resend Dashboard](https://resend.com)
   - **Domains → Add Domain**
   - Enter your domain (e.g., `yourdomain.com`)
   - Add DNS records (SPF, DKIM) to your domain
   - Wait for verification (up to 48 hours)

2. **Get API Key:**
   - **API Keys → Create API Key**
   - Copy key (`re_...`)

---

### 4️⃣ Add Environment Variables to Vercel (5 minutes)

**Go to: Project Settings → Environment Variables**

Add these **for Production environment:**

```bash
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
NEXT_PUBLIC_APP_URL=https://yourproject.vercel.app
RESEND_API_KEY=re_YOUR_KEY
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=your@business.com
```

⚠️ **After adding variables, click "Redeploy"** to apply them.

---

### 5️⃣ Update Stripe Webhook URL (2 minutes)

1. **Go to Stripe → Webhooks**
2. **Edit your webhook endpoint**
3. **Update URL** to: `https://yourproject.vercel.app/api/webhooks/stripe`
4. **Save**

---

### 6️⃣ Test Everything (10 minutes)

1. **Test Booking:**
   - Go to `https://yourproject.vercel.app/booking`
   - Complete booking with test card: `4242 4242 4242 4242`

2. **Verify:**
   - ✅ Payment redirects to Stripe
   - ✅ Payment completes successfully
   - ✅ Success page displays
   - ✅ Emails are sent (check inboxes)
   - ✅ Webhook shows successful in Stripe logs

---

## 🔗 Quick Links

- **Vercel:** https://vercel.com/dashboard
- **Stripe:** https://dashboard.stripe.com (Live mode)
- **Resend:** https://resend.com/dashboard

---

## ⚠️ Important Notes

1. **Environment Variables:**
   - Must be set in Vercel (not in code)
   - Select "Production" environment
   - Redeploy after adding

2. **Stripe:**
   - Must use **Live mode** for production
   - Webhook URL must match your Vercel URL
   - Webhook secret must match

3. **Resend:**
   - Domain must be verified before sending
   - `RESEND_FROM_EMAIL` must use verified domain
   - Wait for DNS verification (up to 48 hours)

4. **Testing:**
   - Use Stripe test card in Live mode for testing
   - Test webhook delivery in Stripe dashboard
   - Check email delivery in Resend dashboard

---

## 🆘 If Something Goes Wrong

**Webhook not working?**
- Check `STRIPE_WEBHOOK_SECRET` in Vercel
- Verify webhook URL in Stripe matches Vercel URL
- Check Stripe webhook logs

**Emails not sending?**
- Verify Resend domain is verified
- Check `RESEND_FROM_EMAIL` uses verified domain
- Review Resend delivery logs

**Payment not completing?**
- Verify `STRIPE_SECRET_KEY` is production key
- Check `NEXT_PUBLIC_APP_URL` matches Vercel URL
- Review Vercel function logs

---

## ✅ Final Checklist

Before going live:

- [ ] Deployed to Vercel
- [ ] All environment variables set in Vercel
- [ ] Stripe webhook endpoint created
- [ ] Stripe webhook secret added to Vercel
- [ ] Resend domain verified
- [ ] Resend API key added to Vercel
- [ ] Test booking completed successfully
- [ ] Emails received correctly
- [ ] Webhook logs show success

---

**🎉 Your booking system is now live!**

For detailed instructions, see: `VERCEL_DEPLOYMENT_GUIDE.md`

