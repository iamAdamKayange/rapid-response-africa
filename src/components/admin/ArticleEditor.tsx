"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type AdminArticle, api, ApiError, relative, type Status } from "@/lib/admin-api";
import { parseBody, regions } from "@/lib/content";
import { useAuth } from "./AuthProvider";
import { Alert, Button, Card, Field, inputCls, Spinner, StatusBadge } from "./ui";

type Form = {
  title: string;
  dek: string;
  kicker: string;
  section: string;
  region: string;
  image: string;
  imageAlt: string;
  byline: string;
  body: string;
  featured: boolean;
  slug: string;
};

const empty: Form = { title: "", dek: "", kicker: "", section: "", region: "Continental", image: "", imageAlt: "", byline: "", body: "", featured: false, slug: "" };

export default function ArticleEditor({ id }: { id?: number }) {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState<Form>(empty);
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [sections, setSections] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState<Status | "delete" | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api<{ sections: { slug: string; name: string }[] }>("/admin/sections").then((d) => {
      setSections(d.sections);
      setForm((f) => (f.section ? f : { ...f, section: d.sections[0]?.slug ?? "" }));
    });
    if (!id) return;
    api<{ article: AdminArticle }>(`/admin/articles/${id}`)
      .then(({ article: a }) => {
        setArticle(a);
        setForm({
          title: a.title, dek: a.dek, kicker: a.kicker, section: a.section, region: a.region, image: a.image,
          imageAlt: a.imageAlt, byline: a.byline ?? "", body: a.body ?? "", featured: a.featured, slug: a.slug,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const words = useMemo(() => form.body.split(/\s+/).filter(Boolean).length, [form.body]);
  const locked = !isAdmin && article?.status === "published";

  async function save(status: Status) {
    setError("");
    setFieldErrors({});
    setNotice("");
    setSaving(status);
    try {
      const payload = { ...form, status, ...(id ? {} : { slug: form.slug || undefined }) };
      const { article: saved } = id
        ? await api<{ article: AdminArticle }>(`/admin/articles/${id}`, { method: "PUT", json: payload })
        : await api<{ article: AdminArticle }>("/admin/articles", { method: "POST", json: payload });
      setDirty(false);
      setArticle(saved);
      setForm((f) => ({ ...f, slug: saved.slug }));
      const msg = {
        draft: "Draft saved.",
        review: "Submitted for review. An admin will publish it.",
        published: "Published. It will appear on the website within a minute.",
      }[status];
      if (!id) router.replace(`/admin/articles/${saved.id}?saved=${status}`);
      else setNotice(msg);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        if (e.details) setFieldErrors(e.details);
      } else setError("Could not save");
    } finally {
      setSaving(null);
    }
  }

  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get("saved");
    if (saved) setNotice(saved === "published" ? "Published." : saved === "review" ? "Submitted for review." : "Draft saved.");
  }, []);

  async function remove() {
    if (!id || !confirm("Delete this article permanently?")) return;
    setSaving("delete");
    try {
      await api(`/admin/articles/${id}`, { method: "DELETE" });
      setDirty(false);
      router.replace("/admin/articles");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not delete");
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-ink-muted">
        <Spinner />
      </div>
    );
  }

  const busy = saving !== null;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/articles" className="text-sm text-ink-muted hover:text-ink">← Articles</Link>
          <h1 className="mt-1 font-serif text-3xl font-medium text-ink">{id ? "Edit article" : "New article"}</h1>
          {article && (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <StatusBadge status={article.status} /> Updated {relative(article.updatedAt)}
              {article.status === "published" && (
                <a href={`/article/${article.slug}`} target="_blank" className="text-gold-700 hover:text-navy-900">View live ↗</a>
              )}
            </p>
          )}
        </div>
        {!locked && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => save("draft")} disabled={busy}>
              {saving === "draft" && <Spinner className="size-3.5" />} {article?.status === "published" ? "Unpublish" : "Save draft"}
            </Button>
            {isAdmin ? (
              <Button variant="gold" onClick={() => save("published")} disabled={busy}>
                {saving === "published" && <Spinner className="size-3.5" />} {article?.status === "published" ? "Update" : "Publish"}
              </Button>
            ) : (
              <Button onClick={() => save("review")} disabled={busy}>
                {saving === "review" && <Spinner className="size-3.5" />} Submit for review
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {locked && <Alert tone="info">This article is live. Only an admin can change or remove it now.</Alert>}
        {notice && <Alert tone="success">{notice}</Alert>}
        {error && <Alert>{error}</Alert>}
        {isAdmin && article?.status === "review" && <Alert tone="info">Submitted by {article.authorName}. Read it through, then Publish or send back as a draft.</Alert>}
      </div>

      <fieldset disabled={locked || busy} className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="space-y-5 p-5">
            <Field label="Headline" error={fieldErrors.title}>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className={`${inputCls} font-serif text-xl`} placeholder="A clear, specific headline" />
            </Field>
            <Field label="Standfirst" hint="One sentence under the headline." error={fieldErrors.dek}>
              <textarea value={form.dek} onChange={(e) => set("dek", e.target.value)} rows={2} className={inputCls} placeholder="What this story explains, in a line." />
            </Field>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-stone-200 px-3">
              <div className="flex">
                {(["write", "preview"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`border-b-2 px-3 py-3 text-sm capitalize ${tab === t ? "border-gold-500 font-medium text-ink" : "border-transparent text-ink-muted hover:text-ink"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <span className="pr-2 text-xs text-ink-muted">{words} words · {Math.max(1, Math.round(words / 220))} min read</span>
            </div>
            {tab === "write" ? (
              <div className="p-5">
                <textarea
                  value={form.body}
                  onChange={(e) => set("body", e.target.value)}
                  rows={20}
                  className={`${inputCls} min-h-[420px] font-serif text-[17px] leading-relaxed`}
                  placeholder={"Write the story here.\n\nLeave a blank line between paragraphs.\n\n## A sub-heading\n\n> A pull quote"}
                />
                <p className="mt-2 text-xs text-ink-muted">
                  Blank line = new paragraph · <code className="rounded bg-stone-100 px-1">## </code> sub-heading ·{" "}
                  <code className="rounded bg-stone-100 px-1">&gt; </code> pull quote
                </p>
              </div>
            ) : (
              <div className="prose-article px-5 py-6 sm:px-8">
                <h1 className="mb-4 font-serif text-3xl text-ink">{form.title || "Untitled"}</h1>
                {form.dek && <p className="!text-xl !text-ink-muted">{form.dek}</p>}
                {parseBody(form.body).map((b, i) =>
                  b.type === "h2" ? <h2 key={i}>{b.text}</h2> : b.type === "quote" ? <blockquote key={i}>{b.text}</blockquote> : <p key={i}>{b.text}</p>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-ink">Placement</h2>
            <Field label="Section" error={fieldErrors.section}>
              <select value={form.section} onChange={(e) => set("section", e.target.value)} className={inputCls}>
                {sections.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Region">
              <select value={form.region} onChange={(e) => set("region", e.target.value)} className={inputCls}>
                {regions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Kicker" hint="Small gold label above the headline, e.g. Trade & Development">
              <input value={form.kicker} onChange={(e) => set("kicker", e.target.value)} className={inputCls} maxLength={60} />
            </Field>
            {isAdmin && (
              <label className="flex items-start gap-3 rounded-md bg-stone-50 p-3">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="mt-0.5 size-4 accent-navy-900" />
                <span className="text-sm">
                  <span className="font-medium text-ink">Lead story</span>
                  <span className="block text-xs text-ink-muted">Show as the big story at the top of the front page.</span>
                </span>
              </label>
            )}
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-ink">Image</h2>
            <div className="relative aspect-[16/10] overflow-hidden rounded bg-stone-100">
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt={form.imageAlt} className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-xs text-ink-muted">No image yet</span>
              )}
            </div>
            <Field label="Image URL" hint="Paste a link from Unsplash, Cloudinary or your image host." error={fieldErrors.image}>
              <input value={form.image} onChange={(e) => set("image", e.target.value)} className={inputCls} placeholder="https://…" />
            </Field>
            <Field label="Image description" hint="For screen readers and as the caption.">
              <input value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} className={inputCls} />
            </Field>
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-ink">Byline &amp; link</h2>
            <Field label="Byline" hint={`Leave empty to show "${article?.authorName ?? user?.name}". e.g. Business Desk`}>
              <input value={form.byline} onChange={(e) => set("byline", e.target.value)} className={inputCls} />
            </Field>
            <Field label="URL slug" hint="Created from the headline if left empty." error={fieldErrors.slug}>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="the-story-headline" />
            </Field>
          </Card>

          {id && (isAdmin || article?.status !== "published") && (
            <Button variant="danger" onClick={remove} disabled={busy} className="w-full">
              {saving === "delete" && <Spinner className="size-3.5" />} Delete article
            </Button>
          )}
        </div>
      </fieldset>
    </div>
  );
}
