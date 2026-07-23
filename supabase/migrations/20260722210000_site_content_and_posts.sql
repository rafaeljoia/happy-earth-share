-- Site settings (single-row JSON document mirroring former site-data.json)
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 'main')
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER site_settings_touch
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Blog posts
CREATE TABLE public.posts (
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

CREATE INDEX posts_date_idx ON public.posts (date DESC);
CREATE INDEX posts_published_idx ON public.posts (published);

GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER posts_touch
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Media bucket for post covers and site images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

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

-- Seed institutional content
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

-- Seed blog posts
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
