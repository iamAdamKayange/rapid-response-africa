import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { XIcon } from "@/components/Icons";
import NewsletterBand from "@/components/NewsletterBand";
import SocialLinks from "@/components/SocialLinks";
import { sections, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
  description: site.description,
};

const standards = [
  { title: "Verified first", text: "We confirm before we publish. Speed matters, but accuracy matters more." },
  { title: "Context over noise", text: "Every story answers three questions: what was decided, who decides next, and what it means." },
  { title: "Independent", text: "Our analysis is shaped by evidence and our readers — not by those we cover." },
  { title: "Corrections in the open", text: "When we get something wrong, we say so clearly and fix it promptly." },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-navy-900">
        <div className="relative aspect-[3/1] w-full min-h-[220px] sm:min-h-0">
          <Image src="/images/banner.jpeg" alt={`${site.name} — ${site.tagline}`} fill priority sizes="100vw" className="object-cover" />
        </div>
      </section>

      <section className="container-x grid gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-700 uppercase">About us</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight font-medium text-ink sm:text-5xl">
            Africa. In context.
          </h1>
          <div className="prose-article mt-8">
            <p>
              {site.name} is a {site.category.toLowerCase()} delivering verified news, policy clarity and situational briefings on
              diplomacy, governance, business and development — around the clock, across Africa.
            </p>
            <p>
              We exist for readers who need to understand not only what happened, but why it matters: policymakers, diplomats,
              investors, researchers, journalists and engaged citizens across the continent and beyond.
            </p>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border border-stone-200 bg-white p-7">
            <h2 className="section-label">Company details</h2>
            <dl className="mt-6 space-y-4 text-[15px]">
              {[
                ["Name", site.name],
                ["Category", site.category],
                ["Coverage", site.location],
                ["Focus", "Diplomacy · Governance · Business · Development"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[96px_1fr] gap-3 border-b border-stone-100 pb-4">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-stone-100 pb-4">
                <dt className="text-ink-muted">Website</dt>
                <dd><a href={site.url} className="text-gold-700 hover:underline">{new URL(site.url).host}</a></dd>
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-3">
                <dt className="text-ink-muted">Socials</dt>
                <dd>
                  <p className="mb-3 font-medium text-ink">{site.x.handle} on every platform</p>
                  <SocialLinks variant="light" />
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>

      <section id="editorial-standards" className="scroll-mt-28 border-y border-stone-200 bg-white">
        <div className="container-x py-14 sm:py-20">
          <h2 className="section-label border-t border-ink pt-4">Editorial standards</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {standards.map((s, i) => (
              <div key={s.title}>
                <span className="font-serif text-4xl font-light text-gold-500">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-xl text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <h2 className="section-label border-t border-ink pt-4">What we cover</h2>
        <ul className="mt-8 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <li key={s.slug} className="bg-paper">
              <Link href={`/section/${s.slug}`} className="group block h-full p-7 transition-colors hover:bg-white">
                <h3 className="font-serif text-2xl text-ink group-hover:text-navy-700">{s.name} <span className="text-gold-500 transition-transform group-hover:translate-x-1">→</span></h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="scroll-mt-28 container-x pb-14 sm:pb-20">
        <div className="grid gap-6 bg-stone-50 p-8 sm:p-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-ink">Get in touch</h2>
            <p className="mt-2 text-ink-soft">Tips, corrections, partnerships and press enquiries.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a href={site.x.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-navy-900 px-6 py-3 text-sm font-medium text-white hover:bg-navy-800">
              <XIcon className="size-3.5" /> Message {site.x.handle}
            </a>
            <a href={site.url} className="inline-flex items-center rounded-sm border border-navy-900 px-6 py-3 text-sm font-medium text-navy-900 hover:bg-navy-900 hover:text-white">
              {new URL(site.url).host}
            </a>
          </div>
        </div>
      </section>

      <NewsletterBand />
    </main>
  );
}
