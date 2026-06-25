UPDATE public.products SET collection_id = 'da703668-b5a2-4d05-832f-579a5ee8596d'
  WHERE collection_id IS NULL AND is_new = true;

UPDATE public.products SET collection_id = '4518dbf1-19d9-4f22-8f96-1bd1bf4ab826'
  WHERE collection_id IS NULL AND is_bestseller = true;

UPDATE public.products SET collection_id = '4b632a11-2c4e-4133-b104-39951fd0191a'
  WHERE collection_id IS NULL AND is_sale = true;

UPDATE public.collections SET description = 'Fresh-off-the-loom silhouettes — the season''s first edit of slips, knits, and quiet tailoring.'
  WHERE slug = 'new-arrivals' AND (description IS NULL OR description = '');

UPDATE public.collections SET description = 'Loved on repeat. The pieces our community returns to season after season.'
  WHERE slug = 'best-sellers' AND (description IS NULL OR description = '');

UPDATE public.collections SET description = 'Quietly luxurious staples, thoughtfully marked down. A discreet edit, while it lasts.'
  WHERE slug = 'sale' AND (description IS NULL OR description = '');