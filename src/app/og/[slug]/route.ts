import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getArticle, getArticles } from "@/lib/data";
import { newestArticle, OG_HEIGHT, OG_WIDTH } from "@/lib/seo";

// Link-preview image for a story: a 1200×630 JPEG cropped from its hero image.
// /og/<slug>?v=… is cached for a year on Vercel's CDN (the version changes when the image does);
// /og/latest is the newest story, used by the homepage.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

async function loadImage(src: string): Promise<Buffer> {
  if (src.startsWith("/")) {
    // Only files inside public/images, never ../ paths.
    const file = path.normalize(path.join(process.cwd(), "public", src));
    if (!file.startsWith(path.join(process.cwd(), "public", "images"))) throw new Error("bad path");
    return readFile(file);
  }
  if (!src.startsWith("https://")) throw new Error("only https images");
  const res = await fetch(src, { signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`image ${res.status}`);
  if (Number(res.headers.get("content-length") || 0) > MAX_SOURCE_BYTES) throw new Error("image too large");
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_SOURCE_BYTES) throw new Error("image too large");
  return buf;
}

const toCard = (input: Buffer) =>
  sharp(input)
    .rotate() // respect phone EXIF orientation
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: sharp.strategy.attention })
    .flatten({ background: "#0a1a31" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = slug === "latest" ? newestArticle(await getArticles()) : await getArticle(slug);

  let body: Buffer;
  let cache = "public, max-age=3600, s-maxage=31536000, immutable";
  try {
    if (!article) throw new Error("not found");
    body = await toCard(await loadImage(article.image));
  } catch {
    // Missing story or unreachable image: fall back to the brand banner, and only cache briefly.
    body = await toCard(await loadImage("/images/banner.jpeg"));
    cache = "public, max-age=300, s-maxage=300";
  }
  if (slug === "latest") cache = "public, max-age=60, s-maxage=60, stale-while-revalidate=600";

  return new Response(new Uint8Array(body), {
    headers: { "Content-Type": "image/jpeg", "Content-Length": String(body.length), "Cache-Control": cache },
  });
}
