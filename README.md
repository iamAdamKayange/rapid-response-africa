# The Rapid Response Africa — website

Next.js 15 (App Router) + Tailwind CSS v4. Fully responsive (phone, tablet, desktop).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Pages

| Route | What |
| --- | --- |
| `/` | Front page: lead story, Daily Brief, Latest Analysis, In Depth, Most Read, Situational Briefings, Across the Continent, desks, newsletter |
| `/article/[slug]` | Article reading page (share on X, copy link, related stories) |
| `/section/[slug]` | Africa, Policy, Diplomacy, Governance, Business, Development |
| `/briefings` | Around-the-clock situational briefings |
| `/about` | Company details, editorial standards, contact |

## Editing content

All stories, briefings and company details live in `src/lib/content.ts`.
The articles there are **sample content** — replace them with real reporting (or connect a CMS).

Brand assets: `public/images/logo.jpeg`, `public/images/banner.jpeg`, `public/images/africa-outline.png`
(the outline was extracted from the banner). Colours are defined in `src/app/globals.css` (`navy-*`, `gold-*`).

Newsletter forms (`src/components/NewsletterForm.tsx`) show a thank-you message but are not yet connected
to an email provider.

Article photos come from Unsplash (free licence) via `images.unsplash.com`.
