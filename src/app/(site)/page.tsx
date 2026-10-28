import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import BriefTicker from "@/components/BriefTicker";
import DailyBrief from "@/components/DailyBrief";
import NewsletterBand from "@/components/NewsletterBand";
import SectionHeading from "@/components/SectionHeading";
import { ClockIcon } from "@/components/Icons";
import type { Metadata } from "next";
import { briefingTime, canOptimizeImage, inSection, type SectionSlug, sectionName, site } from "@/lib/content";
import { getArticles, getBriefings } from "@/lib/data";
import { articlePreview, newestArticle } from "@/lib/seo";

export const revalidate = 30;

/** Sharing the homepage shows the newest story's headline and hero image. */
export async function generateMetadata(): Promise<Metadata> {
  const latest = newestArticle(await getArticles());
  if (!latest) return {};
  return { alternates: { canonical: "/" }, ...articlePreview(latest, site.url) };
}

const regions = ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"] as const;

export default async function Home() {
  const [articles, briefings] = await Promise.all([getArticles(), getBriefings(6)]);
  const [lead, ...rest] = articles;
  const latest = rest.slice(0, 3);
  const inDepth = rest.slice(3, 7);
  const mostRead = (rest.length > 11 ? rest.slice(7, 12) : rest.slice(0, 5));
  const regional = regions.map((r) => articles.find((a) => a.region === r)).filter((a) => a !== undefined);
  const featured = new Set([lead, ...latest, ...inDepth].map((a) => a.slug));
  const desks: SectionSlug[] = ["governance", "business", "development"];

  return (
    <main>
      <BriefTicker items={["Africa's decisions. Explained.", ...articles.slice(0, 5).map((a) => a.title)]} />

      {/* Hero */}
      <section className="container-x pt-6 pb-12 sm:pt-10 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Link href={`/article/${lead.slug}`} className="group contents">
            <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-4 lg:pr-2">
              <span className="kicker">{lead.kicker}</span>
              <h1 className="mt-3 font-serif text-[2.25rem] leading-[1.08] font-medium tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.25rem]">
                <span className="headline-link">{lead.title}</span>
              </h1>
              <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft sm:text-xl">{lead.dek}</p>
              <p className="mt-5 flex items-center gap-2 text-xs text-ink-muted">
                <span className="font-medium text-ink">{lead.author}</span>
                <span className="size-1 rounded-full bg-stone-300" />
                <ClockIcon /> {lead.readMinutes} min read
              </p>
            </div>
            <div className="relative order-1 -mx-4 aspect-[16/10] overflow-hidden bg-stone-100 sm:mx-0 lg:order-2 lg:col-span-5 lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={lead.image}
                unoptimized={!canOptimizeImage(lead.image)}
                alt={lead.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover transition duration-[1.2s] group-hover:scale-[1.03]"
              />
            </div>
          </Link>
          <div className="order-3 lg:col-span-3">
            <DailyBrief items={briefings.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* Latest analysis */}
      <section className="container-x pb-14 sm:pb-20">
        <SectionHeading title="Latest Analysis" href="/section/policy" />
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a, i) => (
            <div key={a.slug} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <ArticleCard article={a} />
            </div>
          ))}
        </div>
      </section>

      {/* In depth + sidebar */}
      <section className="border-y border-stone-200 bg-white">
        <div className="container-x grid gap-14 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <SectionHeading title="In Depth" href="/section/development" />
            <div className="space-y-10 divide-stone-200">
              {inDepth.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="horizontal" />
              ))}
            </div>
          </div>

          <div className="space-y-14 lg:col-span-4">
            <div>
              <SectionHeading title="Most Read" />
              <ol className="space-y-5">
                {mostRead.map((a, i) => (
                  <li key={a.slug} className="border-b border-stone-200 pb-5 last:border-0">
                    <Link href={`/article/${a.slug}`} className="group flex gap-4">
                      <span className="font-serif text-4xl leading-none font-light text-gold-500">{i + 1}</span>
                      <span>
                        <span className="kicker">{a.kicker}</span>
                        <span className="mt-1 block font-serif text-[1.0625rem] leading-snug text-ink group-hover:text-navy-700">
                          <span className="headline-link">{a.title}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <SectionHeading title="Situational Briefings" href="/briefings" />
              <ol className="relative space-y-6 border-l border-stone-200 pl-6">
                {briefings.slice(0, 4).map((b) => (
                  <li key={b.id} className="relative">
                    <span className="absolute top-1.5 -left-[29px] size-2.5 rounded-full border-2 border-white bg-gold-500 ring-1 ring-gold-500" />
                    <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
                      <span className="text-navy-900">{briefingTime(b.occurredAt)}</span> · {b.region}
                    </p>
                    <p className="mt-1 font-serif text-[1.0625rem] font-medium text-ink">{b.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{b.summary}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Across the continent */}
      <section className="py-14 sm:py-20">
        <div className="container-x">
          <SectionHeading title="Across the Continent" href="/section/africa" />
        </div>
        <div className="container-x">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
            {regional.map((a) => (
              <div key={a.slug} className="w-[72%] shrink-0 snap-start sm:w-auto">
                <ArticleCard article={a} variant="overlay" sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 75vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desks */}
      <section className="container-x pb-14 sm:pb-20">
        <div className="grid gap-14 md:grid-cols-3 md:gap-8">
          {desks.map((slug) => {
            const [first, ...others] = inSection(articles, slug).filter((a) => !featured.has(a.slug));
            if (!first) return null;
            return (
              <div key={slug}>
                <SectionHeading title={sectionName(slug)} href={`/section/${slug}`} linkLabel="More" />
                <ArticleCard article={first} sizes="(min-width: 768px) 33vw, 100vw" />
                <div className="mt-7 space-y-5 border-t border-stone-200 pt-6">
                  {others.slice(0, 2).map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="compact" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission statement */}
      <section className="border-t border-stone-200 bg-stone-50">
        <div className="container-x grid gap-8 py-14 sm:py-20 lg:grid-cols-12">
          <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-700 uppercase lg:col-span-3">Our promise</p>
          <blockquote className="font-serif text-2xl leading-snug text-navy-900 sm:text-[2rem] lg:col-span-9">
            “Verified news, policy clarity and situational briefings — so that decisions made across Africa are understood
            across Africa, and beyond.”
            <footer className="mt-6 flex items-center gap-3 font-sans text-sm text-ink-muted not-italic">
              <span className="h-px w-8 bg-gold-500" /> The editors
            </footer>
          </blockquote>
        </div>
      </section>

      <NewsletterBand />
    </main>
  );
}
