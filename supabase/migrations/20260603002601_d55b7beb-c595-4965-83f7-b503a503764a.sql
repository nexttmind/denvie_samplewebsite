
CREATE POLICY "product images admin all"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "product images public read"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'product-images');
