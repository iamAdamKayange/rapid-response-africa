"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Alert, Button, Card, Empty, Loading, PageHeader, StatusBadge } from "@/components/admin/ui";
import { type AdminArticle, api, relative } from "@/lib/admin-api";

type Stats = {
  articles: { draft: number; review: number; published: number; total: number };
  briefings: number;
  subscribers: { total: number; lastWeek: number } | null;
  team: number | null;
  recent: AdminArticle[];
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/admin/stats").then(setStats).catch((e) => setError(e.message));
  }, []);

  const isAdmin = user?.role === "admin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        title={`${greeting}, ${user?.name.split(" ")[0]}`}
        description={isAdmin ? "Here is what is happening across the newsroom." : "Here is where your work stands."}
        actions={<Button href="/admin/articles/new" variant="gold">+ Write article</Button>}
      />
      {error && <Alert>{error}</Alert>}
      {!stats && !error && <Loading />}
      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Stat label="Published" value={stats.articles.published} href="/admin/articles?status=published" accent />
            <Stat label="In review" value={stats.articles.review} href="/admin/articles?status=review" hint={isAdmin && stats.articles.review ? "Waiting for you" : undefined} />
            <Stat label="Drafts" value={stats.articles.draft} href="/admin/articles?status=draft" />
            {stats.subscribers ? (
              <Stat label="Subscribers" value={stats.subscribers.total} href="/admin/subscribers" hint={`+${stats.subscribers.lastWeek} this week`} />
            ) : (
              <Stat label="Briefings" value={stats.briefings} href="/admin/briefings" />
            )}
          </div>

          {isAdmin && stats.articles.review > 0 && (
            <div className="mt-6">
              <Alert tone="info">
                <strong>{stats.articles.review}</strong> article{stats.articles.review > 1 ? "s are" : " is"} waiting for review.{" "}
                <Link href="/admin/articles?status=review" className="font-medium underline">Review now →</Link>
              </Alert>
            </div>
          )}

          <Card className="mt-6 sm:mt-8">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="font-serif text-xl text-ink">Recently updated</h2>
              <Link href="/admin/articles" className="text-sm text-gold-700 hover:text-navy-900">View all →</Link>
            </div>
            {stats.recent.length === 0 ? (
              <Empty title="No articles yet" text="Your first story is one click away." action={<Button href="/admin/articles/new">Write article</Button>} />
            ) : (
              <ul className="divide-y divide-stone-100">
                {stats.recent.map((a) => (
                  <li key={a.id}>
                    <Link href={`/admin/articles/${a.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-stone-50">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink">{a.title}</span>
                        <span className="block truncate text-xs text-ink-muted">
                          {a.sectionName} · {a.authorName ?? "—"} · updated {relative(a.updatedAt)}
                        </span>
                      </span>
                      <StatusBadge status={a.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3">
            <QuickLink href="/admin/briefings" title="Post a briefing" text="Short situational update for the Daily Brief." />
            <QuickLink href="/" title="View the website" text="See what readers see right now." external />
            <QuickLink href="/admin/profile" title="Your profile" text="Update your name, bio and password." />
          </div>
        </>
      )}
    </>
  );
}

function Stat({ label, value, href, hint, accent }: { label: string; value: number; href: string; hint?: string; accent?: boolean }) {
  return (
    <Link href={href} className={`group rounded-lg border p-4 transition-colors sm:p-5 ${accent ? "border-navy-900 bg-navy-900 text-white" : "border-stone-200 bg-white hover:border-navy-900"}`}>
      <p className={`text-xs font-medium tracking-wide uppercase ${accent ? "text-gold-400" : "text-ink-muted"}`}>{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      {hint && <p className={`mt-1 text-xs ${accent ? "text-white/60" : "text-gold-700"}`}>{hint}</p>}
    </Link>
  );
}

function QuickLink({ href, title, text, external }: { href: string; title: string; text: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? "_blank" : undefined} className="rounded-lg border border-stone-200 bg-white p-5 transition-colors hover:border-gold-500">
      <p className="font-medium text-ink">{title} <span className="text-gold-500">→</span></p>
      <p className="mt-1 text-sm text-ink-muted">{text}</p>
    </Link>
  );
}
