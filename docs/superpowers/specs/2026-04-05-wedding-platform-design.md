# Wedding Invitation Platform — Design Spec

**Date:** 2026-04-05
**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Supabase + Vercel Blob
**Architecture:** Hybrid — RSC for static/public pages, Client Components + API Routes for editor

---

## Overview

A platform for Vietnamese couples to create, customize, and share digital wedding invitations. Guests can RSVP and leave wishes without accounts. Couples manage their cards via an authenticated dashboard.

**20 features across 5 sub-projects, built in order:**

1. Auth
2. Card creation & editing
3. Public invitation page
4. RSVP & guestbook
5. Dashboard & analytics

---

## Sub-project 1: Auth

### Features

- Register with email + password
- Email verification (block unverified accounts)
- Login / logout
- JWT session management (access token 1h, refresh token 7 days)
- Forgot password (reset link valid 1 hour)

### Implementation

- **Provider:** Supabase Auth (`@supabase/ssr`)
- **Email:** Supabase SMTP (built-in, sufficient for current scale)
- **Middleware:** `middleware.ts` at root — reads session from cookie, redirects unauthenticated users away from `(app)` route group to `/login`
- **Callback route:** `src/app/api/auth/callback/route.ts` — handles Supabase OAuth callbacks and password reset token exchange

### Flow

```
Register → supabase.auth.signUp() → email verify sent → user clicks link
→ /api/auth/callback → session established → redirect to /dashboard

Login → supabase.auth.signInWithPassword() → session cookie set
→ Supabase auto-refreshes token before expiry

Forgot password → supabase.auth.resetPasswordForEmail()
→ email with link → /api/auth/callback?token=... → supabase.auth.updateUser({ password })
```

### Routes

```
/register
/login
/forgot-password
/api/auth/callback
```

---

## Sub-project 2: Card Creation & Editing

### Features

- Create new card (couple names, wedding date, venue → generates unique slug)
- Choose from 6–10 templates (JSON config, live preview)
- Edit card content (love story, schedule, family info)
- Customize color palette (12–16 presets) and font pair (10 options) with realtime preview
- Upload hero image + up to 12 gallery images (Vercel Blob)
- Countdown widget (client-side, Day.js)
- Venue map (Google Maps Places API)
- Auto-save every 500ms debounce, fallback on `beforeunload`

### Card Config Schema (JSONB in Supabase)

```typescript
type CardConfig = {
  templateId: string;

  // Content
  coupleNames: { partner1: string; partner2: string };
  weddingDate: string; // ISO string
  venue: {
    name: string;
    address: string;
    mapUrl: string;
    lat: number;
    lng: number;
  };
  loveStory: string;
  schedule: Array<{ time: string; title: string; description: string }>;
  families: Array<{ side: 'groom' | 'bride'; members: string[] }>;

  // Style
  colorPalette: string; // preset key e.g. "rose-gold"
  fontPair: string; // preset key e.g. "playfair-lato"

  // Media
  heroImage: string | null; // Vercel Blob URL
  gallery: string[]; // max 12 Vercel Blob URLs
};
```

### Template Schema

```typescript
type Template = {
  id: string;
  name: string;
  layout: 'classic' | 'modern' | 'minimal' | 'floral';
  colorPalettes: Record<
    string,
    {
      primary: string;
      secondary: string;
      accent: string;
      bg: string;
    }
  >;
  fontPairs: Record<string, { heading: string; body: string }>;
};
```

Each template is a React component that receives `CardConfig` and applies CSS variables resolved from `colorPalette` and `fontPair` keys. Style changes update only client state → instant live preview without re-fetching.

### Slug Generation

Format: `{partner1}-{partner2}-{year}` (e.g. `an-binh-2025`).
On collision: append 4 random alphanumeric chars (`an-binh-2025-k3f9`).

### API Routes

```
POST   /api/cards              — create card, generate slug
GET    /api/cards/:id          — fetch card for editor
PATCH  /api/cards/:id          — auto-save config diff
DELETE /api/cards/:id          — delete card
POST   /api/upload             — Vercel Blob upload (returns URL)
```

### Routes

```
/cards/new
/cards/[id]/edit
/cards/[id]/preview
```

---

## Sub-project 3: Public Invitation Page

### Features

- SSR render of `/invitation/[slug]`
- Mobile-first layout
- OG image for social sharing (1200×630)
- Countdown widget (days/hours/minutes/seconds, switches to "X days married" after wedding date)
- View tracking (unique per IP+UA hash per day)
- QR code (download as PNG)
- Share buttons (Facebook, Zalo, copy link, Web Share API on mobile)

### Architecture

- **Server Component:** fetches card from Supabase by slug, passes config to template component
- **OG Image:** `src/app/invitation/[slug]/opengraph-image.tsx` — renders couple names + hero image + date at build/request time via Next.js Image Response API
- **Countdown:** `'use client'` component, hydrates after SSR, uses `setInterval(1000)` + Day.js for timezone-aware calculation
- **View tracking:** Server Component calls `POST /api/views` with hashed IP + User-Agent; hash is SHA-256, never stores raw IP

