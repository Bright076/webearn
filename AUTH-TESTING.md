# Testing Authentication Flow

## Current Issue
After signup, users need to verify their email before they can sign in. This is controlled by Supabase settings.

## How to Test

### Option 1: Disable Email Confirmation (For Testing)
1. Go to Supabase Dashboard
2. Authentication → Providers → Email
3. Find "Confirm email" setting
4. Toggle it OFF
5. Now signups will work without email confirmation

### Option 2: Keep Email Confirmation (Production-Ready)
The current flow is:
1. User signs up → Gets message "Check your email to confirm your account"
2. User clicks confirmation link in email → Email verified
3. User signs in → Redirected to dashboard

## Testing Sign In After Signup

Since you already registered in Supabase:

1. Check if your email is verified:
   - Go to Supabase Dashboard → Authentication → Users
   - Find your user
   - Check if "Email Confirmed At" has a value

2. If NOT verified:
   - Option A: In Supabase, click the user → Click "Send magic link" or manually set "Email Confirmed At" to current time
   - Option B: Disable email confirmation (see Option 1 above)

3. Try signing in again with your credentials

## Expected Behavior After Sign In

✅ **For Affiliate Users:**
- Redirects to `/dashboard`
- Shows dashboard with stats, recent activity, referral link

✅ **For Admin Users:**
- Redirects to `/admin`
- Shows admin panel

## If Sign In Still Doesn't Redirect

Check browser console for errors:
1. Right-click → Inspect → Console tab
2. Sign in
3. Look for any error messages
4. Share them with me if issues persist

## Manual Verification

Run this SQL in Supabase to check your user data:

```sql
-- Check if user has a role
SELECT u.email, ur.role, p.full_name, p.affiliate_code
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'YOUR_EMAIL_HERE';
```

Replace `YOUR_EMAIL_HERE` with your actual email.

Expected result:
- role: 'affiliate'
- full_name: Your name
- affiliate_code: 8-character code

## To Make Yourself Admin

```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE');
```
