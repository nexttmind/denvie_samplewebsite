REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

DROP POLICY IF EXISTS "products public read" ON public.products;
CREATE POLICY "products public read" ON public.products
  FOR SELECT TO anon, authenticated
  USING (is_active = true);