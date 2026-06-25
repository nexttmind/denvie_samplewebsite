-- Remove broad SELECT for anonymous users, then re-grant access to every column EXCEPT stock.
REVOKE SELECT ON public.products FROM anon;

GRANT SELECT (
  id, category_id, collection_id, colors, compare_at_price, created_at,
  description, images, is_active, is_bestseller, is_featured, is_new,
  is_sale, name, price, sizes, sku, slug, updated_at
) ON public.products TO anon;

-- Ensure authenticated users (incl. admins) keep full table access used by admin pages.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;