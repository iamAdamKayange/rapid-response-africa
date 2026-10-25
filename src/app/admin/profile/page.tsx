"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Alert, Button, Card, Field, inputCls, PageHeader, Spinner } from "@/components/admin/ui";
import { api, ApiError, type User } from "@/lib/admin-api";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [busy, setBusy] = useState<"profile" | "password" | null>(null);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
    }
  }, [user]);

  const run = async (kind: "profile" | "password", json: object, ok: string) => {
    setBusy(kind);
    setMsg(null);
    try {
      const d = await api<{ user: User }>("/auth/me", { method: "PUT", json });
      setUser(d.user);
      setMsg({ tone: "success", text: ok });
      return true;
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof ApiError ? e.message : "Could not save" });
      return false;
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader title="My profile" description={user?.email} />
      {msg && <div className="mb-4"><Alert tone={msg.tone}>{msg.text}</Alert></div>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-serif text-xl text-ink">Details</h2>
          <form onSubmit={(e) => { e.preventDefault(); run("profile", { name, bio }, "Profile saved."); }} className="space-y-4">
            <Field label="Display name"><input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
            <Field label="Short bio"><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={inputCls} /></Field>
            <Button type="submit" disabled={busy !== null}>{busy === "profile" && <Spinner className="size-3.5" />} Save details</Button>
          </form>
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 font-serif text-xl text-ink">Change password</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (pw.newPassword !== pw.confirm) return setMsg({ tone: "error", text: "The new passwords do not match." });
              if (await run("password", { currentPassword: pw.currentPassword, newPassword: pw.newPassword }, "Password changed."))
                setPw({ currentPassword: "", newPassword: "", confirm: "" });
            }}
            className="space-y-4"
          >
            <Field label="Current password"><input required type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} className={inputCls} /></Field>
            <Field label="New password" hint="At least 8 characters"><input required minLength={8} type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} className={inputCls} /></Field>
            <Field label="Repeat new password"><input required minLength={8} type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputCls} /></Field>
            <Button type="submit" disabled={busy !== null}>{busy === "password" && <Spinner className="size-3.5" />} Update password</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
