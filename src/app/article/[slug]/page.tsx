import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import SectionHeading from "@/components/SectionHeading";
import ShareBar from "@/components/ShareBar";
import { articles, formatDate, formatTime, getArticle, sectionName, site } from "@/lib/content";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.dek,
    openGraph: { type: "article", title: article.title, description: article.dek, images: [article.image] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug && (a.section === article.section || a.region === article.region)).slice(0, 3);

  return (
    <main>
      <article>
        <header className="container-x pt-8 sm:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
              <Link href={`/section/${article.section}`} className="text-gold-700 hover:text-navy-900">{sectionName(article.section)}</Link>
              <span className="text-stone-300">/</span>
              <span className="text-ink-muted">{article.kicker}</span>
            </nav>
            <h1 className="mt-5 font-serif text-[2.25rem] leading-[1.08] font-medium tracking-[-0.01em] text-balance text-ink sm:text-5xl lg:text-[3.5rem]">
              {article.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-serif text-xl leading-relaxed text-pretty text-ink-soft sm:text-[1.375rem]">{article.dek}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] text-ink-muted">
              <span className="font-semibold text-ink">{article.author}</span>
              <span className="size-1 rounded-full bg-stone-300" />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}, {formatTime(article.publishedAt)} GMT
              </time>
              <span className="size-1 rounded-full bg-stone-300" />
              <span>{article.readMinutes} min read</span>
            </div>
          </div>
        </header>

        <figure className="container-x mt-10 sm:mt-12">
          <div className="relative -mx-4 aspect-[16/9] overflow-hidden bg-stone-100 sm:mx-0 lg:aspect-[21/9]">
            <Image src={article.image} alt={article.imageAlt} fill priority sizes="(min-width: 1280px) 1280px, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-xs text-ink-muted">{article.imageAlt}. Photo: Unsplash.</figcaption>
        </figure>

        <div className="container-x mt-10 grid gap-10 pb-16 sm:mt-14 lg:grid-cols-12">
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-36">
              <ShareBar title={article.title} />
            </div>
          </aside>
          <div className="prose-article mx-auto w-full max-w-[680px] lg:col-span-8">
            {article.body.map((b, i) =>
              b.type === "h2" ? (
                <h2 key={i}>{b.text}</h2>
              ) : b.type === "quote" ? (
                <blockquote key={i}>{b.text}</blockquote>
              ) : (
                <p key={i}>{b.text}</p>
              )
            )}
            <div className="mt-12 flex items-center gap-4 border-t border-stone-200 pt-6">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <Image src="/images/logo.jpeg" alt="" fill sizes="48px" className="scale-150 object-cover" />
              </span>
              <p className="text-sm text-ink-soft">
                <span className="font-semibold text-ink">{article.author}</span> · {site.name}
                <br />
                {site.tagline}
              </p>
            </div>
          </div>
        </div>
      </article>

      <section className="border-y border-stone-200 bg-stone-50">
        <div className="container-x grid items-center gap-6 py-10 md:grid-cols-2">
          <div>
            <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-700 uppercase">The Daily Brief</p>
            <p className="mt-2 font-serif text-2xl text-navy-900">Africa's decisions, explained — every weekday morning.</p>
          </div>
          <NewsletterForm tone="light" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-14 sm:py-20">
          <SectionHeading title="Continue Reading" />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
