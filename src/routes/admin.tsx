import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogAdmin } from "@/components/admin/CatalogAdmin";
import { SiteAdmin } from "@/components/admin/SiteAdmin";
import { PostsAdmin } from "@/components/admin/PostsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FileText, LayoutTemplate, LogOut, Package } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel da equipe — ONG Viver Feliz" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "catalogo" | "institucional" | "blog";

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

  if (!user)
    return (
      <>
        <Header />
        <LoginForm />
        <Footer />
      </>
    );
  if (!isAdmin)
    return (
      <>
        <Header />
        <NoAccess email={user.email ?? ""} />
        <Footer />
      </>
    );

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
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin + "/admin" },
          });
    const { error } = await fn;
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <div className="card-soft w-full p-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Área da equipe</h1>
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
        <h1 className="font-display text-xl font-semibold tracking-tight">Acesso pendente</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Você está logado como <b>{email}</b>, mas ainda não tem permissão de administrador. Peça para um
          administrador da ONG liberar seu acesso.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="btn-leaf mt-6">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </main>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<Tab>("catalogo");

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "catalogo", label: "Catálogo", icon: Package },
    { id: "institucional", label: "Institucional", icon: LayoutTemplate },
    { id: "blog", label: "Blog", icon: FileText },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Painel da equipe</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie catálogo, textos do site e posts — alterações aparecem na hora.
          </p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="btn-leaf text-sm !py-2 !px-4">
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === id ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "catalogo" && <CatalogAdmin />}
        {tab === "institucional" && <SiteAdmin />}
        {tab === "blog" && <PostsAdmin />}
      </div>
    </main>
  );
}
