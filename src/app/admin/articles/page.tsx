"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Alert, Badge, Button, Card, Empty, inputCls, Loading, PageHeader, StatusBadge } from "@/components/admin/ui";
import { type AdminArticle, api, relative, type Status } from "@/lib/admin-api";

const tabs: { key: "" | Status; label: string }[] = [
  { key: "", label: "All" },
  { key: "published", label: "Published" },
  { key: "review", label: "In review" },
  { key: "draft", label: "Drafts" },
];

function ArticleList() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const status = (params.get("status") || "") as "" | Status;
  const [q, setQ] = useState("");
  const [data, setData] = useState<{ articles: AdminArticle[]; total: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    const t = setTimeout(() => {
      const qs = new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), limit: "200" });
      api<{ articles: AdminArticle[]; total: number }>(`/admin/articles?${qs}`)
        .then(setData)
        .catch((e) => setError(e.message));
    }, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [status, q]);

  const isAdmin = user?.role === "admin";

  return (
    <>
      <PageHeader
        title={isAdmin ? "Articles" : "My articles"}
        description={isAdmin ? "Every story in the newsroom." : "Drafts, submissions and your published work."}
        actions={<Button href="/admin/articles/new" variant="gold">+ Write article</Button>}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => router.replace(t.key ? `/admin/articles?status=${t.key}` : "/admin/articles")}
              className={`rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-colors ${
                status === t.key ? "bg-navy-900 text-white" : "text-ink-soft hover:bg-stone-200/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles…" className={`${inputCls} sm:max-w-xs`} />
      </div>

      {error && <Alert>{error}</Alert>}

      <Card>
        {!data ? (
          <Loading />
        ) : data.articles.length === 0 ? (
          <Empty
            title={q ? "No matches" : "Nothing here yet"}
            text={q ? "Try a different search." : "Start a new story and it will appear here."}
            action={!q && <Button href="/admin/articles/new">Write article</Button>}
          />
        ) : (
          <ul className="divide-y divide-stone-100">
            {data.articles.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-stone-50 sm:px-5">
                  <span className="relative hidden aspect-[4/3] w-20 shrink-0 overflow-hidden rounded bg-stone-100 sm:block">
                    {a.image && <Image src={a.image} alt="" fill sizes="80px" className="object-cover" unoptimized={!a.image.startsWith("https://images.unsplash.com")} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-medium text-ink">{a.title}</span>
                      {a.featured && <Badge tone="gold">Lead</Badge>}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-muted">
                      {a.sectionName ?? a.section} · {a.region}
                      {isAdmin && ` · ${a.authorName ?? "Unknown"}`} · updated {relative(a.updatedAt)}
                    </span>
                  </span>
                  <StatusBadge status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {data && data.total > 0 && <p className="mt-3 text-xs text-ink-muted">{data.total} article{data.total === 1 ? "" : "s"}</p>}
    </>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ArticleList />
    </Suspense>
  );
}