### API Routes

```
POST /api/views  — { cardId, hash } — upserts into page_views
GET  /api/cards/[slug]/public — public card data (no auth)
```

### Routes

```
/invitation/[slug]
```

---

## Sub-project 4: RSVP & Guestbook

### Features

- RSVP form on public page (no auth required): name, guest count, status (yes/no/maybe), note
- Rate limit: 3 submissions per IP per card per hour (enforced via Supabase RLS + timestamp check)
- Email notification to card owner on new RSVP (via Supabase SMTP trigger in API route)
- Guestbook: guests submit wishes (name + message), stored as `approved: false` by default
- Card owner approves/rejects wishes in dashboard before they appear on public page
- Wishes displayed with cursor-based pagination on public page

### API Routes

```
POST   /api/cards/:id/rsvp          — submit RSVP (no auth)
GET    /api/cards/:id/rsvp          — list RSVPs (auth, owner only)
GET    /api/cards/:id/rsvp?format=csv — export CSV (auth, owner only)
POST   /api/cards/:id/wishes        — submit wish (no auth)
GET    /api/cards/:id/wishes        — list approved wishes (no auth, paginated)
PATCH  /api/cards/:id/wishes/:wid   — approve/reject (auth, owner only)
```

---

## Sub-project 5: Dashboard & Analytics

### Features

- Card list with quick stats (views, RSVP count, wish count)
- Create new card button
- RSVP management table: filter by status, total attendees, CSV export
- Wish moderation: approve/reject pending wishes
- View analytics: unique views per day for last 7 days, rendered as bar chart

### Architecture

- **Card list & stats:** RSC, direct Supabase queries
- **RSVP table:** Client Component (filtering client-side), data fetched on mount
- **Chart:** Client Component using `recharts`
- **Wish moderation:** optimistic UI — approve/reject triggers `PATCH` then revalidates

### API Routes

```
GET /api/dashboard              — summary stats for all user's cards
GET /api/cards/:id/views        — view counts grouped by day (last 7 days)
```

### Routes

```
/dashboard
/cards/[id]/rsvp
/cards/[id]/wishes
```

---

## Database Schema

```sql
-- Managed by Supabase Auth
-- auth.users (id, email, created_at, ...)

-- App tables
CREATE TABLE cards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL,
  slug        text UNIQUE NOT NULL,
  config      jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE TABLE templates (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  config      jsonb NOT NULL,
  preview_url text
);

CREATE TABLE card_images (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id    uuid REFERENCES cards ON DELETE CASCADE,
  url        text NOT NULL,
  type       text CHECK (type IN ('hero', 'gallery')),
  sort_order int DEFAULT 0
);

CREATE TABLE rsvp (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id    uuid REFERENCES cards ON DELETE CASCADE,
  name       text NOT NULL,
  guests     int DEFAULT 1,
  status     text CHECK (status IN ('yes', 'no', 'maybe')),
  note       text,
  ip_hash    text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE wishes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id    uuid REFERENCES cards ON DELETE CASCADE,
  name       text NOT NULL,
  message    text NOT NULL,
  approved   bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE page_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id    uuid REFERENCES cards ON DELETE CASCADE,
  view_date  date DEFAULT current_date,
  view_hash  text NOT NULL,
  UNIQUE (card_id, view_date, view_hash)
);
```

---

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── register/page.tsx
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx               # auth guard + nav
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   └── cards/
│   │       ├── new/page.tsx
│   │       └── [id]/
│   │           ├── edit/page.tsx
│   │           └── preview/page.tsx
│   ├── invitation/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx
│   └── api/
│       ├── auth/callback/route.ts
│       ├── cards/route.ts
│       ├── cards/[id]/route.ts
│       ├── cards/[id]/rsvp/route.ts
│       ├── cards/[id]/wishes/route.ts
│       ├── cards/[id]/views/route.ts
│       └── upload/route.ts
├── components/
│   ├── templates/                   # one component per template
│   ├── editor/                      # editor panels (content, style, media)
│   └── ui/                          # shared UI primitives
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # browser client
│   │   ├── server.ts                # server client
│   │   └── middleware.ts
│   ├── templates/                   # template JSON configs
│   └── utils.ts
└── middleware.ts
```

---

## Key Dependencies to Add

| Package                     | Purpose                       |
| --------------------------- | ----------------------------- |
| `@supabase/supabase-js`     | Supabase client               |
| `@supabase/ssr`             | Session management in Next.js |
| `@vercel/blob`              | Image uploads                 |
| `@googlemaps/js-api-loader` | Google Maps                   |
| `dayjs`                     | Countdown + date formatting   |
| `qrcode`                    | QR code generation            |
| `recharts`                  | Dashboard chart               |
| `shadcn/ui`                 | UI components                 |

---

## Build Order

Each sub-project is independent enough to spec, plan, and implement separately:

1. **Auth** — foundation for everything
2. **Card creation & editing** — core product value
3. **Public invitation page** — what guests see
4. **RSVP & guestbook** — guest interaction
5. **Dashboard & analytics** — owner management
