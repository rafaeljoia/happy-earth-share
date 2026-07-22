import { ArrowRight, Heart } from "lucide-react";
import { SunflowerScene } from "./SunflowerScene";
import { site } from "@/lib/site-content";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-14 md:py-28">
        <div className="reveal">
          <span className="chip bg-primary/25 text-primary-foreground">
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

        <div className="reveal relative mx-auto aspect-square w-full max-w-sm md:max-w-md">
          <div className="absolute inset-[6%] rounded-full bg-primary/25 blur-3xl" />
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-[0_16px_48px_-18px_oklch(0.45_0.05_70_/0.28)]">
            <SunflowerScene className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
