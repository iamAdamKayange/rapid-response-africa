import Image from "next/image";
import Link from "next/link";
import { type Article, formatDate } from "@/lib/content";

type Variant = "standard" | "horizontal" | "compact" | "overlay";

export default function ArticleCard({
  article,
  variant = "standard",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  article: Article;
  variant?: Variant;
  priority?: boolean;
  sizes?: string;
}) {
  const href = `/article/${article.slug}`;

  if (variant === "overlay") {
    return (
      <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-navy-900 sm:aspect-[3/4]">
        <Image src={article.image} alt={article.imageAlt} fill sizes={sizes} className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-gold-400 uppercase">{article.region}</span>
          <h3 className="mt-2 font-serif text-xl leading-snug text-white sm:text-[1.375rem]">
            <span className="headline-link">{article.title}</span>
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-4">
        <div className="relative aspect-square w-20 shrink-0 overflow-hidden bg-stone-100 sm:w-24">
          <Image src={article.image} alt={article.imageAlt} fill sizes="96px" className="object-cover transition duration-700 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <span className="kicker">{article.kicker}</span>
          <h3 className="mt-1 font-serif text-[1.0625rem] leading-snug text-ink group-hover:text-navy-700">
            <span className="headline-link">{article.title}</span>
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={href} className="group grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-7">
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <Image src={article.image} alt={article.imageAlt} fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="kicker">{article.kicker}</span>
          <h3 className="mt-2 font-serif text-[1.375rem] leading-snug text-ink sm:text-2xl">
            <span className="headline-link">{article.title}</span>
          </h3>
          <p className="mt-2 font-serif text-[1.0625rem] leading-relaxed text-ink-soft">{article.dek}</p>
          <p className="mt-3 text-xs text-ink-muted">
            {article.author} · {formatDate(article.publishedAt)} · {article.readMinutes} min read
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <Image src={article.image} alt={article.imageAlt} fill priority={priority} sizes={sizes} className="object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <span className="kicker mt-4 block">{article.kicker}</span>
      <h3 className="mt-2 font-serif text-[1.375rem] leading-snug text-ink">
        <span className="headline-link">{article.title}</span>
      </h3>
      <p className="mt-2 font-serif text-[1.0625rem] leading-relaxed text-ink-soft">{article.dek}</p>
    </Link>
  );
}
