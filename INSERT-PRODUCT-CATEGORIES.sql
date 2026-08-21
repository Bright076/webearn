-- INSERT PRODUCT CATEGORIES
-- Run this in your Supabase SQL Editor

-- Insert the two main product categories
INSERT INTO product_categories (name, slug)
VALUES 
  ('Web Services', 'web-services'),
  ('Website Templates', 'website-templates')
ON CONFLICT (slug) DO NOTHING;

-- Verify they were inserted
SELECT * FROM product_categories ORDER BY name;
