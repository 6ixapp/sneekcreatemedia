# 💳 Stripe Payment Integration - Documentation

## 📚 Documentation Overview

This folder contains complete documentation for setting up Stripe payments on **sneekcreatemedia.com**.

---

## 🎯 Start Here

### **New to this project?**
Start with: **`QUICK_START_CHECKLIST.md`**

This gives you a simple checkbox list to follow step-by-step.

### **Want detailed explanations?**
Read: **`STRIPE_COMPLETE_SETUP_GUIDE.md`**

This has everything you need with detailed explanations and troubleshooting.

---

## 📁 Available Documentation

### 1. **QUICK_START_CHECKLIST.md** ⭐ START HERE
- Simple checkbox format
- Step-by-step instructions
- ~40 minutes to complete
- Perfect for quick setup

### 2. **STRIPE_COMPLETE_SETUP_GUIDE.md** 📖 DETAILED GUIDE
- Comprehensive setup guide
- Test mode and live mode instructions
- Troubleshooting section
- Code review summary
- All URLs and references

### 3. **.env.example** 🔐 ENVIRONMENT TEMPLATE
- Template for environment variables
- Comments explaining each variable
- Copy to `.env.local` for local development

### 4. **QUICK_START_PRODUCTION.md** 🚀 PRODUCTION DEPLOYMENT
- Production deployment guide
- Environment variable setup
- Testing procedures

---

## ✅ What's Already Done

Your Stripe integration code is **already implemented and working!**

### **Implemented Features:**
- ✅ Stripe checkout session creation
- ✅ Webhook handler with signature verification
- ✅ Payment success page
- ✅ Email confirmation system
- ✅ Error handling and validation
- ✅ Idempotency protection
- ✅ Metadata tracking for bookings

### **What You Need to Do:**
- Configure Stripe API keys
- Set up webhook endpoint
- Add environment variables
- Test the integration

**Estimated Time:** ~40 minutes

---

## 🚀 Quick Setup Summary

### **Phase 1: Test Mode (30 min)**
1. Get test API keys from Stripe
2. Create test webhook endpoint
3. Add environment variables
4. Test with test card
5. Verify everything works

### **Phase 2: Live Mode (10 min)**
1. Get live API keys
2. Create live webhook
3. Update environment variables
4. Test with real payment
5. Monitor for 24 hours

---

## 🔑 Key Information

**Your Website:**
```
https://www.sneekcreatemedia.com
```

**Webhook Endpoint:**
```
https://www.sneekcreatemedia.com/api/webhooks/stripe
```

**Currency:**
```
CAD (Canadian Dollars)
```

**Services & Prices:**
```
MLS Package: $250 CAD
MLS + Social Package: $475 CAD
MLS + SC Prime Package: $675 CAD
HDR Photos: $250 CAD
3D Tour & RMS: $100 CAD
Essential Video: $300 CAD
SC Prime Reel: $500 CAD
Possession Video: $300 CAD
Drone Photos: $100 CAD
```

---

## 🧪 Test Cards

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25 (any future date)
CVC: 123 (any 3 digits)
```

**Declined Payment:**
```
Card: 4000 0000 0000 0002
```

**Requires Authentication:**
```
Card: 4000 0025 0000 3155
```

---

## 📊 Stripe Dashboard Links

### **Test Mode:**
- API Keys: https://dashboard.stripe.com/test/apikeys
- Webhooks: https://dashboard.stripe.com/test/webhooks
- Payments: https://dashboard.stripe.com/test/payments

### **Live Mode:**
- API Keys: https://dashboard.stripe.com/apikeys
- Webhooks: https://dashboard.stripe.com/webhooks
- Payments: https://dashboard.stripe.com/payments

---

## 🔐 Required Environment Variables

```env
# Application
NEXT_PUBLIC_APP_URL=https://www.sneekcreatemedia.com

# Stripe (Test or Live)
STRIPE_SECRET_KEY=sk_test_or_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUSINESS_EMAIL=your-business@example.com
```

---

## 🆘 Troubleshooting

### **Common Issues:**

**Webhook returns 400 error:**
- Check webhook secret matches Stripe Dashboard
- Redeploy after updating environment variables

**Webhook returns 500 error:**
- Check application logs
- Verify all environment variables are set

**No emails sent:**
- Check webhook deliveries in Stripe Dashboard
- Verify RESEND_API_KEY is valid
- Check Resend dashboard

**Payment succeeds but no confirmation:**
- Check webhook delivery in Stripe
- Verify webhook secret is correct
- Check application logs

---

## 📞 Support Resources

**Stripe:**
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com
- API Reference: https://stripe.com/docs/api

**Your Application:**
- Main Guide: `STRIPE_COMPLETE_SETUP_GUIDE.md`
- Quick Start: `QUICK_START_CHECKLIST.md`
- Environment Template: `.env.example`

---

## ✅ Setup Checklist

- [ ] Read `QUICK_START_CHECKLIST.md`
- [ ] Set up test mode
- [ ] Test with test card
- [ ] Verify emails work
- [ ] Set up live mode
- [ ] Test with real payment
- [ ] Monitor for 24 hours

---

## 🎯 Next Steps

1. **Open:** `QUICK_START_CHECKLIST.md`
2. **Follow:** Each step with checkboxes
3. **Test:** In test mode first
4. **Deploy:** To live mode when ready
5. **Monitor:** For 24 hours

---

## 📝 Notes

- Always test in **test mode** before going live
- Test and live webhook secrets are **different**
- Redeploy after updating environment variables
- Monitor webhook deliveries in Stripe Dashboard
- Keep API keys secure (never commit to Git)

---

**Your code is ready! Just follow the setup guides.** 🚀

**Questions?** Check the detailed guide or Stripe documentation.
