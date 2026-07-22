import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAllPosts, slugify, uploadSiteMedia, type Post } from "@/lib/site-content";
import { Check, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

export function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setPosts(await getAllPosts({ includeDrafts: true }));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function del(id: string | undefined) {
    if (!id || !confirm("Excluir este post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Crie e edite notícias do blog. Publicação imediata, sem deploy.</p>
        <button onClick={() => setCreating(true)} className="btn-primary text-sm !py-2 !px-4">
          <Plus size={16} /> Novo post
        </button>
      </div>

      {(creating || editing) && (
        <PostForm
          initial={editing ?? undefined}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            load();
          }}
        />
      )}

      {loading ? (
        <p className="mt-8 text-muted-foreground">Carregando...</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Nenhum post ainda.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-3">Capa</th>
                <th className="p-3">Título</th>
                <th className="p-3">Data</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id ?? post.slug} className="border-t border-border">
                  <td className="p-3">
                    {post.cover ? (
                      <img src={post.cover} alt="" className="h-12 w-16 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-16 rounded-lg bg-muted" />
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">/{post.slug}</div>
                  </td>
                  <td className="p-3">{post.date}</td>
                  <td className="p-3">
                    <span className={`chip ${post.published ? "bg-leaf text-white" : "bg-muted text-muted-foreground"}`}>
                      {post.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(post)} className="rounded-full p-2 hover:bg-secondary">
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => del(post.id)}
                        className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                      >
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
    </div>
  );
}

function PostForm({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Post;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    const { url, error: upErr } = await uploadSiteMedia(file);
    setUploading(false);
    if (upErr || !url) {
      setError(upErr ?? "Falha no upload da imagem.");
      return;
    }
    setCover(url);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title,
      slug: slug || slugify(title),
      date,
      excerpt,
      cover: cover || null,
      content,
      published,
    };
    const res = initial?.id
      ? await supabase.from("posts").update(payload).eq("id", initial.id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="card-soft mt-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{initial ? "Editar post" : "Novo post"}</h2>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary">
          <X size={18} />
        </button>
      </div>
      <form onSubmit={save} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm md:col-span-2">
          Título
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          Slug (URL)
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            required
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          Data
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm md:col-span-2">
          Resumo
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={2}
            className="mt-1 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <div className="text-sm md:col-span-2">
          <div>Imagem de capa</div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {cover && <img src={cover} alt="" className="h-20 w-28 rounded-xl object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 text-sm hover:bg-secondary">
              <Upload size={16} /> {uploading ? "Enviando..." : "Enviar imagem"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
            <input
              type="url"
              placeholder="ou cole uma URL"
              value={cover ?? ""}
              onChange={(e) => setCover(e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <label className="text-sm md:col-span-2">
          Conteúdo (Markdown)
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Publicado (visível no blog)
        </label>
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
