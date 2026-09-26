# Referral Tracking Debugging Guide

## ❌ Referrals Not Working? Follow These Steps EXACTLY

### Step 1: Run the SQL Fix (CRITICAL!)

**Open Supabase Dashboard → SQL Editor → New Query**

Paste and run this:

```sql
-- Check current constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'client_requests'::regclass 
AND conname LIKE '%status%';

-- Drop old constraint
ALTER TABLE client_requests DROP CONSTRAINT IF EXISTS client_requests_status_check;

-- Add correct constraint
ALTER TABLE client_requests 
ADD CONSTRAINT client_requests_status_check 
CHECK (status IN ('pending', 'contacted', 'in_progress', 'paid', 'cancelled', 'refunded'));
```

**Without this SQL, NOTHING will work!**

---

### Step 2: Test the Form (Without Referral First)

1. Go to `/get-a-website` directly (no referral link)
2. Fill out the form
3. Submit
4. **Open Browser Console (F12)** - Check for errors
5. If you see "Failed to submit request" → The SQL wasn't run properly
6. If you see "Success" → Form is working, SQL is correct

---

### Step 3: Test Referral Tracking

#### A. Generate Referral Link
1. Sign in as affiliate
2. Go to Dashboard → Marketplace
3. Click "Promote" on any product
4. Copy the referral link
5. **Expected format:** `https://yoursite.com/api/referral?product=SLUG&ref=CODE`

#### B. Use Referral Link
1. **IMPORTANT:** Open link in **Incognito/Private browser**
2. You should be redirected to `/get-a-website`
3. **Open Browser Console (F12)**
4. Go to **Application Tab → Cookies**
5. Look for cookie named `webearn_ref`
6. **If cookie exists:** Referral tracking is working
7. **If no cookie:** Referral tracking failed

#### C. Submit Form
1. Fill out the form completely
2. Submit
3. Check console for errors
4. If success, go to Admin → Client Requests
5. Look for the new request
6. Check if `Affiliate` column shows the affiliate code
7. **If shows "Direct":** Cookie wasn't read correctly
8. **If shows affiliate code:** Referral tracking SUCCESS! ✅

---

### Step 4: Check Database Directly

**In Supabase Table Editor:**

1. Open `client_requests` table
2. Find your test request
3. Check `affiliate_id` column
4. **If NULL:** Referral cookie wasn't read
5. **If has UUID:** Referral was tracked! ✅

---

## 🔍 Common Issues & Solutions

### Issue 1: "Failed to submit request"
**Cause:** SQL constraint not fixed
**Solution:** Run the SQL fix from Step 1

### Issue 2: Cookie not being set
**Possible causes:**
- Using same browser (not incognito)
- Ad blocker blocking cookies
- Browser privacy settings blocking cookies
**Solution:** 
- Use incognito mode
- Disable ad blockers
- Check browser cookie settings

### Issue 3: Cookie set but not read
**Possible causes:**
- Cookie domain mismatch
- Cookie expired (30 day limit)
**Solution:**
- Check cookie in DevTools
- Verify cookie `path` is `/`
- Verify cookie isn't expired

### Issue 4: Form works but shows "Direct" instead of affiliate
**Cause:** Cookie is not being read server-side
**Solution:**
- Check server logs in Vercel
- Verify API route is reading cookies correctly
- Check if you're using correct cookie name

---

## 🧪 Manual Testing Checklist

- [ ] Ran SQL fix for client_requests status constraint
- [ ] Form submits successfully without referral
- [ ] Affiliate can generate referral link
- [ ] Referral link redirects to get-a-website page
- [ ] Cookie `webearn_ref` is set in browser
- [ ] Form submits successfully with referral cookie
- [ ] Request appears in Admin → Client Requests
- [ ] Request shows affiliate code (not "Direct")
- [ ] Request has affiliate_id in database
- [ ] Changing request to "Paid" creates commission
- [ ] Commission appears in Admin → Commissions
- [ ] Commission shows in affiliate's Earnings page

---

## 📊 What Data Should Be There

### In `client_requests` table:
```
id: UUID
full_name: "John Doe"
whatsapp_number: "+1234567890"
email: "john@example.com"
affiliate_id: UUID (of affiliate) ← THIS SHOULD NOT BE NULL
product_id: UUID (of product) ← THIS SHOULD NOT BE NULL
status: "pending"
created_at: timestamp
```

### In `referral_clicks` table:
```
id: UUID
affiliate_id: UUID
product_id: UUID
ip_hash: hashed IP
user_agent: browser info
created_at: timestamp
```

---

## 🚨 Still Not Working?

### Check These:

1. **Vercel Logs:**
   - Go to Vercel Dashboard
   - Click on your project
   - Go to "Functions" or "Logs"
   - Look for errors from `/api/requests`

2. **Browser Console:**
   - F12 → Console tab
   - Look for network errors
   - Check if form submission returns 500 or 400 error

3. **Supabase Logs:**
   - Go to Supabase Dashboard
   - Click "Logs" in sidebar
   - Look for database errors
   - Check for constraint violations

4. **Cookie Issues:**
   - F12 → Application → Cookies
   - Check if `webearn_ref` cookie exists
   - Check cookie value is not empty
   - Check cookie hasn't expired

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Form submits without errors
2. ✅ Cookie `webearn_ref` appears in browser
3. ✅ Request shows affiliate code in admin panel
4. ✅ Database `affiliate_id` is not NULL
5. ✅ Referral click is logged in `referral_clicks` table
6. ✅ Commission auto-creates when status changes to "paid"

---

## 💡 Pro Tips

1. **Always use incognito** when testing referral links
2. **Check console** before and after every action
3. **Verify database** directly in Supabase
4. **Test the form without referral first** to isolate issues
5. **One change at a time** - don't test multiple things together

---

## 🔧 Quick Test Commands

Run these in Supabase SQL Editor to check status:

```sql
-- Check if form submissions are working
SELECT COUNT(*) FROM client_requests;

-- Check if any have affiliate_id
SELECT COUNT(*) FROM client_requests WHERE affiliate_id IS NOT NULL;

-- Check recent referral clicks
SELECT * FROM referral_clicks ORDER BY created_at DESC LIMIT 10;

-- Check if constraint is correct
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'client_requests'::regclass 
AND conname = 'client_requests_status_check';
```

Expected result for last query:
```
status IN ('pending', 'contacted', 'in_progress', 'paid', 'cancelled', 'refunded')
```

If it shows anything different → SQL fix wasn't applied!
