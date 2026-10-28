import type { Metadata } from "next";
import { type Article, site } from "./content";

// Link previews (X, Facebook, WhatsApp, LinkedIn, Telegram…) read the og:* and twitter:* tags.
// Declaring the image's exact size and type lets them draw the large card as soon as the link is
// pasted, instead of fetching the image later.

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** The most recently published article (ignores the "lead story" flag the homepage uses). */
export const newestArticle = (articles: Article[]) =>
  [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))[0];

/** Short stable hash, so the card URL (and every platform's cache) changes when the image changes. */
function version(text: string) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** 1200×630 JPEG card image served by app/og/[slug]/route.ts. */
export const socialImage = (article: Article) => `${site.url}/og/${article.slug}?v=${version(article.image)}`;

/** Camera file names ("IMG 4642", "DSC_0012") make poor alt text; use the headline instead. */
const altText = (article: Article) =>
  !article.imageAlt || /^(img|dsc|dcim|image|photo|pxl|screenshot)[\s_-]*\d/i.test(article.imageAlt) ? article.title : article.imageAlt;

/** og:* + twitter:* tags for a story, used by both the homepage (newest story) and article pages. */
export function articlePreview(article: Article, url: string): Pick<Metadata, "openGraph" | "twitter"> {
  const image = { url: socialImage(article), width: OG_WIDTH, height: OG_HEIGHT, type: "image/jpeg", alt: altText(article) };
  return {
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: "en_GB",
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
      creator: site.x.handle,
      title: article.title,
      description: article.dek,
      images: [image],
    },
  };
}
