import { ArrowRight, Heart } from "lucide-react";
import { SunflowerLogo } from "./SunflowerLogo";
import { site } from "@/lib/site-content";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-[1.2fr_0.8fr] md:gap-16 md:py-28">
        <div className="reveal">
          <span className="chip bg-secondary text-secondary-foreground">
            {site.hero.eyebrow}
          </span>
          <h1 className="mt-5 text-[2.15rem] font-semibold leading-[1.15] tracking-tight md:text-5xl lg:text-[3.25rem]">
            {site.hero.titulo}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {site.hero.subtitulo}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#catalogo" className="btn-primary">
              {site.hero.ctaPrincipal} <ArrowRight size={17} />
            </a>
            <a href="#como-ajudar" className="btn-leaf">
              <Heart size={15} /> {site.hero.ctaSecundario}
            </a>
          </div>
        </div>

        <div className="reveal relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center md:max-w-md">
          <div className="absolute inset-[8%] rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-border/80 bg-card/80 shadow-[0_8px_40px_-16px_oklch(0.4_0.03_60_/0.12)] backdrop-blur-sm">
            <SunflowerLogo size={220} className="opacity-95" />
          </div>
        </div>
      </div>
    </section>
  );
}
