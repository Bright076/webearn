-- SUPABASE STORAGE SETUP FOR PRODUCT IMAGES
-- Run this in your Supabase SQL Editor

-- 1. Create the products storage bucket (if not already created via UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to product images
CREATE POLICY "public_read_products"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- 3. Allow authenticated users to upload images
CREATE POLICY "authenticated_upload_products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- 4. Allow authenticated users to update images (optional)
CREATE POLICY "authenticated_update_products"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- 5. Allow authenticated users to delete images (optional - for admin cleanup)
CREATE POLICY "authenticated_delete_products"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'products';

-- Verify policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%products%';
