import NewsletterForm from "./NewsletterForm";

export default function NewsletterBand() {
  return (
    <section id="subscribe" className="relative scroll-mt-28 overflow-hidden bg-navy-900">
      <div
        aria-hidden
        className="absolute top-1/2 right-[-4%] h-[160%] w-[40%] -translate-y-1/2 bg-gold-500/15 [mask-image:url(/images/africa-outline.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      />
      <div className="container-x relative grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <span className="font-display text-[11px] font-semibold tracking-[0.3em] text-gold-400 uppercase">The Daily Brief</span>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">Understand what matters.</h2>
          <p className="mt-3 max-w-md font-serif text-lg leading-relaxed text-white/75">
            Independent analysis. Clearer perspectives. Every new story as it is published, and The Daily Brief every weekday morning.
          </p>
        </div>
        <div className="lg:col-span-6">
          <NewsletterForm />
          <p className="mt-3 text-xs text-white/50">Free. No noise. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
