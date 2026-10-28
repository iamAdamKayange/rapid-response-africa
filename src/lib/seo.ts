import type { Metadata } from "next";
import { type Article, site } from "./content";

// Link previews (X/Twitter, WhatsApp, Facebook, LinkedIn…) read the og:* and twitter:* tags.

/** The most recently published article (ignores the "lead story" flag the homepage uses). */
export const newestArticle = (articles: Article[]) =>
  [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))[0];

/**
 * A preview-friendly image URL: absolute, and resized to 1200px wide through Next's image optimizer,
 * so uploads of up to 10 MB stay under X's 5 MB card limit.
 */
export function socialImage(src: string) {
  const absolute = new URL(src, site.url).toString();
  return `${site.url}/_next/image?url=${encodeURIComponent(absolute)}&w=1200&q=80`;
}

/** og:* + twitter:* tags for a story, used by both the homepage (newest story) and article pages. */
export function articlePreview(article: Article, url: string): Pick<Metadata, "openGraph" | "twitter"> {
  const image = { url: socialImage(article.image), width: 1200, alt: article.imageAlt || article.title };
  return {
    openGraph: {
      type: "article",
      siteName: site.name,
      url,
      title: article.title,
      description: article.dek,
      images: [image],
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      site: site.x.handle,
      title: article.title,
      description: article.dek,
      images: [image],
    },
  };
}
