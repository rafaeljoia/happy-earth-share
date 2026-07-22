import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAllPosts } from "@/lib/site-content";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — ONG Viver Feliz" },
      { name: "description", content: "Notícias, histórias e novidades da ONG Viver Feliz." },
      { property: "og:title", content: "Blog — ONG Viver Feliz" },
      { property: "og:description", content: "Acompanhe mutirões, oficinas e histórias das famílias atendidas." },
    ],
  }),
  loader: async () => ({ posts: await getAllPosts() }),
  component: BlogList,
});

function BlogList() {
  const { posts } = Route.useLoaderData();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="chip bg-primary/25 text-primary-foreground">Blog</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Histórias que florescem
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Registros do nosso dia a dia: mutirões, oficinas, encontros e as pessoas que fazem tudo acontecer.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: { slug: string; title: string; date: string; excerpt: string; cover?: string }) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="card-soft group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-14px_oklch(0.4_0.02_60_/0.14)]"
            >
              {post.cover && (
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={post.cover}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <time className="text-xs tracking-wide text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </time>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <span className="mt-5 text-sm font-semibold text-leaf transition-colors group-hover:text-foreground">
                  Ler mais →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
