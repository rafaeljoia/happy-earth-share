import { site } from "@/lib/site-content";
import { HeartHandshake, Leaf, Sparkles, type LucideIcon } from "lucide-react";

type PilarVisual = {
  icon: LucideIcon;
  image: string;
  imageAlt: string;
};

const pilarVisuals: Record<string, PilarVisual> = {
  Acolhimento: {
    icon: HeartHandshake,
    image: "/pilares/acolhimento.jpg",
    imageAlt: "Pessoas em momento de escuta e apoio",
  },
  Natureza: {
    icon: Leaf,
    image: "/pilares/natureza.jpg",
    imageAlt: "Mãos cultivando plantas na horta",
  },
  Autonomia: {
    icon: Sparkles,
    image: "/pilares/autonomia.jpg",
    imageAlt: "Oficina de produção manual e saberes",
  },
};

export function About() {
  return (
    <section id="quem-somos" className="section-band section-band-soft">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.3fr] md:items-start md:gap-16">
          <div>
            <div className="chip bg-card text-secondary-foreground">Nossa história</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {site.quemSomos.titulo}
            </h2>
          </div>
          <div className="space-y-5 text-base leading-[1.75] text-foreground/85 md:text-[1.05rem]">
            {site.quemSomos.paragrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {site.quemSomos.pilares.map((pilar) => {
            const visual = pilarVisuals[pilar.titulo] ?? {
              icon: Sparkles,
              image: "/pilares/natureza.jpg",
              imageAlt: pilar.titulo,
            };
            const Icon = visual.icon;

            return (
              <article
                key={pilar.titulo}
                className="card-soft group overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-14px_oklch(0.4_0.03_60_/0.18)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={visual.image}
                    alt={visual.imageAlt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.03_55/0.35)] to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/90 text-foreground shadow-sm backdrop-blur-sm">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5 md:p-6">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {pilar.titulo}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pilar.descricao}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
