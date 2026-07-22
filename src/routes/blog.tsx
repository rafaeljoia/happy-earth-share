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
  loader: () => ({ posts: getAllPosts() }),
  component: BlogList,
});

function BlogList() {
  const { posts } = Route.useLoaderData();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <div className="chip bg-primary/30 text-primary-foreground">Blog</div>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Histórias que florescem</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Registros do nosso dia a dia: mutirões, oficinas, encontros e as pessoas que fazem tudo acontecer.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: { slug: string; title: string; date: string; excerpt: string; cover?: string }) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="card-soft group flex flex-col overflow-hidden transition hover:-translate-y-1"
            >
              {post.cover && (
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={post.cover}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <time className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </time>
                <h2 className="mt-1 font-display text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-leaf">Ler mais →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
