import { SunflowerLogo } from "./SunflowerLogo";
import { useSite } from "@/components/SiteProvider";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const site = useSite();
  return (
    <footer className="border-t border-border bg-secondary/55">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <SunflowerLogo size={32} />
            <div className="font-display text-base font-semibold tracking-tight">
              {site.ong.nome}
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {site.footer.sobre}
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Navegar
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {site.menu.map((m) => (
              <li key={m.href}>
                <a href={m.href} className="transition-colors hover:text-foreground">
                  {m.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/admin" className="transition-colors hover:text-foreground">
                Área da equipe
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Contato
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>WhatsApp: (35) 98705-4358</li>
            <li>{site.ong.email}</li>
            <li>{site.ong.cidade}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        {site.footer.credito}
      </div>
    </footer>
  );
}
