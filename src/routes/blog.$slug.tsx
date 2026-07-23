import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPostBySlug } from "@/lib/site-content";
import { renderMarkdown } from "@/lib/markdown";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => {
    const post = (loaderData as { post?: { title: string; excerpt: string; cover?: string } } | undefined)?.post;
    if (!post) {
      return { meta: [{ title: "Post não encontrado" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${post.title} — ONG Viver Feliz` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        ...(post.cover ? [
          { property: "og:image", content: post.cover },
          { name: "twitter:image", content: post.cover },
        ] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const post = await getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const html = renderMarkdown(post.content);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Todos os posts
        </Link>

        <article className="mt-8">
          <time className="text-sm tracking-wide text-muted-foreground">
            {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </time>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
            {post.title}
          </h1>

          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              className="mt-8 aspect-[16/9] w-full rounded-xl object-cover"
            />
          )}

          <div
            className="prose-post mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
