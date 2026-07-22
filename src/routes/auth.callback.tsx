import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Entrando — ONG Viver Feliz" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = 0;

    async function finish() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const oauthError = url.searchParams.get("error_description") || url.searchParams.get("error");

        if (oauthError) {
          if (!cancelled) setError(oauthError);
          return;
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            if (!cancelled) setError(exchangeError.message);
            return;
          }
        } else {
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            if (!cancelled) setError(sessionError.message);
            return;
          }
          if (!data.session) {
            timeoutId = window.setTimeout(() => {
              if (!cancelled) setError("Não foi possível concluir o login. Tente novamente.");
            }, 8000);
            return;
          }
        }

        if (!cancelled) {
          window.location.replace("/#depoimentos");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Falha ao autenticar.");
        }
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        window.location.replace("/#depoimentos");
      }
    });

    finish();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[55vh] max-w-md items-center justify-center px-4 py-16 text-center">
        {error ? (
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Login não concluído</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{error}</p>
            <a href="/#depoimentos" className="btn-primary mt-8 inline-flex">
              Voltar aos depoimentos
            </a>
          </div>
        ) : (
          <p className="text-muted-foreground">Concluindo login com Google...</p>
        )}
      </main>
      <Footer />
    </>
  );
}
