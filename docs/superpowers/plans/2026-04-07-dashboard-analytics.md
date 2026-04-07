# Dashboard & Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give card owners visibility into invitation performance — page views over time, RSVP breakdown, and wish counts — via a per-card analytics page and aggregate stats banner on the main dashboard.

**Architecture:** A new RSC at `/cards/[id]/analytics` queries Supabase directly (server client) to fetch page views, RSVP stats, and wish counts for a card the user owns. A `ViewsChart` client component renders a CSS-based bar chart from `DailyView[]` props (no external chart library). The main dashboard gains a top stats banner (total views / RSVPs / wishes across all cards) and a "Thống kê" link per card.

**Tech Stack:** Next.js 16 App Router, Supabase (SSR client for auth reads), Tailwind CSS v4, Vitest + React Testing Library (ViewsChart), pnpm

---

## Pre-requisite: Database Setup

Run in **Supabase Dashboard → SQL Editor** (safe to run even if table already exists):

```sql
CREATE TABLE IF NOT EXISTS page_views (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     uuid REFERENCES cards ON DELETE CASCADE,
  view_date   date NOT NULL,
  view_hash   text NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (card_id, view_date, view_hash)
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'page_views' AND policyname = 'Anyone can insert page views'
  ) THEN
    CREATE POLICY "Anyone can insert page views"
      ON page_views FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'page_views' AND policyname = 'Card owners can read page views'
  ) THEN
    CREATE POLICY "Card owners can read page views"
      ON page_views FOR SELECT
      USING (card_id IN (SELECT id FROM cards WHERE user_id = auth.uid()));
  END IF;
END $$;
```

---

## File Map

| File                                           | Purpose                                          |
| ---------------------------------------------- | ------------------------------------------------ |
| `src/types/analytics.ts`                       | DailyView interface                              |
| `src/components/analytics/ViewsChart.tsx`      | CSS bar chart for daily views (client component) |
| `src/components/analytics/ViewsChart.test.tsx` | 4 tests for ViewsChart                           |
| `src/app/(app)/cards/[id]/analytics/page.tsx`  | Per-card analytics page (RSC)                    |
| `src/app/(app)/dashboard/page.tsx`             | Modify: add stats banner + "Thống kê" link       |

---

## Task 1: Analytics types

**Files:**

- Create: `src/types/analytics.ts`

- [ ] **Step 1: Create `src/types/analytics.ts`**

```typescript
export interface DailyView {
  view_date: string;
  view_count: number;
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/analytics.ts
git commit -m "feat: add analytics type definitions"
```

---

## Task 2: ViewsChart component (TDD)

**Files:**

- Create: `src/components/analytics/ViewsChart.tsx`
- Create: `src/components/analytics/ViewsChart.test.tsx`

Pure presentational component — receives `days: DailyView[]` and renders a CSS bar chart. No `'use client'` needed (no state/effects).

- [ ] **Step 1: Write failing tests**

Create `src/components/analytics/ViewsChart.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ViewsChart from './ViewsChart'
import type { DailyView } from '@/types/analytics'

describe('ViewsChart', () => {
  it('renders a bar for each day', () => {
    const days: DailyView[] = [
      { view_date: '2026-04-01', view_count: 3 },
      { view_date: '2026-04-02', view_count: 7 },
      { view_date: '2026-04-03', view_count: 1 },
    ]
    render(<ViewsChart days={days} />)
    expect(screen.getAllByTestId('views-bar')).toHaveLength(3)
  })

  it('shows date labels in MM-DD format', () => {
    const days: DailyView[] = [
      { view_date: '2026-04-01', view_count: 5 },
    ]
    render(<ViewsChart days={days} />)
    expect(screen.getByText('04-01')).toBeInTheDocument()
  })

  it('shows zero state when no data', () => {
    render(<ViewsChart days={[]} />)
    expect(screen.getByText(/chưa có lượt xem/i)).toBeInTheDocument()
  })

  it('shows view count above each bar', () => {
    const days: DailyView[] = [
      { view_date: '2026-04-01', view_count: 42 },
    ]
    render(<ViewsChart days={days} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test:run src/components/analytics/ViewsChart.test.tsx
```

Expected: FAIL — `Cannot find module './ViewsChart'`

- [ ] **Step 3: Create `src/components/analytics/ViewsChart.tsx`**

