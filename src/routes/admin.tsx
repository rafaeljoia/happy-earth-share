import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Plus, Pencil, Trash2, Upload, X, Check } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel da equipe — ONG Viver Feliz" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Item = {
  id: string;
  tipo: "planta" | "artesanato";
  nome: string;
  descricao: string;
  foto_url: string | null;
  preco: string;
  status: "disponivel" | "vendido";
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-4 py-16 text-center">Carregando...</main>
        <Footer />
      </>
    );
  }

  if (!user) return <><Header /><LoginForm /><Footer /></>;
  if (!isAdmin) return <><Header /><NoAccess email={user.email ?? ""} /><Footer /></>;

  return (
    <>
      <Header />
      <Dashboard />
      <Footer />
    </>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fn =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    const { error } = await fn;
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <div className="card-soft w-full p-8">
        <h1 className="font-display text-2xl font-bold">Área da equipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Entre com suas credenciais." : "Crie sua conta de voluntário(a)."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Não tem conta? Cadastrar" : "Já tem conta? Entrar"}
        </button>
        <p className="mt-6 text-xs text-muted-foreground">
          A primeira pessoa a se cadastrar vira administrador automaticamente. Depois disso, novas contas
          precisam ser promovidas por um admin.
        </p>
      </div>
    </main>
  );
}

function NoAccess({ email }: { email: string }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <div className="card-soft w-full p-8 text-center">
        <h1 className="font-display text-xl font-bold">Acesso pendente</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Você está logado como <b>{email}</b>, mas ainda não tem permissão de administrador.
          Peça para um administrador da ONG liberar seu acesso.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="btn-leaf mt-6">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </main>
  );
}

function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("catalog_items")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Item[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm("Excluir este item?")) return;
    await supabase.from("catalog_items").delete().eq("id", id);
    load();
  }

  async function toggleStatus(item: Item) {
    const newStatus = item.status === "disponivel" ? "vendido" : "disponivel";
    await supabase.from("catalog_items").update({ status: newStatus }).eq("id", item.id);
    load();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Painel da equipe</h1>
          <p className="text-sm text-muted-foreground">Gerencie o catálogo de plantas e artesanatos.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCreating(true)} className="btn-primary text-sm !py-2 !px-4">
            <Plus size={16} /> Novo item
          </button>
          <button onClick={() => supabase.auth.signOut()} className="btn-leaf text-sm !py-2 !px-4">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      {(creating || editing) && (
        <ItemForm
          initial={editing ?? undefined}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}

      {loading ? (
        <p className="mt-8 text-muted-foreground">Carregando...</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-3">Foto</th>
                <th className="p-3">Nome</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Preço</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-border">
                  <td className="p-3">
                    {it.foto_url ? (
                      <img src={it.foto_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted" />
                    )}
                  </td>
                  <td className="p-3 font-medium">{it.nome}</td>
                  <td className="p-3 capitalize">{it.tipo}</td>
                  <td className="p-3">{it.preco}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleStatus(it)}
                      className={`chip ${it.status === "disponivel" ? "bg-leaf text-white" : "bg-foreground text-background"}`}
                    >
                      {it.status === "disponivel" ? "Disponível" : "Vendido"}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(it)} className="rounded-full p-2 hover:bg-secondary">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => del(it.id)} className="rounded-full p-2 text-destructive hover:bg-destructive/10">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function ItemForm({ initial, onClose, onSaved }: { initial?: Item; onClose: () => void; onSaved: () => void }) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [tipo, setTipo] = useState<"planta" | "artesanato">(initial?.tipo ?? "planta");
  const [preco, setPreco] = useState(initial?.preco ?? "R$ ");
  const [status, setStatus] = useState<"disponivel" | "vendido">(initial?.status ?? "disponivel");
  const [fotoUrl, setFotoUrl] = useState(initial?.foto_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("catalog-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) {
      setError("Falha no upload da imagem.");
      setUploading(false);
      return;
    }
    const { data } = await supabase.storage.from("catalog-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    if (data?.signedUrl) setFotoUrl(data.signedUrl);
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { nome, descricao, tipo, preco, status, foto_url: fotoUrl || null };
    const res = initial
      ? await supabase.from("catalog_items").update(payload).eq("id", initial.id)
      : await supabase.from("catalog_items").insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    onSaved();
  }

  return (
    <div className="card-soft mt-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          {initial ? "Editar item" : "Novo item"}
        </h2>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary"><X size={18} /></button>
      </div>
      <form onSubmit={save} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} required
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value as never)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
            <option value="planta">Planta</option>
            <option value="artesanato">Artesanato</option>
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          Descrição
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3}
            className="mt-1 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Preço (ou "Doação")
          <input value={preco} onChange={(e) => setPreco(e.target.value)} required
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as never)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
            <option value="disponivel">Disponível</option>
            <option value="vendido">Vendido</option>
          </select>
        </label>
        <div className="text-sm md:col-span-2">
          <div>Foto</div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {fotoUrl && <img src={fotoUrl} alt="" className="h-20 w-20 rounded-xl object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 text-sm hover:bg-secondary">
              <Upload size={16} /> {uploading ? "Enviando..." : "Enviar imagem"}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>
            <input
              type="url"
              placeholder="ou cole uma URL"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn-primary text-sm !py-2 !px-4">
            <Check size={16} /> {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
