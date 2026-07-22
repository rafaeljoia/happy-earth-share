import siteData from "@/content/site-data.json";
import matter from "gray-matter";

// Ensure Buffer exists for gray-matter in browser context
if (typeof window !== "undefined" && !(window as unknown as { Buffer?: unknown }).Buffer) {
  (window as unknown as { Buffer: unknown }).Buffer = {
    isBuffer: () => false,
  };
}

export const site = siteData;

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
};

export type Post = PostMeta & { content: string };

// Import all posts as raw strings at build time
const rawPosts = import.meta.glob("/src/content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parsePost(path: string, raw: string): Post {
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  const { data, content } = matter(raw);
  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    cover: data.cover as string | undefined,
    content,
  };
}

export function getAllPosts(): Post[] {
  return Object.entries(rawPosts)
    .map(([path, raw]) => parsePost(path, raw))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
