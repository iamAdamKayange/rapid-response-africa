"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Alert, Button, Field, inputCls, Spinner } from "@/components/admin/ui";
import { Wordmark } from "@/components/Logo";
import { API_URL, ApiError } from "@/lib/admin-api";

function LoginForm() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const target = next && next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(target);
  }, [loading, user, router, target]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
          await login(email, password);
          router.replace(target);
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Sign-in failed");
          setBusy(false);
        }
      }}
      className="space-y-5"
    >
      {!API_URL && <Alert tone="info">The API address is not configured yet (NEXT_PUBLIC_API_URL).</Alert>}
      {error && <Alert>{error}</Alert>}
      <Field label="Email">
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@rapid-response.com" />
      </Field>
      <Field label="Password">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputCls} pr-16`}
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-ink-muted hover:text-ink">
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </Field>
      <Button type="submit" disabled={busy} className="h-11 w-full">
        {busy ? <Spinner className="size-4" /> : null}
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-xs text-ink-muted">The first sign-in can take up to a minute while the server wakes up.</p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="absolute -right-24 -bottom-16 h-[110%] w-[80%] bg-gold-500/15 [mask-image:url(/images/africa-outline.png)] [mask-position:right_bottom] [mask-repeat:no-repeat] [mask-size:contain]"
        />
        <Link href="/" className="relative flex items-center gap-4">
          <span className="relative size-14 overflow-hidden">
            <Image src="/images/logo.jpeg" alt="" fill sizes="56px" className="scale-[1.45] object-cover" priority />
          </span>
          <span className="h-10 w-px bg-gold-500/60" />
          <Wordmark />
        </Link>
        <div className="relative max-w-md">
          <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-400 uppercase">The Newsroom</p>
          <p className="mt-4 font-serif text-4xl leading-tight text-white">Verified first. Context always.</p>
          <p className="mt-4 text-white/60">Write, review and publish analysis for readers across Africa and beyond.</p>
        </div>
        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} The Rapid Response Africa</p>
      </div>

      <div className="flex flex-col bg-paper">
        <div className="flex items-center justify-between bg-navy-900 px-5 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative size-10 overflow-hidden">
              <Image src="/images/logo.jpeg" alt="" fill sizes="40px" className="scale-[1.45] object-cover" />
            </span>
            <Wordmark compact />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-sm">
            <h1 className="font-serif text-3xl font-medium text-ink">Staff sign-in</h1>
            <p className="mt-2 mb-8 text-sm text-ink-muted">Admins and authors sign in here to manage the site.</p>
            <Suspense fallback={<Spinner />}>
              <LoginForm />
            </Suspense>
            <Link href="/" className="mt-10 block text-center text-sm text-gold-700 hover:text-navy-900">← Back to the website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
