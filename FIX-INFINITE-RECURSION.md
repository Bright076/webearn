# Fix Infinite Recursion Error in Profile Update

## Problem
Error: `infinite recursion detected in policy for relation "user_roles"`

This happens when RLS policies on different tables reference each other, creating a circular dependency.

## Solution
Run the SQL in `FIX-PROFILE-POLICY-RECURSION.sql` in your Supabase SQL Editor.

## Steps

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `FIX-PROFILE-POLICY-RECURSION.sql`
3. Click "Run" to execute

## What It Does
- Removes any policies on `profiles` table that might check `user_roles`
- Creates simple policies that only check `auth.uid()` without any joins
- Allows users to view and update their own profile
- Allows service role to manage all profiles (needed for admin operations)

## After Running
- Profile update should work without recursion errors
- Users can only see and edit their own profile
- No circular dependencies between tables
