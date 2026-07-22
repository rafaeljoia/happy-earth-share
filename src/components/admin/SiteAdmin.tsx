import { useEffect, useState } from "react";
import { useSiteActions } from "@/components/SiteProvider";
import {
  defaultSite,
  fetchSiteSettings,
  saveSiteSettings,
  type MenuItem,
  type Pilar,
  type SiteData,
} from "@/lib/site-content";
import { Check, Plus, Trash2 } from "lucide-react";

export function SiteAdmin() {
  const { updateSite } = useSiteActions();
  const [data, setData] = useState<SiteData>(defaultSite);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteSettings().then((site) => {
      setData(site);
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const result = await saveSiteSettings(data);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    updateSite(data);
    setMessage("Conteúdo institucional salvo. As alterações já aparecem no site.");
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <form onSubmit={save} className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Edite os textos do site. Ao salvar, as mudanças ficam disponíveis imediatamente — sem commit nem deploy.
      </p>

      <Section title="ONG">
        <Field label="Nome" value={data.ong.nome} onChange={(v) => setData({ ...data, ong: { ...data.ong, nome: v } })} />
        <Field label="Tagline" value={data.ong.tagline} onChange={(v) => setData({ ...data, ong: { ...data.ong, tagline: v } })} />
        <Field label="WhatsApp (com DDI)" value={data.ong.whatsapp} onChange={(v) => setData({ ...data, ong: { ...data.ong, whatsapp: v } })} />
        <Field label="Email" value={data.ong.email} onChange={(v) => setData({ ...data, ong: { ...data.ong, email: v } })} />
        <Field label="Cidade" value={data.ong.cidade} onChange={(v) => setData({ ...data, ong: { ...data.ong, cidade: v } })} />
      </Section>

      <Section title="Hero">
        <Field label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => setData({ ...data, hero: { ...data.hero, eyebrow: v } })} />
        <Field label="Título" value={data.hero.titulo} onChange={(v) => setData({ ...data, hero: { ...data.hero, titulo: v } })} />
        <TextArea label="Subtítulo" value={data.hero.subtitulo} onChange={(v) => setData({ ...data, hero: { ...data.hero, subtitulo: v } })} />
        <Field label="CTA principal" value={data.hero.ctaPrincipal} onChange={(v) => setData({ ...data, hero: { ...data.hero, ctaPrincipal: v } })} />
        <Field label="CTA secundário" value={data.hero.ctaSecundario} onChange={(v) => setData({ ...data, hero: { ...data.hero, ctaSecundario: v } })} />
      </Section>

      <Section title="Quem somos">
        <Field
          label="Título"
          value={data.quemSomos.titulo}
          onChange={(v) => setData({ ...data, quemSomos: { ...data.quemSomos, titulo: v } })}
        />
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Parágrafos</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-leaf"
              onClick={() =>
                setData({
                  ...data,
                  quemSomos: { ...data.quemSomos, paragrafos: [...data.quemSomos.paragrafos, ""] },
                })
              }
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>
          {data.quemSomos.paragrafos.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={p}
                rows={3}
                onChange={(e) => {
                  const paragrafos = [...data.quemSomos.paragrafos];
                  paragrafos[i] = e.target.value;
                  setData({ ...data, quemSomos: { ...data.quemSomos, paragrafos } });
                }}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
              <button
                type="button"
                className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                onClick={() => {
                  const paragrafos = data.quemSomos.paragrafos.filter((_, idx) => idx !== i);
                  setData({ ...data, quemSomos: { ...data.quemSomos, paragrafos } });
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pilares</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-leaf"
              onClick={() =>
                setData({
                  ...data,
                  quemSomos: {
                    ...data.quemSomos,
                    pilares: [...data.quemSomos.pilares, { titulo: "", descricao: "" }],
                  },
                })
              }
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>
          {data.quemSomos.pilares.map((pilar, i) => (
            <PilarEditor
              key={i}
              pilar={pilar}
              onChange={(next) => {
                const pilares = [...data.quemSomos.pilares];
                pilares[i] = next;
                setData({ ...data, quemSomos: { ...data.quemSomos, pilares } });
              }}
              onRemove={() => {
                const pilares = data.quemSomos.pilares.filter((_, idx) => idx !== i);
                setData({ ...data, quemSomos: { ...data.quemSomos, pilares } });
              }}
            />
          ))}
        </div>
      </Section>

      <Section title="Como ajudar">
        <Field
          label="Título"
          value={data.comoAjudar.titulo}
          onChange={(v) => setData({ ...data, comoAjudar: { ...data.comoAjudar, titulo: v } })}
        />
        <TextArea
          label="Descrição"
          value={data.comoAjudar.descricao}
          onChange={(v) => setData({ ...data, comoAjudar: { ...data.comoAjudar, descricao: v } })}
        />
      </Section>

      <Section title="Menu">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Itens do menu</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-leaf"
              onClick={() => setData({ ...data, menu: [...data.menu, { label: "", href: "/" }] })}
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>
          {data.menu.map((item, i) => (
            <MenuEditor
              key={i}
              item={item}
              onChange={(next) => {
                const menu = [...data.menu];
                menu[i] = next;
                setData({ ...data, menu });
              }}
              onRemove={() => setData({ ...data, menu: data.menu.filter((_, idx) => idx !== i) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Rodapé">
        <TextArea label="Sobre" value={data.footer.sobre} onChange={(v) => setData({ ...data, footer: { ...data.footer, sobre: v } })} />
        <Field label="Crédito" value={data.footer.credito} onChange={(v) => setData({ ...data, footer: { ...data.footer, credito: v } })} />
      </Section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-leaf">{message}</p>}

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary text-sm !py-2 !px-4">
          <Check size={16} /> {saving ? "Salvando..." : "Salvar conteúdo"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-soft p-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm md:col-span-2">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function PilarEditor({
  pilar,
  onChange,
  onRemove,
}: {
  pilar: Pilar;
  onChange: (p: Pilar) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2 rounded-xl border border-border p-3">
      <div className="grid flex-1 gap-2 md:grid-cols-2">
        <input
          value={pilar.titulo}
          placeholder="Título"
          onChange={(e) => onChange({ ...pilar, titulo: e.target.value })}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          value={pilar.descricao}
          placeholder="Descrição"
          onChange={(e) => onChange({ ...pilar, descricao: e.target.value })}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <button type="button" onClick={onRemove} className="rounded-full p-2 text-destructive hover:bg-destructive/10">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function MenuEditor({
  item,
  onChange,
  onRemove,
}: {
  item: MenuItem;
  onChange: (m: MenuItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        value={item.label}
        placeholder="Rótulo"
        onChange={(e) => onChange({ ...item, label: e.target.value })}
        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
      />
      <input
        value={item.href}
        placeholder="/caminho"
        onChange={(e) => onChange({ ...item, href: e.target.value })}
        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
      />
      <button type="button" onClick={onRemove} className="rounded-full p-2 text-destructive hover:bg-destructive/10">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
