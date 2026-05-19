# BD Product

BD Product is a Bangladesh-focused product discovery and AI review web app.
It delivers bilingual (বাংলা + English) product insights with BDT (৳) price context and store comparison support.

> **Project status:** Foundation scaffold is implemented. Some modules are currently placeholders and require integration work to be production-complete.

---

## Current Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI API (`/api/reviews` route)
- **Database target:** Supabase (SQL schema + seed files included)

---

## What Is Already Implemented

### Frontend
- Home page with:
  - Hero section
  - Product search entry
  - Popular categories
  - Trending products
  - Featured deals in BDT
- Search results page (basic query matching)
- Product details page with:
  - Bilingual AI review section (sample output)
  - Price comparison across BD stores
  - Lowest price summary
- Additional scaffolded routes:
  - Category
  - Compare
  - Favorites
  - Price Alerts
  - Blog
  - About
  - Contact
  - Admin
- Dark/light theme toggle

### Backend/API
- `GET /api/search` — autocomplete-style product filtering from current data source
- `POST /api/reviews` — OpenAI-based bilingual review generation endpoint
- `POST /api/prices/update` — price refresh job trigger stub

### Data/Database
- Supabase SQL schema with core tables:
  - `users`, `categories`, `brands`, `products`, `product_specs`
  - `ai_reviews`, `product_prices`, `price_history`, `price_alerts`
  - `comments`, `ratings`, `favorites`, `affiliate_links`
- Seed SQL for initial categories/brands relevant to Bangladesh

---

## Important Limitations (Needs Implementation)

The following are **not fully implemented yet** and are currently scaffold/stub level:

- Real store API/scraper ingestion for Daraz, Pickaboo, Star Tech, etc.
- Persistent DB-backed product listing (current UI uses local in-memory data)
- Full authentication flows (email + Google)
- Complete admin CRUD workflows
- Price history charts and advanced analytics
- Full SEO package (`sitemap.xml`, `robots.txt`, full JSON-LD wiring)
- End-to-end test coverage

---

## Local Development

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
```bash
cp .env.example .env.local
```

Populate `.env.local`:
```bash
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3) Start development server
```bash
npm run dev
```

---

## Database Setup (Supabase)

1. Open your Supabase project SQL editor.
2. Run:
   - `supabase/schema.sql`
   - `supabase/seed.sql`

---

## Scripts

- `npm run dev` — run local dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run typecheck` — TypeScript checks
- `npm run db:seed` — seed script placeholder
- `npm run cron:prices` — local cron stub for price update workflow

---

## Deployment (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel.
3. Add all environment variables from `.env.local`.
4. Deploy.
5. (Optional) Configure Vercel Cron to call `POST /api/prices/update`.

---

## Next Recommended Milestones

1. Replace in-memory product/price data with Supabase queries.
2. Build robust store connectors (API first, scraper fallback) with retry + logging.
3. Add full auth + user state (favorites, alerts, comments).
4. Implement admin dashboard CRUD + audit logs.
5. Add SEO artifacts and dynamic metadata per product/category.
6. Add unit/integration/e2e tests and CI checks.

