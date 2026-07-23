import { useSite } from "@/components/SiteProvider";
import { buildContactLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { SunflowerLogo } from "./SunflowerLogo";

export function HowToHelp() {
  const site = useSite();
  return (
    <section id="como-ajudar" className="section-band section-band-forest">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:py-24">
        <SunflowerLogo size={48} className="mx-auto" />
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {site.comoAjudar.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/75">
          {site.comoAjudar.descricao}
        </p>
        <a
          href={buildContactLink("Olá! Quero ajudar a ONG Viver Feliz. Como posso contribuir?")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mx-auto mt-8 max-w-xs"
        >
          <MessageCircle size={17} /> Falar no WhatsApp
        </a>
        <p className="mt-5 text-sm text-white/55">
          Ou ligue para nós: (35) 98705-4358
        </p>
      </div>
    </section>
  );
}
