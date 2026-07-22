import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type MenuItem = { label: string; href: string };
export type Pilar = { titulo: string; descricao: string };

export type SiteData = {
  ong: {
    nome: string;
    tagline: string;
    whatsapp: string;
    email: string;
    cidade: string;
  };
  menu: MenuItem[];
  hero: {
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    ctaPrincipal: string;
    ctaSecundario: string;
  };
  quemSomos: {
    titulo: string;
    paragrafos: string[];
    pilares: Pilar[];
  };
  comoAjudar: {
    titulo: string;
    descricao: string;
  };
  footer: {
    sobre: string;
    credito: string;
  };
};

export type PostMeta = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string | null;
  published?: boolean;
};

export type Post = PostMeta & { content: string };

export const defaultSite: SiteData = {
  ong: {
    nome: "ONG Viver Feliz",
    tagline: "Semeando alegria, colhendo transformação.",
    whatsapp: "5535987054358",
    email: "contato@viverfeliz.org",
    cidade: "Minas Gerais, Brasil",
  },
  menu: [
    { label: "Início", href: "/#inicio" },
    { label: "Quem Somos", href: "/#quem-somos" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Blog", href: "/blog" },
    { label: "Depoimentos", href: "/#depoimentos" },
  ],
  hero: {
    eyebrow: "Feito com amor pela comunidade",
    titulo: "Cada planta e cada artesanato aqui carrega uma história de acolhimento.",
    subtitulo:
      "Ao levar um item para casa, você apoia diretamente as famílias atendidas pela ONG Viver Feliz. Cultive esperança com a gente.",
    ctaPrincipal: "Ver o catálogo",
    ctaSecundario: "Como ajudar",
  },
  quemSomos: {
    titulo: "Quem somos",
    paragrafos: [
      "A ONG Viver Feliz nasceu do desejo simples de transformar afeto em ação. Desde 2015, cultivamos plantas, produzimos artesanato e acolhemos famílias em situação de vulnerabilidade com escuta, dignidade e carinho.",
      "Nossa horta comunitária e o ateliê de artesanato são mais que espaços produtivos — são lugares de reencontro. Cada muda plantada, cada peça bordada, sustenta oficinas, refeições e apoio psicológico para quem mais precisa.",
      "Quando você adquire um item do nosso catálogo, sua contribuição vira semente. Vira sopa quente, escola de reforço, terapia em grupo e, principalmente, esperança.",
    ],
    pilares: [
      { titulo: "Acolhimento", descricao: "Escuta ativa e apoio contínuo às famílias." },
      { titulo: "Natureza", descricao: "Horta terapêutica e cultivo consciente." },
      { titulo: "Autonomia", descricao: "Oficinas geram protagonismo e desenvolvem os saberes." },
    ],
  },
  comoAjudar: {
    titulo: "Como ajudar",
    descricao:
      "Você pode contribuir adquirindo itens do catálogo, doando materiais para as oficinas ou se voluntariando. Fale com a gente pelo WhatsApp — respondemos com alegria.",
  },
  footer: {
    sobre: "ONG Viver Feliz — semeando alegria desde 2015.",
    credito: "Feito com carinho pela comunidade Viver Feliz.",
  },
};

let cachedSite: SiteData = defaultSite;

export function getSite(): SiteData {
  return cachedSite;
}

export function setCachedSite(data: SiteData) {
  cachedSite = data;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseSiteData(raw: Json | null | undefined): SiteData {
  if (!isRecord(raw)) return defaultSite;

  const ong = isRecord(raw.ong) ? raw.ong : {};
  const hero = isRecord(raw.hero) ? raw.hero : {};
  const quemSomos = isRecord(raw.quemSomos) ? raw.quemSomos : {};
  const comoAjudar = isRecord(raw.comoAjudar) ? raw.comoAjudar : {};
  const footer = isRecord(raw.footer) ? raw.footer : {};

  const menu = Array.isArray(raw.menu)
    ? raw.menu.flatMap((entry) => {
        if (!isRecord(entry)) return [];
        const label = asString(entry.label);
        const href = asString(entry.href);
        return label && href ? [{ label, href }] : [];
      })
    : defaultSite.menu;

  const paragrafos = Array.isArray(quemSomos.paragrafos)
    ? quemSomos.paragrafos.flatMap((p) => {
        if (typeof p === "string") return p ? [p] : [];
        if (isRecord(p)) {
          const texto = asString(p.texto);
          return texto ? [texto] : [];
        }
        return [];
      })
    : defaultSite.quemSomos.paragrafos;

  const pilares = Array.isArray(quemSomos.pilares)
    ? quemSomos.pilares.flatMap((entry) => {
        if (!isRecord(entry)) return [];
        return [{ titulo: asString(entry.titulo), descricao: asString(entry.descricao) }];
      })
    : defaultSite.quemSomos.pilares;

  return {
    ong: {
      nome: asString(ong.nome, defaultSite.ong.nome),
      tagline: asString(ong.tagline, defaultSite.ong.tagline),
      whatsapp: asString(ong.whatsapp, defaultSite.ong.whatsapp),
      email: asString(ong.email, defaultSite.ong.email),
      cidade: asString(ong.cidade, defaultSite.ong.cidade),
    },
    menu: menu.length ? menu : defaultSite.menu,
    hero: {
      eyebrow: asString(hero.eyebrow, defaultSite.hero.eyebrow),
      titulo: asString(hero.titulo, defaultSite.hero.titulo),
      subtitulo: asString(hero.subtitulo, defaultSite.hero.subtitulo),
      ctaPrincipal: asString(hero.ctaPrincipal, defaultSite.hero.ctaPrincipal),
      ctaSecundario: asString(hero.ctaSecundario, defaultSite.hero.ctaSecundario),
    },
    quemSomos: {
      titulo: asString(quemSomos.titulo, defaultSite.quemSomos.titulo),
      paragrafos,
      pilares,
    },
    comoAjudar: {
      titulo: asString(comoAjudar.titulo, defaultSite.comoAjudar.titulo),
      descricao: asString(comoAjudar.descricao, defaultSite.comoAjudar.descricao),
    },
    footer: {
      sobre: asString(footer.sobre, defaultSite.footer.sobre),
      credito: asString(footer.credito, defaultSite.footer.credito),
    },
  };
}

export async function fetchSiteSettings(): Promise<SiteData> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("data")
    .eq("id", "main")
    .maybeSingle();

  if (error || !data) {
    return cachedSite;
  }

  const parsed = parseSiteData(data.data);
  cachedSite = parsed;
  return parsed;
}

export async function saveSiteSettings(data: SiteData): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: "main", data: data as unknown as Json });

  if (!error) cachedSite = data;
  return { error: error?.message ?? null };
}

function mapPost(row: {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string | null;
  content: string;
  published: boolean;
}): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    excerpt: row.excerpt,
    cover: row.cover,
    content: row.content,
    published: row.published,
  };
}

export async function getAllPosts(opts?: { includeDrafts?: boolean }): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });

  if (!opts?.includeDrafts) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapPost(data);
}

export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function uploadSiteMedia(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
