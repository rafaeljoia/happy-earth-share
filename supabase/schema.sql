CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.item_type AS ENUM ('planta', 'artesanato');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.item_status AS ENUM ('disponivel', 'vendido');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.tg_first_user_becomes_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.tg_first_user_becomes_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_first_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_first_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_first_user_becomes_admin();

CREATE TABLE IF NOT EXISTS public.catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo public.item_type NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  foto_url TEXT,
  preco TEXT NOT NULL DEFAULT 'Doação',
  status public.item_status NOT NULL DEFAULT 'disponivel',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.catalog_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_items TO authenticated;
GRANT ALL ON public.catalog_items TO service_role;

ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads catalog" ON public.catalog_items;
DROP POLICY IF EXISTS "Admins insert catalog" ON public.catalog_items;
DROP POLICY IF EXISTS "Admins update catalog" ON public.catalog_items;
DROP POLICY IF EXISTS "Admins delete catalog" ON public.catalog_items;

CREATE POLICY "Anyone reads catalog"
  ON public.catalog_items FOR SELECT
  USING (true);

CREATE POLICY "Admins insert catalog"
  ON public.catalog_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update catalog"
  ON public.catalog_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete catalog"
  ON public.catalog_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS catalog_items_touch ON public.catalog_items;
CREATE TRIGGER catalog_items_touch
  BEFORE UPDATE ON public.catalog_items
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE TABLE IF NOT EXISTS public.comments (
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

DROP POLICY IF EXISTS "Anyone reads comments" ON public.comments;
DROP POLICY IF EXISTS "Users insert own comment" ON public.comments;
DROP POLICY IF EXISTS "Users delete own comment" ON public.comments;

CREATE POLICY "Anyone reads comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Users insert own comment"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own comment"
  ON public.comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 'main')
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins insert site settings" ON public.site_settings;

CREATE POLICY "Anyone reads site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins update site settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert site settings"
  ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS site_settings_touch ON public.site_settings;
CREATE TRIGGER site_settings_touch
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  excerpt TEXT NOT NULL DEFAULT '',
  cover TEXT,
  content TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_date_idx ON public.posts (date DESC);
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts (published);

GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins read all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admins update posts" ON public.posts;
DROP POLICY IF EXISTS "Admins delete posts" ON public.posts;

CREATE POLICY "Anyone reads published posts"
  ON public.posts FOR SELECT
  USING (published = true);

CREATE POLICY "Admins read all posts"
  ON public.posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete posts"
  ON public.posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS posts_touch ON public.posts;
CREATE TRIGGER posts_touch
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_touch_updated_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'catalog-images',
  'catalog-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read catalog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload catalog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update catalog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete catalog images" ON storage.objects;
DROP POLICY IF EXISTS "Public read site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins update site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete site media" ON storage.objects;

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

CREATE POLICY "Public read site media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

