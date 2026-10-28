import type { Metadata } from "next";
import NewsletterBand from "@/components/NewsletterBand";
import Link from "next/link";
import { briefingTime, safeHref } from "@/lib/content";
import { getBriefings } from "@/lib/data";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Situational Briefings",
  description: "Short, verified situational briefings from across Africa — around the clock.",
};

export default async function BriefingsPage() {
  const briefings = await getBriefings(50);
  return (
    <main>
      <header className="bg-navy-900 text-white">
        <div className="container-x py-12 sm:py-16">
          <p className="flex items-center gap-2 font-display text-[11px] font-semibold tracking-[0.3em] text-gold-400 uppercase">
            <span className="size-1.5 rounded-full bg-gold-500" /> Around the clock
          </p>
          <h1 className="mt-3 font-serif text-5xl font-medium sm:text-6xl">Situational Briefings</h1>
          <p className="mt-3 max-w-2xl font-serif text-xl text-white/70">
            Short, verified updates on diplomacy, governance, business and development — what happened, and why it matters.
          </p>
        </div>
      </header>

      <section className="container-x py-12 sm:py-16">
        <ol className="mx-auto max-w-3xl">
          {briefings.map((b) => (
            <li key={b.id} className="grid grid-cols-[72px_1fr] gap-4 border-b border-stone-200 py-7 sm:grid-cols-[120px_1fr] sm:gap-8">
              <div>
                <p className="font-serif text-lg text-navy-900 sm:text-xl">{briefingTime(b.occurredAt)}</p>
                <p className="mt-1 text-[11px] font-semibold tracking-wider text-gold-700 uppercase">{b.region}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-ink">{b.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{b.summary}</p>
                {safeHref(b.link) && (
                  <Link href={safeHref(b.link)!} className="mt-3 inline-block text-[13px] font-medium text-gold-700 hover:text-navy-900">
                    Read the analysis →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <NewsletterBand />
    </main>
  );
}
