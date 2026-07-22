
CREATE OR REPLACE FUNCTION public.tg_first_user_becomes_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

REVOKE EXECUTE ON FUNCTION public.tg_first_user_becomes_admin() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created_first_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.tg_first_user_becomes_admin();