CREATE POLICY "Admins upload site media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update site media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete site media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id, data) VALUES (
  'main',
  '{
    "ong": {
      "nome": "ONG Viver Feliz",
      "tagline": "Semeando alegria, colhendo transformação.",
      "whatsapp": "5535987054358",
      "email": "contato@viverfeliz.org",
      "cidade": "Minas Gerais, Brasil"
    },
    "menu": [
      {"label": "Início", "href": "/#inicio"},
      {"label": "Quem Somos", "href": "/#quem-somos"},
      {"label": "Catálogo", "href": "/catalogo"},
      {"label": "Blog", "href": "/blog"},
      {"label": "Depoimentos", "href": "/#depoimentos"}
    ],
    "hero": {
      "eyebrow": "Feito com amor pela comunidade",
      "titulo": "Cada planta e cada artesanato aqui carrega uma história de acolhimento.",
      "subtitulo": "Ao levar um item para casa, você apoia diretamente as famílias atendidas pela ONG Viver Feliz. Cultive esperança com a gente.",
      "ctaPrincipal": "Ver o catálogo",
      "ctaSecundario": "Como ajudar"
    },
    "quemSomos": {
      "titulo": "Quem somos",
      "paragrafos": [
        "A ONG Viver Feliz nasceu do desejo simples de transformar afeto em ação. Desde 2015, cultivamos plantas, produzimos artesanato e acolhemos famílias em situação de vulnerabilidade com escuta, dignidade e carinho.",
        "Nossa horta comunitária e o ateliê de artesanato são mais que espaços produtivos — são lugares de reencontro. Cada muda plantada, cada peça bordada, sustenta oficinas, refeições e apoio psicológico para quem mais precisa.",
        "Quando você adquire um item do nosso catálogo, sua contribuição vira semente. Vira sopa quente, escola de reforço, terapia em grupo e, principalmente, esperança."
      ],
      "pilares": [
        {"titulo": "Acolhimento", "descricao": "Escuta ativa e apoio contínuo às famílias."},
        {"titulo": "Natureza", "descricao": "Horta terapêutica e cultivo consciente."},
        {"titulo": "Autonomia", "descricao": "Oficinas geram protagonismo e desenvolvem os saberes."}
      ]
    },
    "comoAjudar": {
      "titulo": "Como ajudar",
      "descricao": "Você pode contribuir adquirindo itens do catálogo, doando materiais para as oficinas ou se voluntariando. Fale com a gente pelo WhatsApp — respondemos com alegria."
    },
    "footer": {
      "sobre": "ONG Viver Feliz — semeando alegria desde 2015.",
      "credito": "Feito com carinho pela comunidade Viver Feliz."
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.catalog_items (tipo, nome, descricao, foto_url, preco, status)
SELECT * FROM (VALUES
  ('planta'::public.item_type, 'Suculenta Echeveria', 'Muda cultivada com carinho pelos voluntários, em vaso de cerâmica reaproveitada.', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800', 'R$ 25', 'disponivel'::public.item_status),
  ('planta'::public.item_type, 'Samambaia Americana', 'Planta de sombra, ideal para varandas. Já bem enraizada.', 'https://images.unsplash.com/photo-1616500098941-3fd45f74f2a9?w=800', 'R$ 40', 'disponivel'::public.item_status),
  ('artesanato'::public.item_type, 'Bolsa de Crochê Girassol', 'Feita à mão pelas voluntárias da ONG. Fio 100% algodão.', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800', 'R$ 85', 'disponivel'::public.item_status),
  ('artesanato'::public.item_type, 'Toalha Bordada', 'Toalha de mesa bordada à mão com flores de girassol.', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800', 'Doação', 'disponivel'::public.item_status),
  ('planta'::public.item_type, 'Orquídea Phalaenopsis', 'Doação recebida e replantada com carinho. Floração garantida.', 'https://images.unsplash.com/photo-1524598171353-ce84a41d39f6?w=800', 'R$ 60', 'disponivel'::public.item_status),
  ('artesanato'::public.item_type, 'Sabonete Artesanal', 'Kit com 3 sabonetes naturais de erva-doce e camomila.', 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800', 'R$ 30', 'disponivel'::public.item_status)
) AS seed(tipo, nome, descricao, foto_url, preco, status)
WHERE NOT EXISTS (SELECT 1 FROM public.catalog_items LIMIT 1);

INSERT INTO public.posts (slug, title, date, excerpt, cover, content, published) VALUES
(
  'oficina-de-croche',
  'Oficina de crochê forma nova turma',
  '2026-06-22',
  'Doze mulheres concluíram o curso de crochê e já estão produzindo peças para o catálogo da ONG.',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200',
  $md$Doze mulheres concluíram o curso de crochê e já estão produzindo peças para o **catálogo da ONG**. A oficina, que dura três meses, ensina desde os pontos básicos até acabamentos profissionais.

## Renda que transforma

A cada peça vendida no catálogo, **70% do valor** vai direto para a artesã. Os outros 30% custeiam materiais e novas oficinas.

### Depoimento

> "Aprendi um ofício e conheci amigas para a vida toda." — Cláudia, formanda

Se você quer apoiar, dê uma olhada no nosso [catálogo](/catalogo). Cada bolsa, cada toalha, cada sabonete carrega o carinho dessas mãos.$md$,
  true
),
(
  'mutirao-de-plantio',
  'Mutirão de plantio reúne 60 voluntários',
  '2026-07-10',
  'No último sábado, a nossa horta comunitária ganhou 300 novas mudas graças a um mutirão emocionante.',
  'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=1200',
  $md$No último sábado, a nossa horta comunitária ganhou **300 novas mudas** graças a um mutirão emocionante. Foram 60 voluntários, entre crianças, jovens e idosos, transformando a manhã em um encontro cheio de sol e conversa boa.

## O que plantamos

- Manjericão e hortelã para o chá das oficinas
- Girassóis para colorir o pátio
- Mudas de tomate cereja para as famílias atendidas

> "Colocar a mão na terra é uma terapia que a gente leva pra vida." — Dona Marta, voluntária desde 2017

![Voluntários plantando](https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200)

## Assista ao vídeo do mutirão

https://www.youtube.com/watch?v=dQw4w9WgXcQ

Obrigado a todas as famílias que participaram. O próximo mutirão será em agosto — fique de olho no nosso blog!$md$,
  true
),
(
  'bingo-de-plantas',
  'Bingo de Plantas',
  '2026-07-22',
  'FIzemos um grande bingo',
  'https://papelsemente.com.br/wp-content/uploads/2020/07/papaver-rhoeas-63yI-VSessk-unsplash-scaled.jpg',
  $md$Um grande evento!$md$,
  true
)
ON CONFLICT (slug) DO NOTHING;
