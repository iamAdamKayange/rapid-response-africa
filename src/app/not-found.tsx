import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-700 uppercase">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">This page is out of context.</h1>
      <p className="mt-3 text-ink-soft">The story you are looking for may have moved.</p>
      <Link href="/" className="mt-8 rounded-sm bg-navy-900 px-6 py-3 text-sm font-medium text-white hover:bg-navy-800">
        Back to the front page
      </Link>
    </main>
  );
}
