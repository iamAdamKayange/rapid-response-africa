"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Alert, Button, Card, Empty, inputCls, Loading, PageHeader } from "@/components/admin/ui";
import { api, download, relative, type Subscriber } from "@/lib/admin-api";

export default function SubscribersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Subscriber[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/admin");
  }, [user, router]);

  const load = () => api<{ subscribers: Subscriber[] }>("/admin/subscribers").then((d) => setItems(d.subscribers)).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const shown = useMemo(() => (items ?? []).filter((s) => s.email.includes(q.toLowerCase())), [items, q]);

  return (
    <>
      <PageHeader
        title="Subscribers"
        description="Readers who signed up for the Daily Brief."
        actions={
          <Button variant="outline" onClick={() => download("/admin/subscribers?format=csv", "rapid-response-subscribers.csv").catch((e) => setError(e.message))} disabled={!items?.length}>
            Export CSV
          </Button>
        }
      />
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}
      <div className="mb-4 flex items-center justify-between gap-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email…" className={`${inputCls} max-w-xs`} />
        {items && <p className="text-sm text-ink-muted">{items.length} total</p>}
      </div>
      <Card>
        {!items ? (
          <Loading />
        ) : shown.length === 0 ? (
          <Empty title={q ? "No matches" : "No subscribers yet"} text={q ? undefined : "Sign-ups from the website's newsletter forms will appear here."} />
        ) : (
          <ul className="divide-y divide-stone-100">
            {shown.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-5 py-3">
                <span className="min-w-0 flex-1 truncate text-sm text-ink">{s.email}</span>
                <span className="hidden text-xs text-ink-muted sm:block">{relative(s.createdAt)}</span>
                <button
                  onClick={async () => {
                    if (!confirm(`Remove ${s.email}?`)) return;
                    await api(`/admin/subscribers/${s.id}`, { method: "DELETE" }).catch((e) => setError(e.message));
                    load();
                  }}
                  className="text-xs text-red-700 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
