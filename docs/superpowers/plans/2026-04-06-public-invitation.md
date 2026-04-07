# Public Invitation Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public wedding invitation page at `/invitation/[slug]` — SSR render of the card template, countdown widget, view tracking, QR code download, share buttons, and OG image for social sharing.

**Architecture:** `/invitation/[slug]/page.tsx` is a Server Component that fetches the card by slug from Supabase using the anon key (public read policy), tracks the view by hashing IP+User-Agent with SHA-256 and upserting into `page_views`, then renders the template, countdown, share buttons, and QR code. The OG image is generated via `opengraph-image.tsx` using Next.js ImageResponse API. The page is outside the `(app)` route group and requires no authentication.

**Tech Stack:** Next.js 16 App Router (RSC + Client Components), Supabase (anon key, public RLS), `qrcode` (QR generation), Web Crypto API (SHA-256 hashing), Next.js `ImageResponse` (OG image), Tailwind CSS v4, Vitest

---

## Pre-requisite: Database Setup

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- page_views table
CREATE TABLE page_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id    uuid REFERENCES cards ON DELETE CASCADE,
  view_date  date DEFAULT current_date,
  view_hash  text NOT NULL,
  UNIQUE (card_id, view_date, view_hash)
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view (public page)
CREATE POLICY "Anyone can track views"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- Only card owner can read their views (for analytics in sub-project 5)
CREATE POLICY "Card owners can read their views"
  ON page_views FOR SELECT
  USING (
    card_id IN (SELECT id FROM cards WHERE user_id = auth.uid())
  );

-- Add public read policy to cards (for /invitation/[slug])
CREATE POLICY "Public can read cards"
  ON cards FOR SELECT
  USING (true);
```

Also add to `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## File Map

| File                                                | Purpose                                      |
| --------------------------------------------------- | -------------------------------------------- |
| `src/lib/hash.ts`                                   | SHA-256 hash of IP + User-Agent              |
| `src/lib/hash.test.ts`                              | Hash utility tests                           |
| `src/components/invitation/QRCodeDownload.tsx`      | QR code canvas + download button             |
| `src/components/invitation/QRCodeDownload.test.tsx` | QR component tests                           |
| `src/components/invitation/ShareButtons.tsx`        | Facebook, Zalo, copy link, Web Share API     |
| `src/app/invitation/[slug]/opengraph-image.tsx`     | OG image 1200×630 (Next.js ImageResponse)    |
| `src/app/invitation/[slug]/page.tsx`                | RSC: fetches card, tracks view, renders page |

---

## Task 1: Hash utility (TDD)

**Files:**

- Create: `src/lib/hash.ts`
- Create: `src/lib/hash.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/hash.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { hashViewKey } from './hash';

describe('hashViewKey', () => {
  it('returns a 64-char hex string', async () => {
    const hash = await hashViewKey('192.168.1.1', 'Mozilla/5.0');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns the same hash for the same inputs', async () => {
    const a = await hashViewKey('10.0.0.1', 'Chrome/120');
    const b = await hashViewKey('10.0.0.1', 'Chrome/120');
    expect(a).toBe(b);
  });

  it('returns different hashes for different IPs', async () => {
    const a = await hashViewKey('10.0.0.1', 'Chrome/120');
    const b = await hashViewKey('10.0.0.2', 'Chrome/120');
    expect(a).not.toBe(b);
  });

  it('returns different hashes for different user agents', async () => {
    const a = await hashViewKey('10.0.0.1', 'Chrome/120');
    const b = await hashViewKey('10.0.0.1', 'Firefox/121');
    expect(a).not.toBe(b);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run src/lib/hash.test.ts
```

Expected: FAIL — `Cannot find module './hash'`

- [ ] **Step 3: Create `src/lib/hash.ts`**

```typescript
export async function hashViewKey(
  ip: string,
  userAgent: string,
): Promise<string> {
  const data = `${ip}|${userAgent}`;
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(data),
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run src/lib/hash.test.ts
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hash.ts src/lib/hash.test.ts
git commit -m "feat: add SHA-256 view key hash utility"
```

---

## Task 2: Install qrcode dependency

**Files:**

- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install qrcode and its types**

