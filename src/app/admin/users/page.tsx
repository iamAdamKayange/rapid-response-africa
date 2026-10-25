"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Alert, Badge, Button, Card, Field, inputCls, Loading, PageHeader, Spinner } from "@/components/admin/ui";
import { api, ApiError, relative, type Role, type User } from "@/lib/admin-api";

type Form = { name: string; email: string; password: string; role: Role };
const blank: Form = { name: "", email: "", password: "", role: "author" };

export default function TeamPage() {
  const { user: me } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[] | null>(null);
  const [form, setForm] = useState<Form>(blank);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (me && me.role !== "admin") router.replace("/admin");
  }, [me, router]);

  const load = () => api<{ users: User[] }>("/admin/users").then((d) => setUsers(d.users)).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const act = async (fn: () => Promise<unknown>, ok: string) => {
    setError("");
    setNotice("");
    try {
      await fn();
      setNotice(ok);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? Object.values(e.details ?? {}).length ? `${e.message}: ${Object.entries(e.details!).map(([k, v]) => `${k} ${v}`).join(", ")}` : e.message : "Something went wrong");
    }
  };

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await act(() => api("/admin/users", { method: "POST", json: form }), `${form.name} can now sign in.`);
    setBusy(false);
    setForm(blank);
    setShowForm(false);
  }

  return (
    <>
      <PageHeader
        title="Team"
        description="Admins run the newsroom. Authors write and submit for review."
        actions={<Button variant="gold" onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "+ Add member"}</Button>}
      />
      <div className="space-y-3">
        {error && <Alert>{error}</Alert>}
        {notice && <Alert tone="success">{notice}</Alert>}
      </div>

      {showForm && (
        <Card className="mt-4 p-5">
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <Field label="Full name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></Field>
            <Field label="Temporary password" hint="At least 8 characters">
              <input required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Role">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className={inputCls}>
                <option value="author">Author</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="submit" disabled={busy}>{busy && <Spinner className="size-3.5" />} Create account</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="mt-6">
        {!users ? (
          <Loading />
        ) : (
          <ul className="divide-y divide-stone-100">
            {users.map((u) => (
              <li key={u.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full font-semibold ${u.active ? "bg-navy-900 text-gold-400" : "bg-stone-200 text-ink-muted"}`}>
                    {u.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                      {u.name} {u.id === me?.id && <span className="text-xs text-ink-muted">(you)</span>}
                      <Badge tone={u.role === "admin" ? "navy" : "gold"}>{u.role}</Badge>
                      {!u.active && <Badge tone="red">Disabled</Badge>}
                    </p>
                    <p className="truncate text-xs text-ink-muted">
                      {u.email} · {u.articleCount ?? 0} articles · last sign-in {relative(u.lastLoginAt)}
                    </p>
                  </div>
                </div>
                {u.id !== me?.id && (
                  <div className="flex flex-wrap gap-1.5">
                    <Button variant="outline" className="h-8 px-3 text-xs" onClick={() => act(() => api(`/admin/users/${u.id}`, { method: "PUT", json: { role: u.role === "admin" ? "author" : "admin" } }), "Role updated.")}>
                      Make {u.role === "admin" ? "author" : "admin"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      onClick={() => {
                        const pw = prompt(`New password for ${u.name} (min 8 characters):`);
                        if (pw) act(() => api(`/admin/users/${u.id}`, { method: "PUT", json: { password: pw } }), "Password reset.");
                      }}
                    >
                      Reset password
                    </Button>
                    <Button variant="outline" className="h-8 px-3 text-xs" onClick={() => act(() => api(`/admin/users/${u.id}`, { method: "PUT", json: { active: !u.active } }), u.active ? "Account disabled." : "Account enabled.")}>
                      {u.active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="danger"
                      className="h-8 px-3 text-xs"
                      onClick={() => confirm(`Delete ${u.name}? Their articles are kept.`) && act(() => api(`/admin/users/${u.id}`, { method: "DELETE" }), "Member removed.")}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
