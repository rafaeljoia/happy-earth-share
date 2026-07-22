import { site } from "@/lib/site-content";
import { HeartHandshake, Leaf, Sparkles } from "lucide-react";

const icons = [HeartHandshake, Leaf, Sparkles];

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

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {site.quemSomos.pilares.map((pilar, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={pilar.titulo}
                className="card-soft p-7 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_oklch(0.4_0.03_60_/0.16)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/20 text-foreground">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="mt-5 font-display text-lg font-semibold tracking-tight">
                  {pilar.titulo}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pilar.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
