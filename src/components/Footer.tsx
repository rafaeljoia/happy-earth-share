import { SunflowerLogo } from "./SunflowerLogo";
import { site } from "@/lib/site-content";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <SunflowerLogo size={36} />
            <div className="font-display text-lg font-bold">{site.ong.nome}</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{site.footer.sobre}</p>
        </div>
        <div>
          <div className="text-sm font-semibold">Navegar</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {site.menu.map((m) => (
              <li key={m.href}>
                <a href={m.href} className="hover:text-foreground">{m.label}</a>
              </li>
            ))}
            <li><Link to="/admin" className="hover:text-foreground">Área da equipe</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Contato</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>WhatsApp: (35) 98705-4358</li>
            <li>{site.ong.email}</li>
            <li>{site.ong.cidade}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        {site.footer.credito}
      </div>
    </footer>
  );
}