```typescript
import type { DailyView } from '@/types/analytics'

interface Props {
  days: DailyView[]
}

export default function ViewsChart({ days }: Props) {
  if (days.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        Chưa có lượt xem nào trong 14 ngày qua
      </p>
    )
  }

  const maxCount = Math.max(...days.map(d => d.view_count), 1)

  return (
    <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
      {days.map(day => {
        const heightPct = Math.round((day.view_count / maxCount) * 100)
        const shortDate = day.view_date.slice(5) // "MM-DD"
        return (
          <div
            key={day.view_date}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span className="text-xs text-gray-500">{day.view_count}</span>
            <div
              data-testid="views-bar"
              className="w-full rounded-t bg-blue-400 transition-all"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] text-gray-400">{shortDate}</span>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect 4 PASS**

```bash
pnpm test:run src/components/analytics/ViewsChart.test.tsx
```

Expected: 4 tests PASS. Fix any failures before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/ViewsChart.tsx src/components/analytics/ViewsChart.test.tsx
git commit -m "feat: add views chart component"
```

---

## Task 3: Per-card analytics page

**Files:**

- Create: `src/app/(app)/cards/[id]/analytics/page.tsx`

RSC. Auth + ownership check. Queries Supabase directly for page views, RSVPs, and wishes. Renders chart + stats.

- [ ] **Step 1: Create `src/app/(app)/cards/[id]/analytics/page.tsx`**

