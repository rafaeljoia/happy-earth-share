import { site } from "@/lib/site-content";
import { HeartHandshake, Leaf, Sparkles } from "lucide-react";

const icons = [HeartHandshake, Leaf, Sparkles];

export function About() {
  return (
    <section id="quem-somos" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
        <div>
          <div className="chip bg-secondary text-secondary-foreground">Nossa história</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{site.quemSomos.titulo}</h2>
        </div>
        <div className="space-y-4 text-[1.05rem] leading-relaxed text-foreground/85">
          {site.quemSomos.paragrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {site.quemSomos.pilares.map((pilar, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={pilar.titulo} className="card-soft p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/25 text-foreground">
                <Icon size={22} />
              </div>
              <div className="mt-4 font-display text-lg font-semibold">{pilar.titulo}</div>
              <p className="mt-1 text-sm text-muted-foreground">{pilar.descricao}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
