import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getArticles } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const articles = await getArticles();
  const searchIndex = articles.map(({ slug, title, kicker, dek }) => ({ slug, title, kicker, dek }));

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-900">
        Skip to content
      </a>
      <Header searchIndex={searchIndex} />
      <div id="main">{children}</div>
      <Footer />
    </>
  );
}
