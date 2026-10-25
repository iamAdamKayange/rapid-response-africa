import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Newsreader } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articles, site } from "@/lib/content";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap", weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.shortName}` },
  description: site.description,
  icons: { icon: "/images/logo.jpeg", apple: "/images/logo.jpeg" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: "/images/banner.jpeg", width: 1600, height: 533 }],
  },
  twitter: { card: "summary_large_image", site: site.x.handle, images: ["/images/banner.jpeg"] },
};

export const viewport: Viewport = { themeColor: "#0a1a31" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = articles.map(({ slug, title, kicker, dek }) => ({ slug, title, kicker, dek }));
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-900">
          Skip to content
        </a>
        <Header searchIndex={searchIndex} />
        <div id="main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
