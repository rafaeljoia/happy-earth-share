import { useEffect, useState } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
};

type Props = {
  slides: HeroSlide[];
  intervalMs?: number;
};

export function HeroCarousel({ slides, intervalMs = 6500 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, paused]);

  if (slides.length === 0) return null;

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-hidden="true"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.src}
            alt=""
            className={`h-full w-full object-cover ${
              i === index ? "hero-kenburns" : ""
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.05_150/0.88)] via-[oklch(0.25_0.05_150/0.62)] to-[oklch(0.28_0.045_150/0.28)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.045_150/0.7)] via-transparent to-[oklch(0.24_0.04_150/0.35)]" />

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-8">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Ver imagem ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-8 bg-sun"
                : "w-1.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
