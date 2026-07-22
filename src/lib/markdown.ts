import { marked } from "marked";

// Convert bare YouTube URLs (on their own line) into embed iframes.
function embedYouTube(md: string): string {
  const ytRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})[^\s]*$/gm;
  return md.replace(ytRegex, (_, id) =>
    `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
  );
}

export function renderMarkdown(md: string): string {
  const withEmbeds = embedYouTube(md);
  return marked.parse(withEmbeds, { async: false }) as string;
}
