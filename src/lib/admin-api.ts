"use client";

// Browser-side client for the panel. The JWT lives in localStorage; a 401 clears it and
// sends the user back to the sign-in page.

export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
const TOKEN_KEY = "rra_token";

export type Role = "admin" | "author";
export type Status = "draft" | "review" | "published";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  bio: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  articleCount?: number;
};

export type AdminArticle = {
  id: number;
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  section: string;
  sectionName: string | null;
  region: string;
  image: string;
  imageAlt: string;
  author: string;
  byline: string | null;
  authorId: number | null;
  authorName: string | null;
  status: Status;
  featured: boolean;
  readMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  body?: string;
};

export type AdminBriefing = {
  id: number;
  title: string;
  summary: string;
  region: string;
  link: string | null;
  published: boolean;
  authorId: number | null;
  authorName: string | null;
  occurredAt: string;
};

export type Subscriber = { id: number; email: string; source: string; createdAt: string };

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: Record<string, string>) {
    super(message);
  }
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (t: string | null) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

export async function api<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  if (!API_URL) throw new ApiError(0, "The API is not configured. Set NEXT_PUBLIC_API_URL and restart the site.");
  const { json, headers, ...rest } = init;
  const token = getToken();

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      ...rest,
      headers: {
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. If it was asleep, wait a few seconds and try again.");
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && path !== "/auth/login") {
      setToken(null);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
        window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    throw new ApiError(res.status, data.error || `Request failed (${res.status})`, data.details);
  }
  return data as T;
}

/** Fetches a protected file (e.g. CSV export) and triggers a download. */
export async function download(path: string, filename: string) {
  const res = await fetch(`${API_URL}/api${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new ApiError(res.status, "Download failed");
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

export const statusLabel: Record<Status, string> = { draft: "Draft", review: "In review", published: "Published" };

export const relative = (iso: string | null) => {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
