import { siFacebook, siInstagram, siThreads, siTiktok, siWhatsapp, siX, siYoutube } from "simple-icons";
import { type SocialKey, socials } from "@/lib/content";

// LinkedIn is not in simple-icons (brand removal), so its mark is inlined.
const LINKEDIN =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const paths: Record<SocialKey, string> = {
  x: siX.path,
  instagram: siInstagram.path,
  facebook: siFacebook.path,
  tiktok: siTiktok.path,
  youtube: siYoutube.path,
  threads: siThreads.path,
  linkedin: LINKEDIN,
  whatsapp: siWhatsapp.path,
};

export function SocialIcon({ name, className = "size-4" }: { name: SocialKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

type Variant = "bar" | "footer" | "drawer" | "light";

const styles: Record<Variant, { list: string; link: string; icon: string }> = {
  bar: { list: "flex items-center gap-3.5", link: "text-white/55 transition-colors hover:text-gold-400", icon: "size-3.5" },
  footer: {
    list: "flex flex-wrap items-center gap-2",
    link: "flex size-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-gold-500 hover:bg-gold-500 hover:text-navy-900",
    icon: "size-4",
  },
  drawer: { list: "flex flex-wrap items-center justify-center gap-5", link: "text-white/70 transition-colors hover:text-gold-400", icon: "size-5" },
  light: {
    list: "flex flex-wrap items-center gap-2",
    link: "flex size-10 items-center justify-center rounded-full border border-stone-300 text-ink-soft transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-white",
    icon: "size-4",
  },
};

export default function SocialLinks({ variant = "footer", only }: { variant?: Variant; only?: SocialKey[] }) {
  const s = styles[variant];
  const list = only ? socials.filter((x) => only.includes(x.key)) : socials;
  return (
    <ul className={s.list}>
      {list.map((x) => (
        <li key={x.key}>
          <a href={x.url} target="_blank" rel="noreferrer" aria-label={`${x.label} @Africans24`} title={`${x.label} @Africans24`} className={s.link}>
            <SocialIcon name={x.key} className={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
