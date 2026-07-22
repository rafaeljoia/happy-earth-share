import { Link } from "@tanstack/react-router";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { SunflowerLogo } from "./SunflowerLogo";
import { site } from "@/lib/site-content";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <SunflowerLogo size={40} />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold">ONG Viver Feliz</div>
            <div className="text-xs text-muted-foreground">{site.ong.tagline}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {site.menu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <a href="/#como-ajudar" className="btn-primary ml-2 !py-2 !px-4 text-sm">
            <Heart size={16} /> Como Ajudar
          </a>
        </nav>

        <button
          className="rounded-full p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {site.menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                {item.label}
              </a>
            ))}
            <a href="/#como-ajudar" onClick={() => setOpen(false)} className="btn-primary mt-2 text-sm">
              <Heart size={16} /> Como Ajudar
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
