import Image from "next/image";
import Link from "next/link";

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-display font-semibold tracking-[0.14em] text-white uppercase transition-all ${
          compact ? "text-[13px] sm:text-[15px]" : "text-[13px] sm:text-[17px] lg:text-[19px]"
        }`}
      >
        The Rapid Response <span className="text-gold-500">Africa</span>
      </span>
      <span className="mt-1.5 flex items-center gap-2">
        <span className="h-px w-5 bg-gold-500/70 sm:w-8" aria-hidden />
        <span className="font-display text-[8px] font-medium tracking-[0.38em] text-white/70 uppercase sm:text-[9px]">
          Africa. In context.
        </span>
      </span>
    </span>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3 sm:gap-4" aria-label="The Rapid Response Africa — home">
      <span
        className={`relative shrink-0 overflow-hidden transition-all duration-300 ${
          compact ? "size-9 sm:size-10" : "size-10 sm:size-12 lg:size-14"
        }`}
      >
        <Image
          src="/images/logo.jpeg"
          alt=""
          fill
          priority
          sizes="56px"
          className="scale-[1.45] object-cover transition-transform duration-500 group-hover:scale-[1.52]"
        />
      </span>
      <span className="hidden h-9 w-px bg-gold-500/60 min-[380px]:block" aria-hidden />
      <Wordmark compact={compact} />
    </Link>
  );
}
