# Check Admin Role Setup

## Step 1: Verify Your User ID
Go to Supabase Dashboard → Authentication → Users
Find your user and copy the UUID (user ID)

## Step 2: Check user_roles Table
Run this query in Supabase SQL Editor:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID';
```

**Expected Result:**
- You should see a row with `role = 'admin'`
- If the row doesn't exist or role is not 'admin', run:

```sql
-- If row doesn't exist, insert:
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
```

## Step 3: Clear Browser Cache & Sign Out
1. Sign out of the application
2. Clear browser cache (Ctrl+Shift+Delete)
3. Close all browser tabs
4. Open a new tab and sign in again

## Step 4: Check Console for Errors
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any errors when loading /dashboard or /admin
4. Share any errors you see

## Step 5: Test Direct Admin URL
After signing in, manually go to: `http://localhost:3000/admin`

What happens?
- [ ] Redirects to /dashboard (role check failing)
- [ ] Shows admin dashboard (working!)
- [ ] Shows error (middleware issue)

## Step 6: Verify Middleware is Running
Check your terminal where `npm run dev` is running.
Look for any error messages about the middleware.

## Quick Debug: Add Console Logs
If still not working, let me add debug logs to see what's happening.
