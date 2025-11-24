# 🧪 INR Test Prices - Quick Guide

**Status:** ✅ Test prices applied (₹20 INR)  
**Date:** November 25, 2025  
**Purpose:** Test live mode with small amounts

---

## ✅ What Changed

### **Prices Changed:**
All services now cost **₹20 INR** (instead of CAD prices)

```
MLS Package: ₹20 (was $250 CAD)
MLS + Social Package: ₹20 (was $475 CAD)
MLS + SC Prime Package: ₹20 (was $675 CAD)
HDR Photos: ₹20 (was $250 CAD)
3D Tour & RMS: ₹20 (was $100 CAD)
Essential Video: ₹20 (was $300 CAD)
SC Prime Reel: ₹20 (was $500 CAD)
Possession Video: ₹20 (was $300 CAD)
Drone Photos: ₹20 (was $100 CAD)
```

### **Currency Changed:**
- **From:** `currency: 'cad'`
- **To:** `currency: 'inr'`

### **File Modified:**
`app/api/stripe/checkout/route.ts`

---

## 🧪 How to Test Live Mode

### **Step 1: Deploy Changes**

```bash
git add app/api/stripe/checkout/route.ts
git commit -m "Temporary: Set prices to ₹20 INR for live mode testing"
git push
```

### **Step 2: Make Test Payment**

1. Go to: https://www.sneekcreatemedia.com/booking
2. Fill out form
3. Select any service
4. Use **REAL Indian card** (you'll be charged ₹20)
5. Complete payment

### **Step 3: Verify**

- ✅ Payment succeeds
- ✅ Charged ₹20 INR (not CAD)
- ✅ Emails received
- ✅ Webhook fires
- ✅ Everything works

---

## 🔄 How to Restore Original Prices

**⚠️ IMPORTANT: Restore prices before going live with real customers!**

### **Option 1: Manual Restore (Recommended)**

1. **Open:** `ORIGINAL_PRICES_BACKUP.md`
2. **Copy** the service prices code (lines 14-24)
3. **Open:** `app/api/stripe/checkout/route.ts`
4. **Replace** lines 60-70 with the copied code
5. **Change** line 119 from `currency: 'inr'` to `currency: 'cad'`
6. **Save** the file

### **Option 2: Use Backup File**

The original prices are saved in: `ORIGINAL_PRICES_BACKUP.md`

**Services (CAD):**
```javascript
const services: Record<string, { name: string; price: number }> = {
  "mls-package": { name: "MLS Package", price: 250 },
  "mls-social-package": { name: "MLS + Social Package", price: 475 },
  "mls-sc-prime-package": { name: "MLS + SC Prime Package", price: 675 },
  hdr: { name: "HDR Photos", price: 250 },
  "3d-tour-rms": { name: "3D Tour & RMS", price: 100 },
  "essential-video": { name: "Essential Video", price: 300 },
  "sc-prime-reel": { name: "SC Prime Reel", price: 500 },
  "possession-video": { name: "Possession Video", price: 300 },
  drone: { name: "Drone Photos", price: 100 },
};
```

**Currency:**
```javascript
currency: 'cad',
```

### **Step 3: Deploy Restored Prices**

```bash
git add app/api/stripe/checkout/route.ts
git commit -m "Restore original CAD prices"
git push
```

---

## ⚠️ IMPORTANT REMINDERS

### **Before Going Live:**
- [ ] Restore original CAD prices
- [ ] Change currency back to 'cad'
- [ ] Test with real card (small CAD amount)
- [ ] Verify prices are correct
- [ ] Deploy to production

### **Don't Forget:**
- ✅ Original prices backed up in `ORIGINAL_PRICES_BACKUP.md`
- ✅ Current prices are ₹20 INR (temporary)
- ✅ Must restore before real customers use site
- ✅ Test mode and live mode use same prices

---

## 📊 Quick Reference

### **Current State:**
```
Currency: INR (Indian Rupees)
All Prices: ₹20
Purpose: Testing live mode
Status: Temporary
```

### **Production State:**
```
Currency: CAD (Canadian Dollars)
Prices: $100 - $675 CAD
Purpose: Real customers
Status: Saved in backup file
```

---

## ✅ Testing Checklist

- [ ] Deployed INR test prices
- [ ] Made test payment with real card
- [ ] Verified charge was ₹20 INR
- [ ] Received confirmation emails
- [ ] Webhook delivered successfully
- [ ] Ready to restore original prices

---

## 🔄 Restoration Checklist

- [ ] Opened `ORIGINAL_PRICES_BACKUP.md`
- [ ] Copied original service prices
- [ ] Pasted into `checkout/route.ts`
- [ ] Changed currency to 'cad'
- [ ] Committed changes
- [ ] Deployed to production
- [ ] Tested with real CAD payment
- [ ] Verified prices are correct

---

## 📞 Quick Commands

**Deploy test prices:**
```bash
git add app/api/stripe/checkout/route.ts
git commit -m "Temporary: ₹20 INR test prices"
git push
```

**Restore original prices:**
```bash
# After manually updating the file
git add app/api/stripe/checkout/route.ts
git commit -m "Restore original CAD prices"
git push
```

---

## 💡 Pro Tips

1. **Test quickly** - Don't leave test prices deployed for long
2. **Restore immediately** - After testing, restore original prices
3. **Double check** - Verify currency and prices before going live
4. **Keep backup** - Don't delete `ORIGINAL_PRICES_BACKUP.md`

---

**Current Status:** ✅ Test prices applied (₹20 INR)  
**Next Step:** Test live mode, then restore original prices  
**Backup File:** `ORIGINAL_PRICES_BACKUP.md`

---

**⚠️ REMEMBER: These are temporary test prices. Restore CAD prices before real customers use the site!**
