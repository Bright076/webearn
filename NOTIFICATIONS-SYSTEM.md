# Notifications System - Complete Guide

## 🎉 What's New

A complete real-time notification system has been added to WebEarn! Affiliates now get instant notifications when important events happen, and admins can send announcements to all or specific affiliates.

---

## ⚡ Features Implemented

### 1. **Automatic Notifications for Affiliates**
Affiliates automatically receive notifications when:
- ✅ **New Lead Generated** - When someone uses their referral link and submits a request
- ✅ **Commission Approved** - When admin approves their commission
- ✅ **Withdrawal Approved** - When admin approves their withdrawal request
- ✅ **Withdrawal Paid** - When admin marks withdrawal as paid
- ✅ **Withdrawal Rejected** - When admin rejects withdrawal (includes reason)

### 2. **Notification Bell Component**
- 🔔 Bell icon in the top-right corner of affiliate dashboard
- Red badge showing unread count
- Click to open notification panel
- Real-time updates (no page refresh needed)
- Mark individual notifications as read
- Mark all as read with one click
- Delete notifications
- Click "View →" to go to relevant page
- Color-coded by type (success=green, error=red, info=blue, warning=yellow)

### 3. **Admin Send Notifications Page**
Located at `/admin/notifications`:
- Send to all affiliates or select specific ones
- Choose notification type (info, success, warning, error)
- Add title and message
- Optional link to direct affiliates to specific page
- Live preview before sending
- Bulk sending capability

---

## 📋 CRITICAL: Run This SQL First!

Before the notification system will work, you **MUST** run this SQL in your Supabase SQL Editor:

### Step 1: Run Notifications Setup
Go to Supabase → SQL Editor → New Query → Paste this:

```sql
-- File: SETUP-NOTIFICATIONS.sql
-- This creates the notifications table and triggers
```

Copy the entire content from `webearn/SETUP-NOTIFICATIONS.sql` and run it.

### Step 2: ALSO Run the Client Requests Fix (if you haven't already)
```sql
-- File: FIX-CLIENT-REQUESTS-STATUS.sql
ALTER TABLE client_requests DROP CONSTRAINT IF EXISTS client_requests_status_check;
ALTER TABLE client_requests 
ADD CONSTRAINT client_requests_status_check 
CHECK (status IN ('pending', 'contacted', 'in_progress', 'paid', 'cancelled', 'refunded'));
```

**Without these SQL updates, the system will not work!**

---

## 🔍 How to Test the Notifications System

### Test 1: New Lead Notification
1. Sign in as affiliate
2. Go to Dashboard → Marketplace
3. Click "Promote" on a product
4. Copy the referral link
5. **Open link in incognito window** (or different browser)
6. Fill out the "Get a Website" form
7. Submit the form
8. Go back to your affiliate dashboard
9. **Look at the bell icon** - it should show "1" unread
10. Click the bell - you should see "New Lead Generated! 🎉"

### Test 2: Commission Approved Notification
1. Sign in as admin
2. Go to Admin → Client Requests
3. Find the request you just created
4. Change status to "Paid" (this auto-creates commission)
5. Go to Admin → Commissions
6. Click "Approve" on the commission
7. **Sign in as affiliate** (or refresh if already signed in)
8. Bell should show notification "Commission Approved! 💰"

### Test 3: Admin Send Notification
1. Sign in as admin
2. Go to Admin → Send Notifications
3. Select "All Affiliates"
4. Choose type "Success"
5. Title: "Welcome to WebEarn!"
6. Message: "Thank you for joining our affiliate program"
7. Link: /dashboard/marketplace
8. Click "Send Notification"
9. **Sign in as affiliate**
10. Bell should show the custom notification

---

## 🎨 Notification Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| **Info** | Blue | Announcements, updates |
| **Success** | Green | Good news, approvals, completions |
| **Warning** | Yellow | Important notices, reminders |
| **Error** | Red | Rejections, errors, urgent issues |

---

## 📱 Where Notifications Appear

