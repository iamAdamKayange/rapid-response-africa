import "server-only";
import {
  type Article,
  type Briefing,
  fallbackArticles,
  fallbackBriefings,
  parseBody,
  type Region,
  type SectionSlug,
} from "./content";

// Server-side data access. Reads from the Node API when NEXT_PUBLIC_API_URL is set and
// falls back to the built-in content when it is not (or the API is asleep/unreachable),
// so the public site never goes blank.

export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
export const REVALIDATE_SECONDS = 30;

type ApiArticle = {
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  section: string;
  region: string;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string | null;
  readMinutes: number;
  body?: string;
};

const NOT_FOUND = Symbol("not-found");

async function apiGet<T>(path: string): Promise<T | typeof NOT_FOUND | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 404) return NOT_FOUND;
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const toArticle = (a: ApiArticle): Article => ({
  slug: a.slug,
  title: a.title,
  dek: a.dek,
  kicker: a.kicker || "Analysis",
  section: a.section as SectionSlug,
  region: (a.region || "Continental") as Region,
  image: a.image || "/images/banner.jpeg",
  imageAlt: a.imageAlt || a.title,
  author: a.author,
  publishedAt: a.publishedAt || new Date().toISOString(),
  readMinutes: a.readMinutes,
  body: a.body ? parseBody(a.body) : [],
});

/** All published articles, newest first (featured article first). Bodies are not included. */
export async function getArticles(): Promise<Article[]> {
  const data = await apiGet<{ articles: ApiArticle[] }>("/articles?limit=100");
  if (data && data !== NOT_FOUND && data.articles.length) return data.articles.map(toArticle);
  return fallbackArticles;
}

export async function getArticle(slug: string): Promise<Article | null> {
  const data = await apiGet<{ article: ApiArticle }>(`/articles/${encodeURIComponent(slug)}`);
  if (data === NOT_FOUND) return fallbackArticles.find((a) => a.slug === slug) ?? null;
  if (data) return toArticle(data.article);
  return fallbackArticles.find((a) => a.slug === slug) ?? null;
}

export async function getBriefings(limit = 20): Promise<Briefing[]> {
  const data = await apiGet<{ briefings: Briefing[] }>(`/briefings?limit=${limit}`);
  if (data && data !== NOT_FOUND && data.briefings.length) return data.briefings;
  return fallbackBriefings.slice(0, limit);
}