```typescript
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ViewsChart from '@/components/analytics/ViewsChart'
import type { DailyView } from '@/types/analytics'

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify ownership
  const { data: card } = await supabase
    .from('cards')
    .select('id, slug, config')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  if (!card) notFound()

  // Last 14 days of page views
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - 13)
  const fromDateStr = fromDate.toISOString().split('T')[0]

  const [{ data: viewRows }, { data: rsvps }, { count: wishCount }] =
    await Promise.all([
      supabase
        .from('page_views')
        .select('view_date')
        .eq('card_id', id)
        .gte('view_date', fromDateStr),
      supabase
        .from('rsvps')
        .select('attending, guest_count')
        .eq('card_id', id),
      supabase
        .from('wishes')
        .select('id', { count: 'exact', head: true })
        .eq('card_id', id),
    ])

  // Group page views by date
  const viewMap = new Map<string, number>()
  for (const row of viewRows ?? []) {
    viewMap.set(row.view_date, (viewMap.get(row.view_date) ?? 0) + 1)
  }
  const recentDays: DailyView[] = Array.from(viewMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([view_date, view_count]) => ({ view_date, view_count }))
  const totalViews = recentDays.reduce((sum, d) => sum + d.view_count, 0)

  // RSVP stats
  const rsvpList = rsvps ?? []
  const rsvpAttending = rsvpList.filter(r => r.attending).length
  const rsvpNotAttending = rsvpList.filter(r => !r.attending).length
  const totalGuests = rsvpList
    .filter(r => r.attending)
    .reduce((sum, r) => sum + r.guest_count, 0)

  const { partner1, partner2 } = card.config.coupleNames
  const coupleTitle = partner1 && partner2 ? `${partner1} & ${partner2}` : 'Thiệp'

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Dashboard
        </Link>
        <span className="text-gray-300">|</span>
        <h1 className="text-xl font-semibold text-gray-900">
          {coupleTitle} — Thống kê
        </h1>
      </div>

      {/* Top stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
          <p className="mt-1 text-sm text-gray-500">Lượt xem (14 ngày)</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{rsvpList.length}</p>
          <p className="mt-1 text-sm text-gray-500">Phản hồi RSVP</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{rsvpAttending}</p>
          <p className="mt-1 text-sm text-gray-500">Tham dự ({totalGuests} người)</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{wishCount ?? 0}</p>
          <p className="mt-1 text-sm text-gray-500">Lời chúc</p>
        </div>
      </div>

      {/* Views chart */}
      <div className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Lượt xem 14 ngày gần nhất
        </h2>
        <ViewsChart days={recentDays} />
      </div>

      {/* RSVP breakdown */}
      {rsvpList.length > 0 && (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Phân tích RSVP
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-gray-600">Tham dự</span>
              <div className="flex-1 rounded-full bg-gray-100">
                <div
                  className="h-4 rounded-full bg-green-400"
                  style={{
                    width: `${Math.round((rsvpAttending / rsvpList.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium text-gray-700">
                {rsvpAttending}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-sm text-gray-600">Vắng mặt</span>
              <div className="flex-1 rounded-full bg-gray-100">
                <div
                  className="h-4 rounded-full bg-red-400"
                  style={{
                    width: `${Math.round((rsvpNotAttending / rsvpList.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium text-gray-700">
                {rsvpNotAttending}
              </span>
            </div>
          </div>
        </div>
      )}
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
git add "src/app/(app)/cards/[id]/analytics/"
git commit -m "feat: add per-card analytics page"
```

---

## Task 4: Update dashboard

**Files:**

- Modify: `src/app/(app)/dashboard/page.tsx`

Add a stats banner showing totals across all cards, and add a "Thống kê" link per card (2×2 grid of action buttons).

- [ ] **Step 1: Read current `src/app/(app)/dashboard/page.tsx`**

Note the existing structure before editing.

- [ ] **Step 2: Replace `src/app/(app)/dashboard/page.tsx`**

```typescript
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Card } from '@/types/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const cardList = (cards ?? []) as Card[]
  const cardIds = cardList.map(c => c.id)

  // Aggregate stats across all cards (only if user has cards)
  const [totalViews, totalRsvps, totalWishes] =
    cardIds.length > 0
      ? await Promise.all([
          supabase
            .from('page_views')
            .select('id', { count: 'exact', head: true })
            .in('card_id', cardIds)
            .then(r => r.count ?? 0),
          supabase
            .from('rsvps')
            .select('id', { count: 'exact', head: true })
            .in('card_id', cardIds)
            .then(r => r.count ?? 0),
          supabase
            .from('wishes')
            .select('id', { count: 'exact', head: true })
            .in('card_id', cardIds)
            .then(r => r.count ?? 0),
        ])
      : [0, 0, 0]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Thiệp của tôi</h1>
          <p className="mt-1 text-gray-600">{cardList.length} thiệp</p>
        </div>
        <Link
          href="/cards/new"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + Tạo thiệp mới
        </Link>
      </div>

      {/* Aggregate stats banner */}
      {cardList.length > 0 && (
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalViews}</p>
            <p className="mt-1 text-xs text-gray-500">Tổng lượt xem</p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{totalRsvps}</p>
            <p className="mt-1 text-xs text-gray-500">Tổng RSVP</p>
          </div>
          <div className="rounded-lg border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{totalWishes}</p>
            <p className="mt-1 text-xs text-gray-500">Tổng lời chúc</p>
          </div>
        </div>
      )}

      {cardList.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-gray-500">Bạn chưa có thiệp nào.</p>
          <Link
            href="/cards/new"
            className="mt-3 inline-block text-blue-600 hover:underline"
          >
            Tạo thiệp đầu tiên →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardList.map(card => {
            const { coupleNames, weddingDate } = card.config
            return (
              <div
                key={card.id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">
                  {coupleNames.partner1 && coupleNames.partner2
                    ? `${coupleNames.partner1} & ${coupleNames.partner2}`
                    : 'Thiệp chưa đặt tên'}
                </h3>
                {weddingDate && (
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(weddingDate).toLocaleDateString('vi-VN')}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  /invitation/{card.slug}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/cards/${card.id}/edit`}
                    className="rounded border border-gray-300 px-2 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    href={`/cards/${card.id}/preview`}
                    className="rounded border border-gray-300 px-2 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Xem trước
                  </Link>
                  <Link
                    href={`/cards/${card.id}/guests`}
                    className="rounded border border-gray-300 px-2 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Khách mời
                  </Link>
                  <Link
                    href={`/cards/${card.id}/analytics`}
                    className="rounded border border-gray-300 px-2 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Thống kê
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 4: Run full test suite**

```bash
pnpm test:run
```

Expected: 47 tests PASS (43 existing + 4 new ViewsChart tests).

- [ ] **Step 5: Lint and format**

```bash
pnpm lint:fix && pnpm format
```

- [ ] **Step 6: Commit**

```bash
git add "src/app/(app)/dashboard/page.tsx"
git commit -m "feat: add stats banner and analytics link to dashboard"
```

---

## Self-Review

### Spec Coverage

- ✅ Page views chart (last 14 days) → Task 2 (ViewsChart) + Task 3 (analytics page)
- ✅ RSVP breakdown → Task 3 (analytics page, horizontal bar chart)
- ✅ Wish count → Task 3 (top stats)
- ✅ Aggregate stats on dashboard → Task 4 (stats banner)
- ✅ Navigation link from dashboard → Task 4 ("Thống kê" in 2×2 grid)

### Placeholder Scan

- No TBD/TODO — all code is complete
- All file paths are exact

### Type Consistency

- `DailyView` defined in Task 1, used in Task 2 (ViewsChart props) and Task 3 (RSC)
- `Card` imported from `@/types/card` in Task 4 (same pattern as current dashboard)
- `view_date`, `view_count` field names consistent across Task 1, 2, 3
