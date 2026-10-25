import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import NewsletterBand from "@/components/NewsletterBand";
import { bySection, getSection, sections, type SectionSlug } from "@/lib/content";

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const section = getSection((await params).slug);
  return section ? { title: section.name, description: section.description } : {};
}

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const section = getSection((await params).slug);
  if (!section) notFound();

  const [lead, ...rest] = bySection(section.slug as SectionSlug);

  return (
    <main>
      <header className="border-b border-stone-200 bg-white">
        <div className="container-x py-10 sm:py-14">
          <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-700 uppercase">Section</p>
          <h1 className="mt-2 font-serif text-5xl font-medium text-ink sm:text-6xl">{section.name}</h1>
          <p className="mt-3 max-w-2xl font-serif text-xl text-ink-soft">{section.description}</p>
        </div>
      </header>

      <section className="container-x py-12 sm:py-16">
        {lead && (
          <div className="mb-14 border-b border-stone-200 pb-14">
            <ArticleCard article={lead} variant="horizontal" />
          </div>
        )}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <NewsletterBand />
    </main>
  );
}
