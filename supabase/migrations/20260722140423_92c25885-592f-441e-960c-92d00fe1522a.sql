
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Catalog
CREATE TYPE public.item_type AS ENUM ('planta', 'artesanato');
CREATE TYPE public.item_status AS ENUM ('disponivel', 'vendido');

CREATE TABLE public.catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo item_type NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  foto_url TEXT,
  preco TEXT NOT NULL DEFAULT 'Doação',
  status item_status NOT NULL DEFAULT 'disponivel',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalog_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_items TO authenticated;
GRANT ALL ON public.catalog_items TO service_role;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads catalog" ON public.catalog_items FOR SELECT USING (true);
CREATE POLICY "Admins insert catalog" ON public.catalog_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update catalog" ON public.catalog_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete catalog" ON public.catalog_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comments TO anon;
GRANT SELECT, INSERT, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users insert own comment" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comment" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER catalog_items_touch BEFORE UPDATE ON public.catalog_items FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Seed catalog
INSERT INTO public.catalog_items (tipo, nome, descricao, foto_url, preco, status) VALUES
('planta','Suculenta Echeveria','Muda cultivada com carinho pelos voluntários, em vaso de cerâmica reaproveitada.','https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800','R$ 25','disponivel'),
('planta','Samambaia Americana','Planta de sombra, ideal para varandas. Já bem enraizada.','https://images.unsplash.com/photo-1616500098941-3fd45f74f2a9?w=800','R$ 40','disponivel'),
('artesanato','Bolsa de Crochê Girassol','Feita à mão pelas voluntárias da ONG. Fio 100% algodão.','https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800','R$ 85','disponivel'),
('artesanato','Toalha Bordada','Toalha de mesa bordada à mão com flores de girassol.','https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800','Doação','disponivel'),
('planta','Orquídea Phalaenopsis','Doação recebida e replantada com carinho. Floração garantida.','https://images.unsplash.com/photo-1524598171353-ce84a41d39f6?w=800','R$ 60','disponivel'),
('artesanato','Sabonete Artesanal','Kit com 3 sabonetes naturais de erva-doce e camomila.','https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800','R$ 30','disponivel');
