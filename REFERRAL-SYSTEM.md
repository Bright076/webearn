# Referral Attribution System

## Overview
Complete end-to-end referral tracking system with secure first-touch attribution, httpOnly cookies, and idempotent commission creation.

## How It Works

### 1. Referral Link Generation
Affiliates get product-specific referral links:
```
https://yourdomain.com/api/referral?product={product_slug}&ref={affiliate_code}
```

### 2. First-Touch Attribution Flow

**Step 1: Click Capture** (`/api/referral`)
- User clicks affiliate's referral link
- Server validates `product` slug and `ref` (affiliate code)
- Logs click to `referral_clicks` table (with hashed IP)
- **Checks for existing cookie** - if valid cookie exists, does NOT overwrite (first-touch)
- Sets `webearn_ref` httpOnly cookie (30-day expiry)
- Redirects to `/get-a-website`

**Step 2: Form Submission** (`/get-a-website`)
- User fills out inquiry form
- Form has NO hidden fields for attribution
- Form submits to `/api/requests`

**Step 3: Attribution** (`/api/requests`)
- Server reads `webearn_ref` cookie (SERVER-SIDE ONLY)
- Decodes affiliate_id and product_id
- Creates `client_requests` record with attribution
- **Ignores any client-submitted affiliate data** (security)
- Clears cookie after successful submission

### 3. Commission Creation (Idempotent)
When admin marks request as 'paid':
- Check if commission already exists for this `client_request_id`
- If exists: no-op or show "already exists"
- If not: create commission record
- Enforced by `UNIQUE` constraint on `client_request_id`

## Security Features

### httpOnly Cookie
- ✅ Cannot be read via JavaScript
- ✅ Cannot be modified by client
- ✅ Not visible in DOM/devtools Application tab content
- ✅ Prevents XSS attacks

### Signed Payload
- Cookie payload is signed with HMAC-SHA256
- Tampering detection - invalid signature = rejected
- Secret key stored in environment variable

### First-Touch Attribution
- Once set, cookie CANNOT be overwritten by different referral
- Protects affiliate commission from being stolen
- 30-day attribution window

### Server-Side Only
- Attribution data NEVER exposed to client
- Form submission ignores client-submitted affiliate data
- Only server-verified cookie is trusted

## Database Tables

```sql
-- Run: webearn/supabase-referral-tables.sql

referral_clicks      - All affiliate link clicks
client_requests      - Website inquiry submissions
commissions          - Affiliate earnings
withdrawals          - Payout requests
```

## API Routes

### GET `/api/referral?product={slug}&ref={code}`
Captures referral attribution and redirects to form.

### POST `/api/requests`
Submits inquiry form with server-side attribution.

## Testing

1. **Run SQL migration:**
   ```bash
   # In Supabase Dashboard → SQL Editor
   # Run: webearn/supabase-referral-tables.sql
   ```

2. **Add secret to `.env.local`:**
   ```
   REFERRAL_COOKIE_SECRET=your-secure-random-string
   ```

3. **Test flow:**
   - Sign up as affiliate
   - Get referral link from marketplace
   - Open link in incognito window
   - Fill form and submit
   - Check `client_requests` table for attribution

4. **Test first-touch:**
   - Click Affiliate A's link
   - Click Affiliate B's link (same browser)
   - Submit form
   - Should be attributed to Affiliate A (first touch)

## Important Files

- `src/lib/referral.ts` - Cookie encoding/decoding utilities
- `src/app/api/referral/route.ts` - Click capture endpoint
- `src/app/api/requests/route.ts` - Form submission handler
- `src/app/(public)/get-a-website/page.tsx` - Inquiry form
- `src/components/marketplace/PromoteButton.tsx` - Link generator

## Environment Variables

```env
REFERRAL_COOKIE_SECRET=generate-with-openssl-rand-hex-32
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Production Checklist

- [ ] Generate secure `REFERRAL_COOKIE_SECRET`
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Run referral tables SQL migration
- [ ] Test full flow in production
- [ ] Verify httpOnly cookie in browser devtools
- [ ] Test first-touch attribution
- [ ] Test idempotent commission creation
