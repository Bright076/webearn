# 🔍 TELL ME THESE THINGS

I need this information to fix your problem!

---

## 1. What URL did you deploy to?

What's your Vercel URL?

Example: `https://webearn.vercel.app` or `https://yoursite.com`

**Your URL:** _________________________

---

## 2. What does `/api/debug-env` show?

After deployment finishes, go to:
```
https://YOUR-SITE.com/api/debug-env
```

Copy and paste the ENTIRE response here:

```json
(paste response here)
```

---

## 3. What does `/api/test-referral` show?

Go to:
```
https://YOUR-SITE.com/api/test-referral
```

Copy and paste the ENTIRE response here:

```json
(paste response here)
```

---

## 4. Did you run the SQL fix?

In Supabase SQL Editor, run:

```sql
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'client_requests'::regclass 
AND conname = 'client_requests_status_check';
```

**What does it show?**

```
(paste result here)
```

**If it shows something OTHER than:**
```
CHECK (status IN ('pending', 'contacted', 'negotiating', 'paid', 'in_progress', 'delivered', 'cancelled', 'refunded'))
```

Then run the entire `FIX-CLIENT-REQUESTS-STATUS.sql` file NOW!

---

## 5. Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables

**Do you see these variables?**

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` ← What's the value? ______________
- [ ] `REFERRAL_COOKIE_SECRET` ← Is it set? YES / NO

---

## 6. Vercel Logs

In Vercel Dashboard → Logs

1. Click a referral link in incognito
2. Look at the logs

**Do you see logs that say:**
```
=== API /api/referral CALLED ===
```

YES / NO

If YES, what does it show? (screenshot or copy the logs)

---

## 7. Test Submission

In incognito window:
1. Click a referral link
2. Fill out the form
3. Submit

**Does it say "Request Received!"?**

YES / NO

If NO, what error do you see?

---

## 8. Check Database

In Supabase → Table Editor → `client_requests` table

**Look at the most recent request:**
- Does `affiliate_id` have a value (UUID) or is it NULL?
- Does `product_id` have a value (UUID) or is it NULL?
- What's the `status` value?

**Answer:**
```
affiliate_id: ______________
product_id: ______________
status: ______________
```

---

## 📋 QUICK CHECKLIST

Before you answer the questions above, make sure:

- [ ] Added ALL environment variables to Vercel (including `REFERRAL_COOKIE_SECRET`)
- [ ] Set `NEXT_PUBLIC_APP_URL` to your DEPLOYED URL (not localhost!)
- [ ] Clicked "Redeploy" in Vercel after adding variables
- [ ] Waited for deployment to finish (shows "Ready")
- [ ] Ran `FIX-CLIENT-REQUESTS-STATUS.sql` in Supabase
- [ ] Testing on DEPLOYED site (not localhost!)
- [ ] Testing in INCOGNITO mode

---

**Answer questions 1-8 above and I'll know exactly what's wrong!** 🔍
