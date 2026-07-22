import { site } from "@/lib/site-content";
import { buildContactLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export function HowToHelp() {
  return (
    <section id="como-ajudar" className="mx-auto max-w-4xl px-4 py-16">
      <div className="card-soft overflow-hidden bg-gradient-to-br from-primary/30 via-background to-leaf-soft/40 p-10 text-center">
        <div className="chip bg-primary/40 text-primary-foreground">🌻 Some com a gente</div>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">{site.comoAjudar.titulo}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{site.comoAjudar.descricao}</p>
        <a
          href={buildContactLink("Olá! Quero ajudar a ONG Viver Feliz. Como posso contribuir?")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mx-auto mt-6 max-w-xs"
        >
          <MessageCircle size={18} /> Falar no WhatsApp
        </a>
      </div>
    </section>
  );
}
