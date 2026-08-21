# Fix "Database error saving new user" Error

## The Problem
The signup is failing because the database trigger is trying to create records but either:
1. The `user_roles` table doesn't exist
2. The trigger function has an error

## Solution: Run This SQL in Supabase

Go to your Supabase Dashboard → SQL Editor → New Query, and run this:

```sql
-- 1. Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('affiliate', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create simple RLS policies (no recursion)
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON user_roles;

CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all roles"
  ON user_roles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Update trigger function to create both profile and role
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, affiliate_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    upper(substring(md5(random()::text) from 1 for 8))
  );
  
  -- Insert into user_roles with default role 'affiliate'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'affiliate');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## After Running the SQL

1. Try signing up again
2. The error should be gone
3. New users will automatically get:
   - A profile record
   - A user_roles record with role='affiliate'
   - An auto-generated affiliate code

## To Create an Admin User

After a user signs up, run this to make them an admin:

```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'USER_ID_HERE';
```

Replace `USER_ID_HERE` with the actual UUID from the auth.users table.
