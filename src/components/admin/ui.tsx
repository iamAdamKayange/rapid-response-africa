"use client";

import Link from "next/link";
import type { Status } from "@/lib/admin-api";

export const inputCls =
  "w-full rounded-md border border-stone-300 bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-muted/70 transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none disabled:bg-stone-50";

type BtnVariant = "primary" | "gold" | "ghost" | "outline" | "danger";
const btn: Record<BtnVariant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800",
  gold: "bg-gold-500 text-navy-900 hover:bg-gold-400",
  ghost: "text-ink-soft hover:bg-stone-100 hover:text-ink",
  outline: "border border-stone-300 bg-white text-ink hover:border-navy-900",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
};

export function Button({
  variant = "primary",
  className = "",
  href,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; href?: string }) {
  const cls = `inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${btn[variant]} ${className}`;
  if (href) return <Link href={href} className={cls}>{props.children}</Link>;
  return <button className={cls} {...props} />;
}

export function Field({ label, hint, error, children, className = "" }: { label: string; hint?: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : hint ? <span className="mt-1 block text-xs text-ink-muted">{hint}</span> : null}
    </label>
  );
}

const statusStyles: Record<Status, string> = {
  draft: "bg-stone-100 text-ink-soft ring-stone-200",
  review: "bg-amber-50 text-amber-800 ring-amber-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};
const statusText: Record<Status, string> = { draft: "Draft", review: "In review", published: "Published" };

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {statusText[status]}
    </span>
  );
}

export function Badge({ children, tone = "stone" }: { children: React.ReactNode; tone?: "stone" | "navy" | "gold" | "red" }) {
  const tones = {
    stone: "bg-stone-100 text-ink-soft",
    navy: "bg-navy-900 text-white",
    gold: "bg-gold-500/15 text-gold-700",
    red: "bg-red-50 text-red-700",
  };
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${tones[tone]}`}>{children}</span>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-stone-200 bg-white ${className}`}>{children}</div>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl font-medium text-ink sm:text-[2.25rem]">{title}</h1>
        {description && <p className="mt-1 text-[15px] text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Spinner({ className = "size-5" }: { className?: string }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} aria-label="Loading" />;
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-sm text-ink-muted">
      <Spinner className="size-4" /> {label}
    </div>
  );
}

export function Alert({ children, tone = "error" }: { children: React.ReactNode; tone?: "error" | "success" | "info" }) {
  const tones = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-gold-500/30 bg-gold-500/10 text-navy-900",
  };
  return <div className={`rounded-md border px-4 py-3 text-sm ${tones[tone]}`} role={tone === "error" ? "alert" : "status"}>{children}</div>;
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-stone-100 text-gold-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-6" aria-hidden>
          <path d="M5 4h10l4 4v12H5z M15 4v4h4 M8 13h8M8 17h5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </span>
      <p className="mt-4 font-serif text-xl text-ink">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
