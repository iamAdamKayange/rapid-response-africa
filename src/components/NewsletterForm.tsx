"use client";

import { useState } from "react";

export default function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className={`flex items-center gap-3 font-serif text-lg ${tone === "dark" ? "text-white" : "text-navy-900"}`} role="status">
        <span className="flex size-7 items-center justify-center rounded-full bg-gold-500 text-navy-900">✓</span>
        Thank you. Your first brief arrives tomorrow morning.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: connect to your email provider (Mailchimp, ConvertKit, Resend…)
        setDone(true);
      }}
      className="flex w-full flex-col gap-3 sm:flex-row sm:gap-0"
    >
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
        className="h-12 shrink-0 rounded-sm bg-gold-500 px-7 text-[15px] font-semibold text-navy-900 transition-colors hover:bg-gold-400 sm:rounded-l-none"
      >
        Get the brief
      </button>
    </form>
  );
}
