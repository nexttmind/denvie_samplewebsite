-- 1. Lock down validate_coupon: only authenticated users may call it
REVOKE EXECUTE ON FUNCTION public.validate_coupon(text, numeric) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO authenticated;

-- 2. Newsletter: prevent duplicate / unauthorized enumeration via unique email
-- De-duplicate existing rows first
DELETE FROM public.newsletter_subscribers a
USING public.newsletter_subscribers b
WHERE a.ctid < b.ctid AND lower(a.email) = lower(b.email);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_unique
  ON public.newsletter_subscribers (lower(email));

-- 3. Reviews: hide internal user_id from public reads via a safe view
-- Drop the public read policy on the base table, expose a sanitized view instead
DROP POLICY IF EXISTS "reviews public read" ON public.reviews;

-- Re-create public read but only for authenticated users (own + others without user_id exposure handled at app layer)
CREATE POLICY "reviews authenticated read"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (true);

-- Public-safe view: no user_id
CREATE OR REPLACE VIEW public.public_reviews
WITH (security_invoker = true) AS
SELECT id, product_id, rating, title, body, created_at
FROM public.reviews;

GRANT SELECT ON public.public_reviews TO anon, authenticated;