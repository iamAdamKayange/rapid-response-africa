import Link from "next/link";
import Logo from "./Logo";
import { XIcon } from "./Icons";
import { sections, site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container-x grid gap-12 py-14 sm:py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm font-serif text-[1.0625rem] leading-relaxed text-white/70">{site.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={site.x.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-sm border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-gold-500 hover:text-gold-400"
            >
              <XIcon className="size-3.5" /> {site.x.handle}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          <div>
            <h3 className="font-display text-[11px] font-semibold tracking-[0.24em] text-gold-400 uppercase">Sections</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {sections.map((s) => (
                <li key={s.slug}>
                  <Link href={`/section/${s.slug}`} className="transition-colors hover:text-white">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-[11px] font-semibold tracking-[0.24em] text-gold-400 uppercase">Regions</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"].map((r) => (
                <li key={r}>
                  <Link href="/section/africa" className="transition-colors hover:text-white">{r}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-[11px] font-semibold tracking-[0.24em] text-gold-400 uppercase">Company</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/about" className="transition-colors hover:text-white">About us</Link></li>
              <li><Link href="/briefings" className="transition-colors hover:text-white">Briefings</Link></li>
              <li><Link href="/#subscribe" className="transition-colors hover:text-white">Newsletter</Link></li>
              <li><Link href="/about#editorial-standards" className="transition-colors hover:text-white">Editorial standards</Link></li>
              <li><Link href="/about#contact" className="transition-colors hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-display tracking-[0.3em] uppercase">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
