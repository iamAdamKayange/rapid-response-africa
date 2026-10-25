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

## Backend & Admin/Author panel

The site reads live content from the Node.js API (separate repo, hosted on Render, database on Neon).

| Variable | Where | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Vercel → Settings → Environment Variables (and `.env.local` for dev) | `https://<your-render-service>.onrender.com` |

Without it (or while the API is asleep) the site shows the built-in content from `src/lib/content.ts`.
Published changes appear on the site within ~30 seconds.

The panel lives at **`/admin`** (link "Staff sign-in" in the footer; hidden from search engines via `robots.txt`).

- **Admin**: publish/unpublish, choose the lead story, edit anything, briefings, team accounts, newsletter subscribers (CSV export)
- **Author**: write articles, save drafts, submit for review, post briefings

Demo accounts are created by the backend's `npm run seed` (see the backend README / `.env.example`).
Change their passwords from **My profile** before going live.

Socials (@Africans24 everywhere) are configured in `socials` in `src/lib/content.ts`.
