import { Link } from "@tanstack/react-router";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { SunflowerLogo } from "./SunflowerLogo";
import { useSite } from "@/components/SiteProvider";

export function Header() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <SunflowerLogo size={36} />
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-tight text-white md:text-lg">
              ONG Viver Feliz
            </div>
            <div className="hidden text-[0.7rem] text-white/55 sm:block">
              {site.ong.tagline}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {site.menu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a href="/#como-ajudar" className="btn-primary ml-3 !px-4 !py-2 text-sm">
            <Heart size={15} strokeWidth={2} /> Como Ajudar
          </a>
        </nav>

        <button
          className="rounded-md p-2 text-white/85 transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-forest md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-0.5 px-4 py-3">
            {site.menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#como-ajudar"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 text-sm"
            >
              <Heart size={15} /> Como Ajudar
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
