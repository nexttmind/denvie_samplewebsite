DROP POLICY IF EXISTS "reviews authenticated read" ON public.reviews;

CREATE POLICY "reviews owner or admin read"
ON public.reviews
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));