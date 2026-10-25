import type { Metadata } from "next";
import NewsletterBand from "@/components/NewsletterBand";
import { briefings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Situational Briefings",
  description: "Short, verified situational briefings from across Africa — around the clock.",
};

export default function BriefingsPage() {
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
          {briefings.map((b, i) => (
            <li key={i} className="grid grid-cols-[72px_1fr] gap-4 border-b border-stone-200 py-7 sm:grid-cols-[120px_1fr] sm:gap-8">
              <div>
                <p className="font-serif text-xl text-navy-900 sm:text-2xl">{b.time}</p>
                <p className="mt-1 text-[11px] font-semibold tracking-wider text-gold-700 uppercase">{b.region}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-ink">{b.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{b.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <NewsletterBand />
    </main>
  );
}
