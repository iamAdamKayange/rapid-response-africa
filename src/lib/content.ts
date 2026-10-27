// Site constants plus built-in fallback content. Live content comes from the API (see lib/data.ts);
// the articles and briefings below are only shown when NEXT_PUBLIC_API_URL is unset or the API is unreachable.

export type SectionSlug =
  | "africa"
  | "policy"
  | "diplomacy"
  | "governance"
  | "business"
  | "development";

export const regions = ["Continental", "North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"] as const;
export type Region = (typeof regions)[number];

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  section: SectionSlug;
  region: Region;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  body: Block[];
};

export type Briefing = {
  id: number | string;
  title: string;
  summary: string;
  region: string;
  link?: string | null;
  occurredAt: string;
};

export type SocialKey = "x" | "instagram" | "facebook" | "tiktok" | "youtube" | "threads" | "linkedin" | "whatsapp";

// Every network uses the same handle: Africans24.
export const socials: { key: SocialKey; label: string; url: string }[] = [
  { key: "x", label: "X", url: "https://x.com/Africans24" },
  { key: "instagram", label: "Instagram", url: "https://www.instagram.com/africans24" },
  { key: "facebook", label: "Facebook", url: "https://www.facebook.com/africans24" },
  { key: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@africans24" },
  { key: "youtube", label: "YouTube", url: "https://www.youtube.com/@africans24" },
  { key: "threads", label: "Threads", url: "https://www.threads.net/@africans24" },
  { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/africans24" },
  { key: "whatsapp", label: "WhatsApp", url: "https://whatsapp.com/channel/africans24" },
];

export const site = {
  name: "The Rapid Response Africa",
  shortName: "Rapid Response Africa",
  tagline: "Africa. In context.",
  description:
    "Verified news, policy clarity and situational briefings on diplomacy, governance, business and development. Around the clock in Africa.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://rapid-response.africa",
  x: { handle: "@Africans24", url: "https://x.com/Africans24" },
  category: "Media & News Company",
  location: "Africa",
};

export const sections: { slug: SectionSlug; name: string; description: string }[] = [
  { slug: "africa", name: "Africa", description: "The continent, region by region — what is moving and why it matters." },
  { slug: "policy", name: "Policy", description: "The decisions behind the headlines, explained with clarity and context." },
  { slug: "diplomacy", name: "Diplomacy", description: "Africa's relationships with itself and the world, from summits to quiet channels." },
  { slug: "governance", name: "Governance", description: "Institutions, accountability and the everyday business of the state." },
  { slug: "business", name: "Business", description: "Markets, trade and capital — the economics shaping a continent." },
  { slug: "development", name: "Development", description: "Energy, infrastructure, climate and people — the long work of progress." },
];

export const navItems = [
  { href: "/", label: "Latest" },
  ...sections.map((s) => ({ href: `/section/${s.slug}`, label: s.name })),
  { href: "/briefings", label: "Briefings" },
];

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const genericBody = (topic: string, angle: string): Block[] => [
  {
    type: "p",
    text: `Few subjects reveal the gap between announcement and outcome as clearly as ${topic}. Communiqués are signed, frameworks are adopted and timelines are agreed — yet the real story is written in the months that follow, in budget lines, procurement decisions and the patience of the institutions asked to deliver.`,
  },
  {
    type: "p",
    text: `This is where Rapid Response Africa focuses its attention: not only on what was decided, but on who decides next, what it will cost, and how the change will be felt by the people it is meant to serve.`,
  },
  { type: "h2", text: "What has changed" },
  {
    type: "p",
    text: `The conversation around ${topic} has shifted from ambition to implementation. ${angle} Governments, regional bodies and private partners are increasingly judged by delivery rather than declarations, and that pressure is reshaping priorities across the continent.`,
  },
  {
    type: "quote",
    text: "The measure of a policy is not the day it is announced, but the day it quietly starts to work.",
  },
  { type: "h2", text: "What to watch" },
  {
    type: "p",
    text: `Three signals matter most: whether financing commitments are converted into disbursements, whether regulators coordinate across borders rather than in parallel, and whether local institutions are given the capacity — not just the mandate — to carry the work forward.`,
  },
  {
    type: "p",
    text: `None of these are headline moments. But taken together, they will determine whether today's plans become tomorrow's infrastructure. We will continue to follow the story, with context, as it develops.`,
  },
];

export const fallbackArticles: Article[] = [
  {
    slug: "the-corridors-connecting-africas-next-chapter",
    title: "The corridors connecting Africa's next chapter",
    dek: "Trade, infrastructure and the decisions shaping a continent.",
    kicker: "Trade & Development",
    section: "business",
    region: "Continental",
    image: u("1578575437130-527eed3abbec"),
    imageAlt: "Container cranes loading a cargo ship at a busy port at sunset",
    author: "Business Desk",
    publishedAt: "2026-10-25T07:30:00Z",
    readMinutes: 8,
    body: genericBody(
      "Africa's trade corridors",
      "Ports, rail lines and border posts are being treated less as isolated projects and more as connected systems — where a delay at one checkpoint ripples across an entire value chain."
    ),
  },
  {
    slug: "inside-africas-energy-transition",
    title: "Inside Africa's energy transition",
    dek: "People, policy and the infrastructure powering change.",
    kicker: "Energy & Development",
    section: "development",
    region: "Continental",
    image: u("1509391366360-2e959784a276"),
    imageAlt: "Rows of solar panels under a bright sky",
    author: "Development Desk",
    publishedAt: "2026-10-25T06:10:00Z",
    readMinutes: 7,
    body: genericBody(
      "the energy transition",
      "Distributed solar, regional power pools and new grid investments are converging, raising hard questions about tariffs, maintenance and who carries the risk."
    ),
  },
  {
    slug: "policy-beyond-the-announcement",
    title: "Policy beyond the announcement",
    dek: "Turning ambition into lasting impact across the continent.",
    kicker: "Policy & Governance",
    section: "policy",
    region: "Continental",
    image: u("1529107386315-e1a2ed48a620"),
    imageAlt: "A parliamentary chamber with rows of seats",
    author: "Policy Desk",
    publishedAt: "2026-10-24T18:45:00Z",
    readMinutes: 6,
    body: genericBody(
      "public policy",
      "Legislatures and ministries are under growing pressure to publish implementation plans alongside new laws, and citizens are increasingly asking for both."
    ),
  },
  {
    slug: "a-continent-in-conversation",
    title: "A continent in conversation",
    dek: "Dialogue, partnerships and a more connected Africa.",
    kicker: "Diplomacy & Africa",
    section: "diplomacy",
    region: "Continental",
    image: u("1521791136064-7986c2920216"),
    imageAlt: "Two people shaking hands across a table",
    author: "Diplomacy Desk",
    publishedAt: "2026-10-24T15:20:00Z",
    readMinutes: 6,
    body: genericBody(
      "African diplomacy",
      "African states are negotiating with a wider range of partners than at any point in a generation, and are increasingly doing so as blocs rather than alone."
    ),
  },
  {
    slug: "what-a-single-market-means-for-small-exporters",
    title: "What a single market means for small exporters",
    dek: "Rules of origin, customs and the fine print that decides who benefits.",
    kicker: "Trade",
    section: "business",
    region: "West Africa",
    image: u("1605745341112-85968b19335b"),
    imageAlt: "A container ship sailing on open water",
    author: "Business Desk",
    publishedAt: "2026-10-24T11:05:00Z",
    readMinutes: 5,
    body: genericBody(
      "continental free trade",
      "For small and medium exporters, the promise of a single market depends on paperwork as much as on tariffs."
    ),
  },
  {
    slug: "power-pools-and-the-quiet-work-of-keeping-the-lights-on",
    title: "Power pools and the quiet work of keeping the lights on",
    dek: "Cross-border electricity trade is maturing. Can the grids keep up?",
    kicker: "Infrastructure",
    section: "development",
    region: "Southern Africa",
    image: u("1473341304170-971dccb5ac1e"),
    imageAlt: "High-voltage power lines at sunset",
    author: "Development Desk",
    publishedAt: "2026-10-23T16:40:00Z",
    readMinutes: 6,
    body: genericBody(
      "regional electricity trade",
      "Interconnectors are only as reliable as the agreements that govern them, and those agreements are being tested by rising demand."
    ),
  },
  {
    slug: "the-farms-adapting-fastest-to-a-changing-climate",
    title: "The farms adapting fastest to a changing climate",
    dek: "Seed systems, water and finance at the frontline of adaptation.",
    kicker: "Climate & Agriculture",
    section: "development",
    region: "East Africa",
    image: u("1625246333195-78d9c38ad449"),
    imageAlt: "Young maize plants growing in a field",
    author: "Development Desk",
    publishedAt: "2026-10-23T09:15:00Z",
    readMinutes: 7,
    body: genericBody(
      "climate adaptation in agriculture",
      "Smallholders are adopting drought-tolerant varieties and new irrigation methods, but access to credit remains the binding constraint."
    ),
  },
  {
    slug: "debt-discipline-and-the-new-rules-of-borrowing",
    title: "Debt, discipline and the new rules of borrowing",
    dek: "How finance ministries are rethinking the cost of capital.",
    kicker: "Markets & Finance",
    section: "business",
    region: "Continental",
    image: u("1580519542036-c47de6196ba5"),
    imageAlt: "Banknotes from several currencies spread across a table",
    author: "Business Desk",
    publishedAt: "2026-10-22T13:30:00Z",
    readMinutes: 8,
    body: genericBody(
      "sovereign borrowing",
      "Treasuries are diversifying lenders, lengthening maturities and paying closer attention to how debt is disclosed."
    ),
  },
  {
    slug: "courts-constitutions-and-the-long-arc-of-accountability",
    title: "Courts, constitutions and the long arc of accountability",
    dek: "Judicial independence is being tested — and, in places, strengthened.",
    kicker: "Governance",
    section: "governance",
    region: "Continental",
    image: u("1589829545856-d10d557cf95f"),
    imageAlt: "A statue of Lady Justice holding scales",
    author: "Governance Desk",
    publishedAt: "2026-10-22T08:00:00Z",
    readMinutes: 6,
    body: genericBody(
      "judicial accountability",
      "Constitutional courts have become central arenas for settling political disputes, raising the stakes of their independence."
    ),
  },
  {
    slug: "a-young-continent-and-the-ballot-box",
    title: "A young continent and the ballot box",
    dek: "What the world's youngest electorate expects from those it elects.",
    kicker: "Governance",
    section: "governance",
    region: "Continental",
    image: u("1529156069898-49953e39b3ac"),
    imageAlt: "A group of young people sitting together outdoors",
    author: "Governance Desk",
    publishedAt: "2026-10-21T17:10:00Z",
    readMinutes: 5,
    body: genericBody(
      "youth political participation",
      "Young voters are organising online and offline, and their priorities — jobs, services and transparency — are reshaping campaigns."
    ),
  },
  {
    slug: "building-the-digital-rails-of-public-service",
    title: "Building the digital rails of public service",
    dek: "Identity, payments and data — the new infrastructure of the state.",
    kicker: "Policy & Technology",
    section: "policy",
    region: "East Africa",
    image: u("1488590528505-98d2b5aba04b"),
    imageAlt: "Lines of code on a laptop screen",
    author: "Policy Desk",
    publishedAt: "2026-10-21T10:25:00Z",
    readMinutes: 6,
    body: genericBody(
      "digital public infrastructure",
      "Interoperable identity and payment systems promise efficiency, but raise questions of privacy, inclusion and oversight."
    ),
  },
  {
    slug: "why-regional-blocs-are-becoming-first-responders",
    title: "Why regional blocs are becoming Africa's first responders",
    dek: "Mediation, mandates and the limits of collective diplomacy.",
    kicker: "Diplomacy",
    section: "diplomacy",
    region: "Central Africa",
    image: u("1450101499163-c8848c66ca85"),
    imageAlt: "A hand signing a formal document",
    author: "Diplomacy Desk",
    publishedAt: "2026-10-20T14:50:00Z",
    readMinutes: 7,
    body: genericBody(
      "regional mediation",
      "Regional economic communities are increasingly first on the scene in political crises, often before continental or global actors."
    ),
  },
  {
    slug: "capturing-more-value-from-the-coffee-cup",
    title: "Capturing more value from the coffee cup",
    dek: "Processing, branding and the push to keep more of the margin at home.",
    kicker: "Agribusiness",
    section: "business",
    region: "East Africa",
    image: u("1574482620811-1aa16ffe3c82"),
    imageAlt: "Hands holding freshly harvested coffee beans",
    author: "Business Desk",
    publishedAt: "2026-10-20T09:40:00Z",
    readMinutes: 5,
    body: genericBody(
      "agricultural value chains",
      "Producers are investing in roasting, certification and direct trade relationships to move up the value chain."
    ),
  },
  {
    slug: "forests-finance-and-the-carbon-market-question",
    title: "Forests, finance and the carbon market question",
    dek: "Who benefits when nature becomes an asset class?",
    kicker: "Climate",
    section: "development",
    region: "Central Africa",
    image: u("1497436072909-60f360e1d4b1"),
    imageAlt: "Aerial view of a dense green forest beside a river",
    author: "Development Desk",
    publishedAt: "2026-10-19T12:00:00Z",
    readMinutes: 8,
    body: genericBody(
      "carbon markets",
      "Governments are writing new rules on benefit-sharing and verification as investor interest in forest carbon grows."
    ),
  },
  {
    slug: "skills-for-an-economy-still-being-built",
    title: "Skills for an economy still being built",
    dek: "Universities, apprenticeships and the jobs of the next decade.",
    kicker: "Education",
    section: "development",
    region: "West Africa",
    image: u("1541339907198-e08756dedf3f"),
    imageAlt: "Graduates throwing their caps into the air",
    author: "Development Desk",
    publishedAt: "2026-10-18T15:30:00Z",
    readMinutes: 6,
    body: genericBody(
      "skills and employment",
      "Education systems are being asked to train for industries that are only beginning to take shape."
    ),
  },
  {
    slug: "deepening-the-continents-capital-markets",
    title: "Deepening the continent's capital markets",
    dek: "Pension funds, exchanges and the search for long-term local capital.",
    kicker: "Markets",
    section: "business",
    region: "Southern Africa",
    image: u("1611974789855-9c2a0a7236a3"),
    imageAlt: "A stock market chart on a dark trading screen",
    author: "Business Desk",
    publishedAt: "2026-10-18T08:20:00Z",
    readMinutes: 7,
    body: genericBody(
      "capital market development",
      "Domestic institutional investors are growing in scale and are being courted to finance infrastructure at home."
    ),
  },
  {
    slug: "africas-cities-are-growing-up-and-out",
    title: "Africa's cities are growing up — and out",
    dek: "Housing, transit and the planning decisions that last a century.",
    kicker: "Urban Development",
    section: "development",
    region: "Southern Africa",
    image: u("1577948000111-9c970dfe3743"),
    imageAlt: "A modern African city skyline under a blue sky",
    author: "Development Desk",
    publishedAt: "2026-10-17T11:45:00Z",
    readMinutes: 6,
    body: genericBody(
      "urbanisation",
      "Rapid urban growth is forcing cities to make long-lived choices on land, transport and services under tight budgets."
    ),
  },
  {
    slug: "north-africa-and-the-mediterranean-energy-bridge",
    title: "North Africa and the Mediterranean energy bridge",
    dek: "Wind, sun and the cables that could link two continents.",
    kicker: "Energy",
    section: "africa",
    region: "North Africa",
    image: u("1532601224476-15c79f2f7a51"),
    imageAlt: "Wind turbines on green rolling hills",
    author: "Africa Desk",
    publishedAt: "2026-10-17T07:50:00Z",
    readMinutes: 6,
    body: genericBody(
      "cross-Mediterranean energy links",
      "Renewable export projects are drawing investor attention, alongside questions about domestic supply first."
    ),
  },
  {
    slug: "the-savanna-economy",
    title: "The savanna economy: tourism, conservation and community",
    dek: "Balancing livelihoods and landscapes in the continent's iconic wild places.",
    kicker: "Conservation",
    section: "africa",
    region: "East Africa",
    image: u("1516026672322-bc52d61a55d5"),
    imageAlt: "A lone acacia tree on the savanna at dusk",
    author: "Africa Desk",
    publishedAt: "2026-10-16T10:10:00Z",
    readMinutes: 5,
    body: genericBody(
      "conservation economics",
      "Community conservancies are testing new models that share tourism revenue more directly with local residents."
    ),
  },
];

export const fallbackBriefings: Briefing[] = [
  { id: "f1", title: "Regional integration", region: "Continental", summary: "Trade ministers' agenda centres on customs harmonisation and digital border systems.", link: "/article/what-a-single-market-means-for-small-exporters", occurredAt: "2026-10-25T08:12:00Z" },
  { id: "f2", title: "Energy & infrastructure", region: "Southern Africa", summary: "Utilities coordinate on cross-border supply as seasonal demand rises.", link: "/article/power-pools-and-the-quiet-work-of-keeping-the-lights-on", occurredAt: "2026-10-25T06:47:00Z" },
  { id: "f3", title: "Diplomacy watch", region: "Central Africa", summary: "Regional envoys continue consultations ahead of a scheduled summit.", link: "/article/why-regional-blocs-are-becoming-first-responders", occurredAt: "2026-10-25T05:31:00Z" },
  { id: "f4", title: "Markets", region: "East Africa", summary: "Currency and bond markets steady as investors await policy guidance.", occurredAt: "2026-10-24T16:00:00Z" },
  { id: "f5", title: "Governance", region: "West Africa", summary: "Electoral bodies publish updated timelines and voter-registration figures.", occurredAt: "2026-10-24T12:30:00Z" },
  { id: "f6", title: "Climate & energy", region: "North Africa", summary: "Renewable tenders draw interest from regional and international developers.", occurredAt: "2026-10-24T09:10:00Z" },
];

export const getSection = (slug: string) => sections.find((s) => s.slug === slug);
export const sectionName = (slug: string) => getSection(slug)?.name ?? slug;
export const inSection = (list: Article[], slug: SectionSlug) =>
  list.filter((a) => a.section === slug || (slug === "africa" && a.region !== "Continental"));

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(new Date(iso));
}

/** "Today, 08:12" / "Yesterday" / "22 Oct" relative to now (UTC). */
export function briefingTime(iso: string) {
  const d = new Date(iso);
  const day = (x: Date) => Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
  const diff = Math.round((day(new Date()) - day(d)) / 86_400_000);
  if (diff <= 0) return `Today, ${formatTime(iso)}`;
  if (diff === 1) return "Yesterday";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(d);
}

/** Parses the API's light article text format: blank-line paragraphs, "## " headings, "> " quotes. */
export function parseBody(text: string): Block[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };
      if (chunk.startsWith("> ")) return { type: "quote", text: chunk.replace(/^>\s?/gm, "").trim() };
      return { type: "p", text: chunk.replace(/\n/g, " ") };
    });
}
