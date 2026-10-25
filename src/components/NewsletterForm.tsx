"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (state === "done") {
    return (
      <p className={`flex items-center gap-3 font-serif text-lg ${tone === "dark" ? "text-white" : "text-navy-900"}`} role="status">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-900">✓</span>
        Thank you. Your first brief arrives tomorrow morning.
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        try {
          if (API_URL) {
            const res = await fetch(`${API_URL}/api/subscribers`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error();
          }
          setState("done");
        } catch {
          setState("error");
        }
      }}
      className="w-full"
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-0">
        <label htmlFor={`email-${tone}`} className="sr-only">Email address</label>
        <input
          id={`email-${tone}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={`h-12 min-w-0 flex-1 rounded-sm px-4 text-[15px] focus:outline-none sm:rounded-r-none ${
            tone === "dark"
              ? "bg-white text-ink placeholder:text-ink-muted"
              : "border border-stone-300 bg-white text-ink placeholder:text-ink-muted focus:border-gold-500"
          }`}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="h-12 shrink-0 rounded-sm bg-gold-500 px-7 text-[15px] font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-60 sm:rounded-l-none"
        >
          {state === "sending" ? "Subscribing…" : "Get the brief"}
        </button>
      </div>
      {state === "error" && (
        <p className={`mt-2 text-sm ${tone === "dark" ? "text-gold-300" : "text-red-700"}`} role="alert">
          We couldn&apos;t subscribe you right now. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
