"use client";

import { useState } from "react";
import { XIcon } from "./Icons";

export default function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const shareOnX = () => {
    const url = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}&via=Africans24`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const btn =
    "flex size-10 items-center justify-center rounded-full border border-stone-300 text-ink-soft transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-white";

  return (
    <div className="flex items-center gap-3 lg:flex-col lg:items-start">
      <span className="text-[11px] font-semibold tracking-[0.18em] text-ink-muted uppercase">Share</span>
      <button onClick={shareOnX} className={btn} aria-label="Share on X">
        <XIcon />
      </button>
      <button onClick={copy} className={btn} aria-label="Copy link">
        {copied ? (
          <span className="text-xs">✓</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-4" aria-hidden>
            <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