### For Affiliates:
- **Desktop**: Top-right corner of dashboard header
- **Mobile**: Top-right of mobile header (next to hamburger menu)
- **Badge**: Shows unread count (e.g., "3")
- **Real-time**: Updates instantly when new notification arrives

### For Admins:
- Send page at `/admin/notifications`
- No notification bell for admins (they send, not receive)

---

## 🔔 Notification Triggers (Automatic)

### Database Triggers Created:
1. **notify_affiliate_on_lead()** - Triggers when `client_requests` is inserted
2. **notify_affiliate_on_commission()** - Triggers when `commissions` status changes
3. **notify_affiliate_on_withdrawal()** - Triggers when `withdrawals` status changes

These run automatically on the database level, no API calls needed!

---

## 💡 How to Use as Admin

### Send Announcement to All Affiliates:
1. Go to `/admin/notifications`
2. Select "All Affiliates"
3. Choose appropriate type (usually "info" or "success")
4. Write your message
5. Add link if needed (e.g., `/dashboard/marketplace` for new product launch)
6. Preview looks good? Click "Send Notification"

### Send to Specific Affiliates:
1. Select "Specific Affiliates"
2. Checkbox list appears
3. Check the affiliates you want to notify
4. Fill out notification details
5. Send!

### Example Notifications to Send:

**New Product Launch:**
- Type: Success
- Title: "New Product Available! 🚀"
- Message: "We just added [Product Name] to the marketplace. Check it out and start promoting!"
- Link: /dashboard/marketplace

**Commission Increase:**
- Type: Success  
- Title: "Commission Rates Increased!"
- Message: "Great news! We've increased commission rates on all products. Happy promoting!"
- Link: /dashboard/marketplace

**Important Update:**
- Type: Warning
- Title: "Action Required: Update Bank Details"
- Message: "Please update your bank account information by [date] to avoid payment delays."
- Link: /dashboard/profile

---

## 🐛 Troubleshooting

### "No notifications showing up"
1. **Did you run the SQL?** Check `SETUP-NOTIFICATIONS.sql` was executed
2. **Check browser console** for errors
3. **Verify Supabase RLS** - notifications table should have proper policies
4. **Test with admin send** - easier to debug than automatic triggers

### "Bell icon not visible"
1. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
2. **Check deployment** - changes must be live on Vercel
3. **Verify you're on affiliate dashboard** - not admin (admins don't have bell)

### "Referral tracking not working"
1. **MUST run FIX-CLIENT-REQUESTS-STATUS.sql first!**
2. **Use incognito** when testing referral links
3. **Check cookies** are enabled in browser
4. **Verify product and affiliate** exist in database

### "Real-time updates not working"
1. **Check Supabase** realtime is enabled for your project
2. **Verify** notifications table has realtime enabled
3. **Browser** must support WebSockets

---

## 📊 Database Schema

### Notifications Table:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (references affiliate),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL (info|success|warning|error),
  link TEXT (optional page link),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes Created:
- `user_id` - Fast lookup by affiliate
- `read` - Filter unread quickly
- `created_at DESC` - Show newest first

---

## ✅ Deployment Checklist

- [x] SQL executed: `SETUP-NOTIFICATIONS.sql`
- [x] SQL executed: `FIX-CLIENT-REQUESTS-STATUS.sql`  
- [x] Code deployed to Vercel
- [ ] Test lead generation notification
- [ ] Test commission approval notification
- [ ] Test withdrawal notifications
- [ ] Test admin send to all affiliates
- [ ] Test admin send to specific affiliates
- [ ] Verify real-time updates work
- [ ] Check mobile responsiveness

---

## 🚀 Future Enhancements

Possible additions for later:
- Email notifications (in addition to in-app)
- SMS notifications for urgent matters
- Notification preferences page (let affiliates choose what they want)
- Notification history archive
- Push notifications (PWA)
- Notification scheduling (send later)
- Notification templates for admins

---

## 📞 Support

If you encounter issues:
1. Check this document first
2. Verify SQL was run correctly
3. Check browser console for errors
4. Check Supabase logs
5. Test with simple admin send first (easier to debug)

**Remember: The system requires the SQL setup to work!**
