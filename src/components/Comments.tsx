import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Send, Trash2 } from "lucide-react";

type Comment = {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  created_at: string;
};

export function Comments() {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setComments((data ?? []) as Comment[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError("Não foi possível entrar com o Google. Tente novamente.");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSending(true);
    setError(null);
    const name =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      user.email ||
      "Anônimo";
    const avatar =
      (user.user_metadata?.avatar_url as string) ||
      (user.user_metadata?.picture as string) ||
      null;
    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      author_name: name,
      author_avatar: avatar,
      content: text.trim().slice(0, 1000),
    });
    setSending(false);
    if (error) {
      setError("Não foi possível enviar seu recado.");
      return;
    }
    setText("");
    load();
  }

  async function remove(id: string) {
    await supabase.from("comments").delete().eq("id", id);
    setComments((c) => c.filter((x) => x.id !== id));
  }

  return (
    <section id="depoimentos" className="section-band section-band-soft">
      <div className="mx-auto max-w-4xl px-4 py-20 md:py-24">
      <div className="text-center">
        <div className="chip bg-card text-secondary-foreground">Depoimentos</div>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          Recados da comunidade
        </h2>
        <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted-foreground">
          Deixe uma palavra de carinho, um agradecimento ou uma história — nós lemos com o coração.
        </p>
      </div>

      <div className="card-soft mt-10 p-6 md:p-8">
        {loading ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        ) : user ? (
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url as string}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-secondary" />
              )}
              <div className="text-sm">
                <div className="font-semibold">
                  {(user.user_metadata?.full_name as string) || user.email}
                </div>
                <button
                  type="button"
                  onClick={() => supabase.auth.signOut()}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sair
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 1000))}
              placeholder="Deixe seu recado com carinho..."
              rows={3}
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
              required
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{text.length}/1000</span>
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="btn-primary text-sm !px-4 !py-2 disabled:opacity-50"
              >
                <Send size={15} /> {sending ? "Enviando..." : "Publicar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Para deixar um recado, entre com sua conta do Google.
            </p>
            <button onClick={handleGoogle} className="btn-leaf">
              <LogIn size={17} /> Fazer login com o Google para comentar
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <ul className="mt-8 space-y-3">
        {comments.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            Seja a primeira pessoa a deixar um recado.
          </li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="card-soft flex gap-3.5 p-4 md:p-5">
            {c.author_avatar ? (
              <img
                src={c.author_avatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-full bg-secondary" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">{c.author_name}</div>
                <time className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </time>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/80">
                {c.content}
              </p>
            </div>
            {user?.id === c.user_id && (
              <button
                onClick={() => remove(c.id)}
                className="self-start rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="Excluir recado"
              >
                <Trash2 size={15} />
              </button>
            )}
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
