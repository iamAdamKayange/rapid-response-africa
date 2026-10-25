"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Alert, Badge, Button, Card, Empty, Field, inputCls, Loading, PageHeader, Spinner } from "@/components/admin/ui";
import { type AdminBriefing, api, ApiError, relative } from "@/lib/admin-api";
import { regions } from "@/lib/content";

type Form = { title: string; summary: string; region: string; link: string; published: boolean };
const blank: Form = { title: "", summary: "", region: "Continental", link: "", published: true };

export default function BriefingsAdmin() {
  const { user } = useAuth();
  const [items, setItems] = useState<AdminBriefing[] | null>(null);
  const [form, setForm] = useState<Form>(blank);
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = () => api<{ briefings: AdminBriefing[] }>("/admin/briefings").then((d) => setItems(d.briefings)).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const canEdit = (b: AdminBriefing) => user?.role === "admin" || b.authorId === user?.id;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editing) await api(`/admin/briefings/${editing}`, { method: "PUT", json: form });
      else await api("/admin/briefings", { method: "POST", json: form });
      setForm(blank);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(b: AdminBriefing) {
    if (!confirm(`Delete "${b.title}"?`)) return;
    try {
      await api(`/admin/briefings/${b.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete");
    }
  }

  return (
    <>
      <PageHeader title="Briefings" description="Short situational updates. The three newest appear in the Daily Brief on the front page." />
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="h-fit p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 font-serif text-xl text-ink">{editing ? "Edit briefing" : "New briefing"}</h2>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Title">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} maxLength={160} placeholder="e.g. Diplomacy watch" />
            </Field>
            <Field label="Summary" hint={`${form.summary.length}/600`}>
              <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={4} maxLength={600} className={inputCls} />
            </Field>
            <Field label="Region">
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls}>
                {regions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Link (optional)" hint="e.g. /article/the-story-slug">
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="size-4 accent-navy-900" />
              Show on the website
            </label>
            <div className="flex gap-2">
              <Button type="submit" variant="gold" disabled={busy} className="flex-1">
                {busy && <Spinner className="size-3.5" />} {editing ? "Save changes" : "Post briefing"}
              </Button>
              {editing && (
                <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</Button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          {!items ? (
            <Loading />
          ) : items.length === 0 ? (
            <Empty title="No briefings yet" text="Post the first update with the form." />
          ) : (
            <ul className="divide-y divide-stone-100">
              {items.map((b) => (
                <li key={b.id} className="flex gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                      <span className="font-semibold text-gold-700 uppercase">{b.region}</span> · {relative(b.occurredAt)} · {b.authorName ?? "—"}
                      {!b.published && <Badge>Hidden</Badge>}
                    </p>
                    <p className="mt-1 font-serif text-lg text-ink">{b.title}</p>
                    {b.summary && <p className="mt-0.5 text-sm text-ink-soft">{b.summary}</p>}
                  </div>
                  {canEdit(b) && (
                    <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                      <Button
                        variant="ghost"
                        className="h-8 px-2.5"
                        onClick={() => {
                          setEditing(b.id);
                          setForm({ title: b.title, summary: b.summary, region: b.region, link: b.link ?? "", published: b.published });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="ghost" className="h-8 px-2.5 text-red-700 hover:bg-red-50 hover:text-red-700" onClick={() => remove(b)}>Delete</Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
