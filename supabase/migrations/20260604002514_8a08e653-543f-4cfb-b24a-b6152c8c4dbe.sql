DROP POLICY IF EXISTS "coupons public read active" ON public.coupons;

CREATE POLICY "coupons admin read"
  ON public.coupons FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _subtotal numeric)
RETURNS TABLE (
  valid boolean,
  code text,
  discount_type text,
  discount_value numeric,
  min_order numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    TRUE,
    c.code,
    c.discount_type,
    c.discount_value,
    c.min_order
  FROM public.coupons c
  WHERE c.code = _code
    AND c.is_active = TRUE
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.usage_limit IS NULL OR c.used_count < c.usage_limit)
    AND (c.min_order IS NULL OR _subtotal >= c.min_order)
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.validate_coupon(text, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO authenticated, anon;

CREATE POLICY "user_roles admin insert"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "user_roles admin update"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "user_roles admin delete"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;