```bash
pnpm add qrcode
pnpm add -D @types/qrcode
```

Expected: both packages added.

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install qrcode dependency"
```

---

## Task 3: QRCodeDownload component (TDD)

**Files:**

- Create: `src/components/invitation/QRCodeDownload.tsx`
- Create: `src/components/invitation/QRCodeDownload.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/invitation/QRCodeDownload.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import QRCodeDownload from './QRCodeDownload'

vi.mock('qrcode', () => ({
  default: { toCanvas: vi.fn().mockResolvedValue(undefined) },
}))

describe('QRCodeDownload', () => {
  it('renders a canvas element', () => {
    render(<QRCodeDownload url="https://example.com/invitation/an-binh-2025" slug="an-binh-2025" />)
    expect(document.querySelector('canvas')).toBeTruthy()
  })

  it('renders the download button', () => {
    render(<QRCodeDownload url="https://example.com/invitation/an-binh-2025" slug="an-binh-2025" />)
    expect(screen.getByRole('button', { name: /tải qr code/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run src/components/invitation/QRCodeDownload.test.tsx
```

Expected: FAIL — `Cannot find module './QRCodeDownload'`

- [ ] **Step 3: Create `src/components/invitation/QRCodeDownload.tsx`**

```typescript
'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface Props {
  url: string
  slug: string
}

export default function QRCodeDownload({ url, slug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2 })
  }, [url])

  function handleDownload() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `thiep-cuoi-${slug}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} />
      <button
        onClick={handleDownload}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        Tải QR Code
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run src/components/invitation/QRCodeDownload.test.tsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/invitation/
git commit -m "feat: add QR code download component"
```

---

## Task 4: Share buttons component

**Files:**

- Create: `src/components/invitation/ShareButtons.tsx`

- [ ] **Step 1: Create `src/components/invitation/ShareButtons.tsx`**

```typescript
'use client'

import { useState } from 'react'

interface Props {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  async function handleCopyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleWebShare() {
    if (navigator.share) {
      await navigator.share({ title, url })
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Facebook
      </a>

      <a
        href={`https://zalo.me/share?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        Zalo
      </a>

      <button
        onClick={handleCopyLink}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {copied ? '✓ Đã sao chép' : 'Sao chép link'}
      </button>

      <button
        onClick={handleWebShare}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:hidden"
      >
        Chia sẻ
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/invitation/ShareButtons.tsx
git commit -m "feat: add share buttons component (Facebook, Zalo, copy link)"
```

---

## Task 5: OG image

**Files:**

- Create: `src/app/invitation/[slug]/opengraph-image.tsx`

The OG image runs without a request context (no cookies), so use the Supabase anon client directly — not the cookie-based `createClient` from `@/lib/supabase/server`.

- [ ] **Step 1: Create `src/app/invitation/[slug]/opengraph-image.tsx`**

```typescript
import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const alt = 'Wedding Invitation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data } = await supabase
    .from('cards')
    .select('config')
    .eq('slug', slug)
    .single()

  const config = data?.config
  const partner1: string = config?.coupleNames?.partner1 ?? ''
  const partner2: string = config?.coupleNames?.partner2 ?? ''
  const weddingDate: string = config?.weddingDate
    ? new Date(config.weddingDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  const heroImage: string | null = config?.heroImage ?? null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF9F9 0%, #F7E7E9 100%)',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.15,
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: 24,
              color: '#B76E79',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Trân trọng kính mời
          </p>
          <p
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#3A2520',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {partner1 || 'Người 1'}
          </p>
          <p style={{ fontSize: 40, color: '#D4AF37', margin: 0 }}>&amp;</p>
          <p
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#3A2520',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {partner2 || 'Người 2'}
          </p>
          {weddingDate && (
            <p style={{ fontSize: 28, color: '#666', marginTop: '16px', margin: 0 }}>
              {weddingDate}
            </p>
          )}
        </div>
      </div>
    ),
    { ...size },
  )
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/invitation/[slug]/opengraph-image.tsx"
git commit -m "feat: add OG image for invitation page"
```

---

## Task 6: Public invitation page

**Files:**

- Create: `src/app/invitation/[slug]/page.tsx`

This is a Server Component. It:

1. Fetches the card by slug using anon key (public read policy on cards table)
2. Hashes IP + User-Agent and upserts into page_views (fire-and-forget)
3. Renders: font link → countdown → template → share section (share buttons + QR code)
4. Exports `generateMetadata` for SEO

- [ ] **Step 1: Create `src/app/invitation/[slug]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import CountdownWidget from '@/components/CountdownWidget'
import ShareButtons from '@/components/invitation/ShareButtons'
import QRCodeDownload from '@/components/invitation/QRCodeDownload'
import { hashViewKey } from '@/lib/hash'
import type { Card } from '@/types/card'
import { FONT_PAIRS } from '@/lib/templates/presets'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await getSupabase().from('cards').select('config').eq('slug', slug).single()
  if (!data) return {}

  const { partner1, partner2 } = data.config.coupleNames
  const title = `${partner1} & ${partner2} — Thiệp cưới`

  return {
    title,
    description: `Trân trọng kính mời bạn đến dự lễ cưới của ${partner1} và ${partner2}`,
    openGraph: { title, type: 'website' },
  }
}

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = getSupabase()

  const { data } = await supabase.from('cards').select('*').eq('slug', slug).single()
  if (!data) notFound()

  const card = data as Card

  // Track view: hash IP + User-Agent, upsert into page_views (fire-and-forget)
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  const ua = headersList.get('user-agent') ?? ''
  const viewHash = await hashViewKey(ip, ua)
  const today = new Date().toISOString().split('T')[0]
  // intentionally not awaited — don't block page render on analytics
  supabase.from('page_views').upsert(
    { card_id: card.id, view_date: today, view_hash: viewHash },
    { onConflict: 'card_id,view_date,view_hash', ignoreDuplicates: true },
  )

  const fontPair = FONT_PAIRS[card.config.fontPair]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const publicUrl = `${appUrl}/invitation/${slug}`
  const title =
    card.config.coupleNames.partner1 && card.config.coupleNames.partner2
      ? `${card.config.coupleNames.partner1} & ${card.config.coupleNames.partner2}`
      : 'Thiệp cưới'

  return (
    <div className="min-h-screen">
      {/* Load fonts */}
      {fontPair && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontPair.heading.replace(/ /g, '+')}:wght@400;700&family=${fontPair.body.replace(/ /g, '+')}:wght@400;600&display=swap`}
        />
      )}

      {/* Countdown */}
      {card.config.weddingDate && (
        <div className="py-10 text-center">
          <CountdownWidget weddingDate={card.config.weddingDate} />
        </div>
      )}

      {/* Wedding template */}
      <TemplateRenderer config={card.config} />

      {/* Share & QR section */}
      <div className="bg-gray-50 py-14 text-center">
        <h2 className="mb-6 text-lg font-semibold text-gray-700">Chia sẻ thiệp cưới</h2>
        <ShareButtons url={publicUrl} title={title} />
        <div className="mt-10">
          <QRCodeDownload url={publicUrl} slug={slug} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Run full test suite**

```bash
pnpm test:run
```

Expected: all prior tests still pass (29 + 4 hash + 2 QR = 35 tests).

- [ ] **Step 4: Lint and format**

```bash
pnpm lint:fix && pnpm format
```

- [ ] **Step 5: Commit**

```bash
git add "src/app/invitation/"
git commit -m "feat: add public invitation page with view tracking and sharing"
```

---

## Final verification

- [ ] **Run full test suite**

```bash
pnpm test:run
```

Expected: 35 tests PASS across 9 test files.

- [ ] **Build check**

```bash
pnpm build
```

Expected: build succeeds with no type errors.

- [ ] **Manual smoke test**

```
1. Run SQL in Supabase dashboard (page_views table + policies)
2. Add NEXT_PUBLIC_APP_URL=http://localhost:3000 to .env.local
3. pnpm dev
4. Login → create a card with names + date
5. Go to /cards/[id]/preview → click "Xem trang công khai ↗"
6. Verify: countdown widget shows, template renders, share buttons appear, QR code appears
7. Verify: second visit to same page doesn't double-count (same IP+UA same day)
8. Open https://www.opengraph.xyz and test OG image with: http://localhost:3000/invitation/[slug]
```
