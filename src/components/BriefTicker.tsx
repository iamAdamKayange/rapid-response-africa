import { tickerItems } from "@/lib/content";

export default function BriefTicker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="border-b border-stone-200 bg-stone-50">
      <div className="container-x flex h-10 items-center gap-4 overflow-hidden">
        <span className="flex shrink-0 items-center gap-3 border-l-2 border-gold-500 pl-3">
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-navy-900 uppercase">The Brief</span>
          <span className="h-3.5 w-px bg-stone-300" />
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_92%,transparent)]">
          <div className="flex w-max animate-ticker gap-12 hover:[animation-play-state:paused] motion-reduce:animate-none">
            {items.map((t, i) => (
              <span key={i} className="flex items-center gap-12 text-[13px] whitespace-nowrap text-ink-soft">
                {t}
                <span className="size-1 rotate-45 bg-gold-500" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
