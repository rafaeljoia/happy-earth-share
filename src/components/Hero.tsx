import { ArrowRight, Heart } from "lucide-react";
import { SunflowerLogo } from "./SunflowerLogo";
import { site } from "@/lib/site-content";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <div>
          <span className="chip bg-accent text-accent-foreground">{site.hero.eyebrow}</span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] md:text-6xl">
            {site.hero.titulo}
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            {site.hero.subtitulo}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogo" className="btn-primary">
              {site.hero.ctaPrincipal} <ArrowRight size={18} />
            </a>
            <a href="#como-ajudar" className="btn-leaf">
              <Heart size={16} /> {site.hero.ctaSecundario}
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 via-secondary to-leaf-soft/50 blur-2xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-[2.5rem] border border-border bg-card/70 backdrop-blur">
            <SunflowerLogo size={260} className="drop-shadow-[0_10px_30px_oklch(0.86_0.16_92_/0.35)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
