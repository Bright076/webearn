# 🚨 CRITICAL ISSUE FOUND

## The Problem

Clients are showing "No Referral" in admin dashboard and leads aren't appearing for affiliates.

This means **the cookie is NOT being read on the server side**.

---

## Most Likely Cause

**The `REFERRAL_COOKIE_SECRET` environment variable is NOT set in Vercel!**

It's set in your local `.env.local` file, but environment variables are NOT automatically pushed to Vercel. You have to set them manually in Vercel dashboard.

---

## 🔧 FIX IT NOW (5 minutes)

### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Select your project
3. Click **"Settings"** at the top
4. Click **"Environment Variables"** in the left sidebar

### Step 2: Add the Missing Variable

Click **"Add New"** and enter:

**Key (Name):**
```
REFERRAL_COOKIE_SECRET
```

**Value:**
```
a7f8e2d4b9c1f6e3d8a2c5b7e9f1d3a6c8e2f5b7d9a1c4e6f8b2d5a7c9e1f3b6
```

**Environment:** Select **ALL** (Production, Preview, Development)

Click **"Save"**

### Step 3: Redeploy

After saving, Vercel will ask you to redeploy. Click **"Redeploy"** button.

Or go to **Deployments** tab, click the three dots (...) on the latest deployment, and click **"Redeploy"**.

---

## ✅ How to Verify It's Fixed

### Test 1: Check Environment Variables

After deployment finishes:

1. Go to: `https://your-site.com/api/debug-env`
2. You should see:
```json
{
  "hasCookieSecret": true,
  "cookieSecretLength": 64
}
```

If `hasCookieSecret` is `false` → the variable isn't set correctly!

### Test 2: Test Referral Link

1. Sign in as affiliate
2. Go to Dashboard → Marketplace
3. Click "Promote" on any product
4. Copy referral link
5. **Open in INCOGNITO window**
6. Click the link
7. Fill out the form and submit

### Test 3: Check Admin Dashboard

1. Sign in as admin
2. Go to Admin → Client Requests
3. Find the test request
4. **"Affiliate" column should show the affiliate code!**

### Test 4: Check Affiliate Leads

1. Sign in as the affiliate
2. Go to Dashboard → Leads
3. **The test request should appear here!**

---

## 🎯 Why This Happens

When you push code to GitHub:
- ✅ Code is pushed
- ✅ Vercel auto-deploys
- ❌ Environment variables are NOT copied

You have to manually add environment variables in Vercel dashboard!

---

## 📋 Environment Variables Checklist

Make sure ALL these are set in Vercel:

- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `REFERRAL_COOKIE_SECRET` ← **THIS IS MISSING!**
- [x] `NEXT_PUBLIC_APP_URL`

---

## 🔍 If It Still Doesn't Work After Adding the Variable

1. **Check the debug endpoint:**
   - Visit: `https://your-site.com/api/debug-env`
   - Verify `hasCookieSecret: true`

2. **Check Vercel Logs:**
   - After adding the variable and redeploying
   - Click a referral link
   - Check logs - should now show "Cookie set successfully!"
   - Submit form
   - Check logs - should now show "Cookie found!" and "Affiliate ID: xxx"

3. **Test in incognito:**
   - Always test referral links in incognito mode
   - This prevents cookie conflicts from previous tests

---

## ⚡ Quick Commands to Test

After fixing and redeploying, run these in Supabase SQL Editor:

```sql
-- Check if any new requests have affiliate_id
SELECT 
  id,
  full_name,
  affiliate_id,
  product_id,
  created_at
FROM client_requests 
ORDER BY created_at DESC 
LIMIT 5;
```

If `affiliate_id` is still NULL after:
1. Adding `REFERRAL_COOKIE_SECRET` to Vercel
2. Redeploying
3. Testing with a referral link in incognito

Then we have a different issue and I'll need to see the Vercel logs!

---

## 🚀 Next Steps

1. ✅ Add `REFERRAL_COOKIE_SECRET` to Vercel (do this NOW!)
2. ✅ Redeploy your Vercel project
3. ✅ Wait for deployment to finish (1-2 minutes)
4. ✅ Visit `/api/debug-env` to verify
5. ✅ Test with referral link in incognito
6. ✅ Check if affiliate shows in admin dashboard

**Let me know after you've added the environment variable and I'll help verify it's working!** 🔍
