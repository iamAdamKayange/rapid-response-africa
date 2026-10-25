import Link from "next/link";

export default function SectionHeading({ title, href, linkLabel = "View all" }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 border-t border-ink pt-4">
      <h2 className="section-label">{title}</h2>
      {href && (
        <Link href={href} className="text-[13px] font-medium text-gold-700 transition-colors hover:text-navy-900">
          {linkLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
