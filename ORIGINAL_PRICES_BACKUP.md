# 💰 Original Production Prices - BACKUP

**Date Saved:** November 25, 2025  
**Currency:** CAD (Canadian Dollars)  
**Purpose:** Backup before changing to INR test prices

---

## 🔐 Original Prices (DO NOT DELETE)

These are your **production prices** in CAD. Restore these after testing.

### **Service Pricing (CAD)**

```javascript
const services = {
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

### **Currency Setting**

```javascript
currency: 'cad'
```

**File Location:** `app/api/stripe/checkout/route.ts`  
**Lines:** 58-68 (services), 115 (currency)

---

## 🔄 How to Restore Original Prices

After testing with INR prices, restore these values:

### **Step 1: Update Service Prices**

In `app/api/stripe/checkout/route.ts`, lines 58-68:

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

### **Step 2: Update Currency**

In `app/api/stripe/checkout/route.ts`, line 115:

```javascript
currency: 'cad',
```

### **Step 3: Commit and Deploy**

```bash
git add app/api/stripe/checkout/route.ts
git commit -m "Restore original CAD prices"
git push
```

---

## ⚠️ IMPORTANT NOTES

1. **DO NOT DELETE THIS FILE** - You need it to restore prices
2. **Test prices are temporary** - Only for testing live mode
3. **Restore before going live** - Use original CAD prices for production
4. **Currency matters** - Make sure to change both prices AND currency

---

## 📊 Price Comparison

| Service | Original (CAD) | Test (INR) |
|---------|----------------|------------|
| MLS Package | $250 | ₹20 |
| MLS + Social Package | $475 | ₹20 |
| MLS + SC Prime Package | $675 | ₹20 |
| HDR Photos | $250 | ₹20 |
| 3D Tour & RMS | $100 | ₹20 |
| Essential Video | $300 | ₹20 |
| SC Prime Reel | $500 | ₹20 |
| Possession Video | $300 | ₹20 |
| Drone Photos | $100 | ₹20 |

---

## ✅ Restoration Checklist

When ready to restore:

- [ ] Open `app/api/stripe/checkout/route.ts`
- [ ] Copy service prices from this file (lines 14-24 above)
- [ ] Paste into checkout route (lines 58-68)
- [ ] Change currency from 'inr' to 'cad' (line 115)
- [ ] Commit changes
- [ ] Deploy to production
- [ ] Test with real card to verify
- [ ] Delete test prices

---

**Saved:** November 25, 2025  
**Status:** Original prices backed up ✅  
**Next:** Apply test prices for INR testing
