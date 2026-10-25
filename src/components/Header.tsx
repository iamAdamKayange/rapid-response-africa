"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Logo from "./Logo";
import { CloseIcon, MenuIcon, SearchIcon, ArrowIcon } from "./Icons";
import SocialLinks from "./SocialLinks";
import { navItems, site } from "@/lib/content";

type SearchEntry = { slug: string; title: string; kicker: string; dek: string };

function Today() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(
      new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())
    );
  }, []);
  return <span suppressHydrationWarning>{label}</span>;
}

export default function Header({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 5);
    return searchIndex.filter((a) => `${a.title} ${a.kicker} ${a.dek}`.toLowerCase().includes(q)).slice(0, 8);
  }, [query, searchIndex]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Utility bar */}
      <div className="hidden bg-navy-950 text-[12px] text-white/60 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <div className="flex items-center gap-4">
            <Today />
            <span className="h-3 w-px bg-white/20" />
            <span className="flex items-center gap-2">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-gold-500" />
              </span>
              Around the clock in Africa
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/about" className="transition-colors hover:text-white">About</Link>
            <Link href="/briefings" className="transition-colors hover:text-white">Briefings</Link>
            <span className="h-3 w-px bg-white/20" />
            <SocialLinks variant="bar" />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40">
        {/* Masthead */}
        <div className={`bg-navy-900 transition-shadow ${scrolled ? "shadow-[0_8px_30px_-12px_rgba(6,15,31,0.6)]" : ""}`}>
          <div className={`container-x flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "h-16" : "h-[72px] lg:h-24"}`}>
            <Logo compact={scrolled} />
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex size-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/5 hover:text-gold-400"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
              <Link
                href="/#subscribe"
                className="hidden rounded-sm border border-gold-500 px-5 py-2 text-[13px] font-medium tracking-wide text-gold-400 transition-colors hover:bg-gold-500 hover:text-navy-900 sm:inline-flex"
              >
                Subscribe
              </Link>
              <button
                onClick={() => setMenuOpen(true)}
                className="flex size-10 items-center justify-center text-white lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Section nav */}
        <nav aria-label="Sections" className="hidden border-b border-stone-200 bg-white/95 backdrop-blur lg:block">
          <ul className="container-x flex h-12 items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative inline-flex h-12 items-center px-4 text-[14px] transition-colors first:pl-0 ${
                    isActive(item.href) ? "font-semibold text-navy-900" : "text-ink-soft hover:text-navy-900"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-4 bottom-0 h-0.5 bg-gold-500 transition-transform duration-300 ${
                      isActive(item.href) ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-navy-900 text-white transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
            <span className="font-display text-[11px] tracking-[0.3em] text-gold-400 uppercase">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="flex size-10 items-center justify-center" aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-4">
            <ul>
              {navItems.map((item, i) => (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between py-4 font-serif text-[1.375rem] transition-colors ${
                      isActive(item.href) ? "text-gold-400" : "text-white hover:text-gold-300"
                    }`}
                    style={{ transitionDelay: menuOpen ? `${i * 30}ms` : "0ms" }}
                  >
                    {item.label}
                    <ArrowIcon className="size-4 text-white/30" />
                  </Link>
                </li>
              ))}
              <li className="border-b border-white/10">
                <Link href="/about" className="flex items-center justify-between py-4 font-serif text-[1.375rem] text-white">
                  About us <ArrowIcon className="size-4 text-white/30" />
                </Link>
              </li>
            </ul>
          </nav>
          <div className="space-y-3 border-t border-white/10 p-5">
            <Link
              href="/#subscribe"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-sm bg-gold-500 py-3 text-sm font-semibold text-navy-900"
            >
              Get the Daily Brief
            </Link>
            <div className="pt-3">
              <SocialLinks variant="drawer" />
              <p className="mt-3 text-center text-xs text-white/50">{site.x.handle} everywhere</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Search */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${searchOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
        <div className="relative mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-md bg-paper shadow-2xl">
          <div className="flex items-center gap-3 border-b border-stone-200 px-5">
            <SearchIcon className="size-5 text-gold-600" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search analysis, briefings, regions…"
              className="h-16 flex-1 bg-transparent font-serif text-xl text-ink placeholder:text-ink-muted/70 focus:outline-none"
            />
            <button onClick={() => setSearchOpen(false)} className="text-ink-muted hover:text-ink" aria-label="Close search">
              <CloseIcon className="size-5" />
            </button>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto py-2">
            {results.length === 0 && <li className="px-5 py-6 text-sm text-ink-muted">No results for “{query}”.</li>}
            {results.map((r) => (
              <li key={r.slug}>
                <Link href={`/article/${r.slug}`} className="group block px-5 py-3 transition-colors hover:bg-stone-100">
                  <span className="kicker">{r.kicker}</span>
                  <span className="mt-1 block font-serif text-lg text-ink group-hover:text-navy-700">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden border-t border-stone-200 bg-stone-50 px-5 py-2.5 text-[11px] text-ink-muted sm:block">
            Press <kbd className="rounded border border-stone-300 bg-white px-1.5">Esc</kbd> to close ·{" "}
            <kbd className="rounded border border-stone-300 bg-white px-1.5">Ctrl K</kbd> to open
          </div>
        </div>
      </div>
    </>
  );
}
