"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { useAuth } from "./AuthProvider";
import { Badge, Loading } from "./ui";

const I = {
  dashboard: "M4 13h6V4H4zm10 7h6V11h-6zM4 20h6v-4H4zm10-11h6V4h-6z",
  articles: "M5 4h10l4 4v12H5z M15 4v4h4 M8 13h8M8 17h5",
  new: "M12 5v14M5 12h14",
  briefings: "M12 8v4l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  team: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1 M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M21 19v-1a4 4 0 0 0-3-3.87 M16 4.13a3 3 0 0 1 0 5.74",
  subscribers: "M4 6h16v12H4z M4 7l8 6 8-6",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  site: "M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  logout: "M15 17l5-5-5-5 M20 12H9 M12 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h7",
};

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-[18px] shrink-0" aria-hidden>
    <path d={d} />
  </svg>
);

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, pathname, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Loading label="Opening the newsroom…" />
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const nav = [
    { href: "/admin", label: "Dashboard", icon: I.dashboard, exact: true },
    { href: "/admin/articles", label: isAdmin ? "All articles" : "My articles", icon: I.articles },
    { href: "/admin/articles/new", label: "Write article", icon: I.new, exact: true },
    { href: "/admin/briefings", label: "Briefings", icon: I.briefings },
    ...(isAdmin
      ? [
          { href: "/admin/users", label: "Team", icon: I.team },
          { href: "/admin/subscribers", label: "Subscribers", icon: I.subscribers },
        ]
      : []),
    { href: "/admin/profile", label: "My profile", icon: I.profile },
  ];
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || (pathname.startsWith(href + "/") && !pathname.startsWith("/admin/articles/new"));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 py-5 pr-12 pl-5 lg:pr-5">
        <span className="relative size-10 shrink-0 overflow-hidden rounded">
          <Image src="/images/logo.jpeg" alt="" fill sizes="40px" className="scale-[1.45] object-cover" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[12px] font-semibold tracking-[0.12em] text-white uppercase">
            Rapid Response <span className="text-gold-500">Africa</span>
          </span>
          <span className="block text-[11px] text-white/50">Newsroom</span>
        </span>
      </Link>

      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              active(n.href, n.exact) ? "bg-white/10 font-medium text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon d={n.icon} />
            {n.label}
            {active(n.href, n.exact) && <span className="ml-auto h-4 w-0.5 rounded bg-gold-500" />}
          </Link>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-white/10 px-3 py-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">
          <Icon d={I.site} /> View website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">
          <Icon d={I.logout} /> Sign out
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-500 font-semibold text-navy-900">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-white">{user.name}</span>
          <span className="block truncate text-xs text-white/50">{user.email}</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-900 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-navy-950/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 w-72 max-w-[85%] bg-navy-900 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <button onClick={() => setOpen(false)} className="absolute top-5 right-3 text-white/70" aria-label="Close menu">
            <CloseIcon className="size-5" />
          </button>
          {sidebar}
        </aside>
      </div>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:h-16 lg:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="-ml-1 flex size-9 items-center justify-center text-ink lg:hidden" aria-label="Open menu">
              <MenuIcon className="size-5" />
            </button>
            <span className="text-sm text-ink-muted">
              Signed in as <span className="font-medium text-ink">{user.name}</span>
            </span>
          </div>
          <Badge tone={isAdmin ? "navy" : "gold"}>{isAdmin ? "Admin" : "Author"}</Badge>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
