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

Newsletter sign-ups (`src/components/NewsletterForm.tsx`) are saved by the API and listed in the panel
(Subscribers → Export CSV). Sending the emails needs an email provider (Mailchimp, Resend…).

Article photos come from Unsplash (free licence) via `images.unsplash.com`.

## Backend & Admin/Author panel

Three repos work together:

| Repo | What | Host |
| --- | --- | --- |
| `rapid-response-africa` | This public website | Vercel |
| `admin-response-africa` | Admin/Author panel (separate Next.js app) | Vercel |
| `response-africa-backend` | Node.js API + Neon Postgres | Hetzner VPS (`api.rapid-response.africa`) |

| Variable (Vercel → Settings → Environment Variables) | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.rapid-response.africa` |
| `NEXT_PUBLIC_ADMIN_URL` | `https://admin.rapid-response.africa` (adds a "Staff sign-in" link in the footer) |
| `NEXT_PUBLIC_SITE_URL` | `https://rapid-response.africa` (canonical URL for links and social previews) |

`NEXT_PUBLIC_*` values are baked in at build time: after changing them in Vercel, **redeploy**.

Without the API URL (or while the API is asleep) the site shows the built-in content from `src/lib/content.ts`.
Published changes appear on the site within ~30 seconds.

Socials (@Africans24 everywhere) are configured in `socials` in `src/lib/content.ts`.
