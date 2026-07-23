import { ArrowRight, Heart } from "lucide-react";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";
import { useSite } from "@/components/SiteProvider";

const slides: HeroSlide[] = [
  {
    src: "/hero/sunflowers-1.jpg",
    alt: "Plantação de girassóis ao entardecer",
  },
  {
    src: "/hero/sunflowers-2.jpg",
    alt: "Campo de girassóis sob o céu azul",
  },
  {
    src: "/hero/sunflowers-3.jpg",
    alt: "Fileiras de girassóis na plantação",
  },
  {
    src: "/hero/sewing-1.jpg",
    alt: "Máquina de costura em uso",
  },
  {
    src: "/hero/sewing-2.jpg",
    alt: "Mãos costurando em máquina industrial",
  },
  {
    src: "/hero/hands-soil-1.jpg",
    alt: "Mãos com terra e muda germinando",
  },
  {
    src: "/hero/hands-soil-2.jpg",
    alt: "Mãos segurando terra úmida",
  },
];

export function Hero() {
  const site = useSite();
  return (
    <section
      id="inicio"
      className="relative isolate min-h-[88vh] overflow-hidden md:min-h-[92vh]"
    >
      <HeroCarousel slides={slides} />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl items-center px-4 py-24 md:min-h-[92vh] md:py-28">
        <div className="reveal max-w-2xl">
          <p className="font-display text-sm font-semibold tracking-[0.08em] text-primary md:text-base">
            ONG Viver Feliz
          </p>
          <span className="chip mt-4 border-white/15 bg-white/10 text-white backdrop-blur-sm">
            {site.hero.eyebrow}
          </span>
          <h1 className="mt-5 text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-white md:text-5xl lg:text-[3.35rem]">
            {site.hero.titulo}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/82 md:text-lg">
            {site.hero.subtitulo}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/catalogo" className="btn-primary">
              {site.hero.ctaPrincipal} <ArrowRight size={17} />
            </a>
            <a
              href="#como-ajudar"
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-white/35 bg-white/10 px-6 py-3 text-[0.9375rem] font-semibold text-white backdrop-blur-sm transition duration-200 hover:border-white/55 hover:bg-white/18"
            >
              <Heart size={15} /> {site.hero.ctaSecundario}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
