import Link from "next/link";
import { dailyBrief } from "@/lib/content";

export default function DailyBrief() {
  return (
    <aside className="relative flex h-full flex-col overflow-hidden bg-navy-900 p-6 text-white sm:p-7">
      <div
        aria-hidden
        className="absolute -right-10 -bottom-6 h-[115%] w-[85%] bg-gold-500/25 [mask-image:url(/images/africa-outline.png)] [mask-position:right_bottom] [mask-repeat:no-repeat] [mask-size:contain]"
      />
      <div className="relative flex items-center justify-between">
        <h2 className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-400 uppercase">The Daily Brief</h2>
        <span className="flex items-center gap-1.5 text-[11px] text-white/60">
          <span className="size-1.5 rounded-full bg-gold-500" /> Live
        </span>
      </div>
      <ol className="relative mt-6 flex-1 space-y-6">
        {dailyBrief.map((item) => (
          <li key={item.title}>
            <Link href={item.href} className="group block">
              <span className="block h-0.5 w-7 bg-gold-500 transition-all duration-300 group-hover:w-12" />
              <span className="mt-3 block font-serif text-xl leading-snug text-white group-hover:text-gold-300">{item.title}</span>
              <span className="mt-1 block text-xs text-white/55">Today, {item.time}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href="/briefings"
        className="relative mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-gold-400 transition-colors hover:text-gold-300"
      >
        All briefings <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}
