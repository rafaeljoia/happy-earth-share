
-- Fix search_path & lock down execution
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;
ALTER FUNCTION public.tg_touch_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Storage policies: bucket "catalog-images" — public read, admins write
CREATE POLICY "Public read catalog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'catalog-images');

CREATE POLICY "Admins upload catalog images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update catalog images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete catalog images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));
