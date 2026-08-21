# Currency Update: Naira (₦) → Dollar ($)

## Summary
Updating all currency displays from Nigerian Naira (₦) to US Dollar ($) and adjusting minimum withdrawal from ₦5,000 to $50.

## ✅ Completed Files

### 1. `/src/app/(affiliate)/dashboard/page.tsx`
- ✅ All stat cards updated to $
- ✅ Minimum withdrawal threshold: 5000 → 50
- ✅ "Min. ₦5,000 to withdraw" → "Min. $50 to withdraw"

### 2. `/src/app/(affiliate)/dashboard/marketplace/page.tsx`
- ✅ formatCommission function updated to $
- ✅ All product price displays updated to $

### 3. `/src/app/(affiliate)/dashboard/withdrawals/page.tsx`
- ✅ Validation schema: 5000 → 50, "$50" message
- ✅ Available balance display updated
- ✅ Withdrawal amount display in table updated to $
- ✅ Error message updated to $
- ⚠️ **Still needs**: Button disabled condition and empty state message

## ⚠️ Files Still Needing Updates

### Admin Dashboard
1. **`/src/app/(admin)/admin/products/ProductsTable.tsx`**
   - Price display: `₦{product.price.toLocaleString()}` → `${product.price.toLocaleString()}`
   - Commission display: `₦${product.commission_value.toLocaleString()}` → `$${product.commission_value.toLocaleString()}`
   - Price label: "Price (₦) *" → "Price ($) *"
   - Placeholders: "50000", "15000 or 30"

2. **`/src/app/(admin)/admin/page.tsx`**
   - Total Revenue: "₦0" → "$0"

### Affiliate Dashboard (remaining)
3. **`/src/app/(affiliate)/dashboard/earnings/page.tsx`**
   - All ₦ symbols → $

4. **`/src/app/(affiliate)/dashboard/leads/page.tsx`**
   - If any currency displays

### Public Pages
5. **`/src/app/page.tsx` (Homepage)**
   - Sample services prices (Landing Page, Business Website, E-Commerce)
   - Sample templates prices
   - Testimonial: "over ₦500,000" → "over $5,000"
   - FAQ minimum withdrawal: "₦50,000" → "$500" or "$50"

6. **`/src/app/marketplace/page.tsx`**
   - formatCommission function
   - Product price displays

7. **`/src/app/(public)/get-a-website/page.tsx`**
   - Budget options dropdown

8. **`/src/app/(auth)/sign-up/page.tsx`**
   - "up to ₦360,000 per sale" → "up to $3,600 per sale" (or appropriate amount)
   - "minimum of ₦5,000" → "minimum of $50"
   - "Fast payouts (minimum ₦5,000)" → "Fast payouts (minimum $50)"

## Pricing Conversion Guidance

Since you're converting from Naira to Dollars, you'll need to decide on appropriate pricing:

### Option 1: Direct Market Pricing
Set prices based on US market rates (typical US web development costs)

### Option 2: Conversion with Adjustment
Use approximate exchange rate (₦1,500 = $1) then round to nice numbers

### Examples:
- ₦150,000 → $100-150 (Landing Page)
- ₦350,000 → $300-500 (Business Website)  
- ₦750,000 → $750-1,000 (E-Commerce)
- ₦5,000 min withdrawal → $50 (already updated)

## Search & Replace Patterns

To complete manually:
1. Search for `₦` and replace with `$`
2. Search for `5,?000` and evaluate context (likely change to `50`)
3. Update price amounts in homepage examples
4. Update budget ranges in contact form

## Testing Checklist
After updates:
- [ ] Homepage displays correct sample prices
- [ ] Marketplace shows products with $ prices
- [ ] Affiliate dashboard shows earnings in $
- [ ] Withdrawal minimum is $50 throughout
- [ ] Admin products page uses $ for pricing
- [ ] Sign-up page mentions correct amounts
- [ ] All currency displays are consistent

