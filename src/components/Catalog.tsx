import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { Leaf, Palette, MessageCircle } from "lucide-react";

type Item = {
  id: string;
  tipo: "planta" | "artesanato";
  nome: string;
  descricao: string;
  foto_url: string | null;
  preco: string;
  status: "disponivel" | "vendido";
};

type Filter = "todos" | "planta" | "artesanato";

export function Catalog() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<Filter>("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("catalog_items")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data ?? []) as Item[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (filter === "todos") return items;
    return items.filter((i) => i.tipo === filter);
  }, [items, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "planta", label: "🌱 Plantas" },
    { key: "artesanato", label: "🧶 Artesanatos" },
  ];

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="chip bg-primary/30 text-primary-foreground">Catálogo</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Plantas e artesanatos com propósito</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Cada item aqui foi cultivado ou feito à mão pelas famílias da ONG. Escolha, converse com a gente
            no WhatsApp e leve para casa um pedacinho de esperança.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filter === f.key
                  ? "border-transparent bg-foreground text-background"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-soft h-80 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">Nenhum item disponível no momento.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function ItemCard({ item }: { item: Item }) {
  const isPlanta = item.tipo === "planta";
  const sold = item.status === "vendido";
  return (
    <article className="card-soft group flex flex-col overflow-hidden transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.foto_url ? (
          <img
            src={item.foto_url}
            alt={item.nome}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">Sem foto</div>
        )}
        <span
          className={`chip absolute left-3 top-3 ${
            isPlanta ? "bg-leaf text-white" : "bg-primary text-primary-foreground"
          }`}
        >
          {isPlanta ? <Leaf size={12} /> : <Palette size={12} />}
          {isPlanta ? "Planta" : "Artesanato"}
        </span>
        {sold && (
          <span className="chip absolute right-3 top-3 bg-foreground text-background">Vendido</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold">{item.nome}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.descricao}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-foreground">{item.preco}</span>
        </div>
        <a
          href={buildWhatsappLink(item.nome, item.tipo)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-4"
          aria-disabled={sold}
          onClick={(e) => {
            if (sold) e.preventDefault();
          }}
          style={sold ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
        >
          <MessageCircle size={18} /> {sold ? "Item vendido" : "Tenho Interesse"}
        </a>
      </div>
    </article>
  );
}
