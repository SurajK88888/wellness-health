CREATE POLICY "Restrict inserts to admins only" ON public.user_roles
AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));