-- SET ADMIN ROLE SQL SCRIPT
-- Run this in your Supabase SQL Editor

-- IMPORTANT: Role must be LOWERCASE 'admin' (not 'Admin' or 'ADMIN')

-- Step 1: Check if user_roles table exists and view current roles
SELECT * FROM user_roles;

-- Step 2: Find your user ID from auth.users
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Step 3: Set your user as admin (REPLACE 'YOUR_USER_ID' with actual UUID from step 2)
-- Use lowercase 'admin'
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();

-- Step 4: Verify it was set correctly
SELECT u.email, ur.role, ur.updated_at 
FROM user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- If you accidentally used uppercase, fix it:
UPDATE user_roles 
SET role = 'admin' 
WHERE role = 'Admin' OR role = 'ADMIN';

-- Alternative: Set admin by email (REPLACE 'your@email.com')
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your@email.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();
