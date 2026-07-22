import { site } from "@/lib/site-content";
import { buildContactLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export function HowToHelp() {
  return (
    <section id="como-ajudar" className="mx-auto max-w-4xl px-4 py-20 md:py-24">
      <div className="card-soft overflow-hidden bg-secondary/50 p-10 text-center md:p-14">
        <div className="chip bg-card text-secondary-foreground">Participe</div>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          {site.comoAjudar.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
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
      </div>
    </section>
  );
}
