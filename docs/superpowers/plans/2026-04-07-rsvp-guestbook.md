# RSVP & Guestbook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let guests RSVP and leave guestbook wishes on the public invitation page, and let card owners view all responses in a dedicated dashboard page.

**Architecture:** Two new Supabase tables (`rsvps`, `wishes`) with public INSERT policies and owner-only SELECT for RSVPs. Two API routes handle public writes and authenticated reads. Two Client Components (`RSVPForm`, `GuestbookSection`) are added to the existing `/invitation/[slug]/page.tsx` RSC. A new Server Component at `/cards/[id]/guests` shows the owner a table of RSVPs and list of wishes. The dashboard card grid gains a "Khách mời" link per card.

**Tech Stack:** Next.js 16 App Router, Supabase (anon client for public writes, SSR client for auth reads), shadcn/ui (Button, Input, Label), Tailwind CSS v4, Vitest + React Testing Library

---

## Pre-requisite: Database Setup

Run in **Supabase Dashboard → SQL Editor**:

```sql
-- RSVP table
CREATE TABLE rsvps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     uuid REFERENCES cards ON DELETE CASCADE,
  name        text NOT NULL,
  email       text,
  attending   boolean NOT NULL,
  guest_count int NOT NULL DEFAULT 1,
  message     text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit RSVP"
  ON rsvps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Card owners can view RSVPs"
  ON rsvps FOR SELECT
  USING (card_id IN (SELECT id FROM cards WHERE user_id = auth.uid()));

-- Wishes (guestbook) table
CREATE TABLE wishes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id    uuid REFERENCES cards ON DELETE CASCADE,
  name       text NOT NULL,
  message    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit wish"
  ON wishes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read wishes"
  ON wishes FOR SELECT
  USING (true);
```

---

## File Map

| File                                                  | Purpose                                                  |
| ----------------------------------------------------- | -------------------------------------------------------- |
| `src/types/rsvp.ts`                                   | RSVP and Wish TypeScript interfaces                      |
| `src/app/api/rsvp/route.ts`                           | POST (public) + GET (auth) for RSVPs                     |
| `src/app/api/wishes/route.ts`                         | POST (public) + GET (public) for wishes                  |
| `src/components/invitation/RSVPForm.tsx`              | RSVP form — name, email, attending, guest count, message |
| `src/components/invitation/RSVPForm.test.tsx`         | RSVPForm tests                                           |
| `src/components/invitation/GuestbookSection.tsx`      | Wish form + wishes list                                  |
| `src/components/invitation/GuestbookSection.test.tsx` | GuestbookSection tests                                   |
| `src/app/invitation/[slug]/page.tsx`                  | Modify: add RSVPForm + GuestbookSection sections         |
| `src/app/(app)/cards/[id]/guests/page.tsx`            | Dashboard: RSVPs table + wishes list                     |
| `src/app/(app)/dashboard/page.tsx`                    | Modify: add "Khách mời" link per card                    |

---

## Task 1: Types

**Files:**

- Create: `src/types/rsvp.ts`

- [ ] **Step 1: Create `src/types/rsvp.ts`**

```typescript
export interface RSVP {
  id: string;
  card_id: string;
  name: string;
  email: string | null;
  attending: boolean;
  guest_count: number;
  message: string | null;
  created_at: string;
}

export interface Wish {
  id: string;
  card_id: string;
  name: string;
  message: string;
  created_at: string;
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/rsvp.ts
git commit -m "feat: add RSVP and Wish type definitions"
```

---

## Task 2: RSVP API route

**Files:**

- Create: `src/app/api/rsvp/route.ts`

`POST` is public (anon client). `GET` requires authentication (server client with cookies).

- [ ] **Step 1: Create `src/app/api/rsvp/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

function getAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { cardId, name, email, attending, guestCount, message } = body;

  if (
    !cardId ||
    !name?.trim() ||
    attending === undefined ||
    attending === null
  ) {
    return NextResponse.json(
      { error: 'cardId, name, attending are required' },
      { status: 400 },
    );
  }

  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from('rsvps')
    .insert({
      card_id: cardId,
      name: name.trim(),
      email: email?.trim() || null,
      attending,
      guest_count: attending ? Number(guestCount) || 1 : 0,
      message: message?.trim() || null,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('cardId');
  if (!cardId) {
    return NextResponse.json({ error: 'cardId is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/rsvp/route.ts
git commit -m "feat: add RSVP API route (POST public, GET auth)"
```

---

## Task 3: Wishes API route

**Files:**

- Create: `src/app/api/wishes/route.ts`

Both `POST` and `GET` are public (anon client).

- [ ] **Step 1: Create `src/app/api/wishes/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { cardId, name, message } = body;

  if (!cardId || !name?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'cardId, name, message are required' },
      { status: 400 },
    );
  }

  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from('wishes')
    .insert({ card_id: cardId, name: name.trim(), message: message.trim() })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('cardId');
  if (!cardId) {
    return NextResponse.json({ error: 'cardId is required' }, { status: 400 });
  }

  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from('wishes')
    .select('id, name, message, created_at')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/wishes/route.ts
git commit -m "feat: add wishes API route (POST + GET public)"
```

---

## Task 4: RSVPForm component (TDD)

**Files:**

- Create: `src/components/invitation/RSVPForm.tsx`
- Create: `src/components/invitation/RSVPForm.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/invitation/RSVPForm.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RSVPForm from './RSVPForm'

describe('RSVPForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders name field and attendance buttons', () => {
    render(<RSVPForm cardId="card-123" />)
    expect(screen.getByLabelText(/họ tên/i)).toBeInTheDocument()
    expect(screen.getByText(/tôi sẽ tham dự/i)).toBeInTheDocument()
    expect(screen.getByText(/tôi không thể đến/i)).toBeInTheDocument()
  })

  it('shows error when submitting without name or attendance', async () => {
    render(<RSVPForm cardId="card-123" />)
    fireEvent.click(screen.getByRole('button', { name: /^xác nhận$/i }))
    await waitFor(() => {
      expect(screen.getByText(/vui lòng điền tên/i)).toBeInTheDocument()
    })
  })

  it('shows guest count field only when attending is selected', () => {
    render(<RSVPForm cardId="card-123" />)
    expect(screen.queryByLabelText(/số người tham dự/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByText(/tôi sẽ tham dự/i))
    expect(screen.getByLabelText(/số người tham dự/i)).toBeInTheDocument()
  })

  it('shows success state after successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '1', name: 'An', attending: true }),
    }))
    render(<RSVPForm cardId="card-123" />)
    fireEvent.change(screen.getByLabelText(/họ tên/i), { target: { value: 'Nguyễn A' } })
    fireEvent.click(screen.getByText(/tôi sẽ tham dự/i))
    fireEvent.click(screen.getByRole('button', { name: /^xác nhận$/i }))
    await waitFor(() => {
      expect(screen.getByText(/cảm ơn bạn đã xác nhận/i)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test:run src/components/invitation/RSVPForm.test.tsx
```

Expected: FAIL — `Cannot find module './RSVPForm'`

- [ ] **Step 3: Create `src/components/invitation/RSVPForm.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  cardId: string
}

export default function RSVPForm({ cardId }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || attending === null) {
      setError('Vui lòng điền tên và xác nhận tham dự')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          name,
          email,
          attending,
          guestCount: attending ? guestCount : 0,
          message,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Có lỗi xảy ra')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">
          {attending
            ? '🎉 Cảm ơn bạn đã xác nhận tham dự!'
            : 'Cảm ơn bạn đã phản hồi!'}
        </p>
        <p className="mt-2 text-sm text-green-600">
          {attending
            ? 'Chúng tôi rất vui khi được gặp bạn!'
            : 'Chúng tôi rất tiếc khi bạn không thể tham dự.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-1">
        <Label htmlFor="rsvp-name">Họ tên *</Label>
        <Input
          id="rsvp-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="rsvp-email">Email (để nhận xác nhận)</Label>
        <Input
          id="rsvp-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Bạn có tham dự không? *</Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
              attending === true
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            ✓ Tôi sẽ tham dự
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
              attending === false
                ? 'border-red-400 bg-red-50 text-red-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            ✗ Tôi không thể đến
          </button>
        </div>
      </div>

      {attending && (
        <div className="space-y-1">
          <Label htmlFor="rsvp-guests">Số người tham dự (bao gồm bạn)</Label>
          <Input
            id="rsvp-guests"
            type="number"
            min={1}
            max={10}
            value={guestCount}
            onChange={e => setGuestCount(Number(e.target.value))}
          />
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="rsvp-message">Lời chúc (tùy chọn)</Label>
        <textarea
          id="rsvp-message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          placeholder="Gửi lời chúc mừng đến đôi uyên ương..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Đang gửi...' : 'Xác nhận'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Run tests — expect 4 PASS**

```bash
pnpm test:run src/components/invitation/RSVPForm.test.tsx
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/invitation/RSVPForm.tsx src/components/invitation/RSVPForm.test.tsx
git commit -m "feat: add RSVP form component"
```

---

## Task 5: GuestbookSection component (TDD)

**Files:**

- Create: `src/components/invitation/GuestbookSection.tsx`
- Create: `src/components/invitation/GuestbookSection.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/invitation/GuestbookSection.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GuestbookSection from './GuestbookSection'

describe('GuestbookSection', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    }))
  })

  it('renders name and message fields', () => {
    render(<GuestbookSection cardId="card-123" />)
    expect(screen.getByLabelText(/họ tên/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lời chúc/i)).toBeInTheDocument()
  })

  it('shows error if fields are empty on submit', async () => {
    render(<GuestbookSection cardId="card-123" />)
    fireEvent.click(screen.getByRole('button', { name: /gửi lời chúc/i }))
    await waitFor(() => {
      expect(screen.getByText(/vui lòng điền đầy đủ/i)).toBeInTheDocument()
    })
  })

  it('shows success state after submission', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // GET wishes on mount
      .mockResolvedValueOnce({                                              // POST wish
        ok: true,
        json: () => Promise.resolve({
          id: '1', name: 'Nguyễn A', message: 'Chúc mừng', created_at: new Date().toISOString(),
        }),
      })
    vi.stubGlobal('fetch', mockFetch)

    render(<GuestbookSection cardId="card-123" />)
    fireEvent.change(screen.getByLabelText(/họ tên/i), { target: { value: 'Nguyễn A' } })
    fireEvent.change(screen.getByLabelText(/lời chúc/i), { target: { value: 'Chúc mừng hạnh phúc' } })
    fireEvent.click(screen.getByRole('button', { name: /gửi lời chúc/i }))
    await waitFor(() => {
      expect(screen.getByText(/lời chúc của bạn đã được gửi/i)).toBeInTheDocument()
    })
  })

  it('renders existing wishes fetched on mount', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: '1', name: 'Trần B', message: 'Hạnh phúc mãi mãi', created_at: '2025-06-01T00:00:00Z' },
      ]),
    }))
    render(<GuestbookSection cardId="card-123" />)
    await waitFor(() => {
      expect(screen.getByText('Trần B')).toBeInTheDocument()
      expect(screen.getByText('Hạnh phúc mãi mãi')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test:run src/components/invitation/GuestbookSection.test.tsx
```

Expected: FAIL — `Cannot find module './GuestbookSection'`

- [ ] **Step 3: Create `src/components/invitation/GuestbookSection.tsx`**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Wish } from '@/types/rsvp'

interface Props {
  cardId: string
}

export default function GuestbookSection({ cardId }: Props) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/wishes?cardId=${cardId}`)
      .then(r => r.json())
      .then((data: Wish[]) => setWishes(data))
      .catch(() => {})
  }, [cardId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      setError('Vui lòng điền đầy đủ họ tên và lời chúc')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, name, message }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Có lỗi xảy ra')
        return
      }
      const newWish = (await res.json()) as Wish
      setWishes(prev => [newWish, ...prev])
      setSubmitted(true)
      setName('')
      setMessage('')
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Submission form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-1">
            <Label htmlFor="wish-name">Họ tên *</Label>
            <Input
              id="wish-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wish-message">Lời chúc *</Label>
            <textarea
              id="wish-message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Chúc mừng hạnh phúc..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Đang gửi...' : 'Gửi lời chúc'}
          </Button>
        </form>
      ) : (
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-sm font-medium text-green-800">
            ✓ Lời chúc của bạn đã được gửi!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 text-xs text-green-600 hover:underline"
          >
            Gửi thêm
          </button>
        </div>
      )}

      {/* Wishes list */}
      {wishes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {wishes.length} lời chúc
          </h3>
          {wishes.map(wish => (
            <div key={wish.id} className="rounded-lg border bg-white p-4">
              <p className="text-sm font-semibold text-gray-900">{wish.name}</p>
              <p className="mt-1 text-sm text-gray-700">{wish.message}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(wish.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect 4 PASS**

```bash
pnpm test:run src/components/invitation/GuestbookSection.test.tsx
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/invitation/GuestbookSection.tsx src/components/invitation/GuestbookSection.test.tsx
git commit -m "feat: add guestbook section component"
```

---

## Task 6: Update invitation page

**Files:**

- Modify: `src/app/invitation/[slug]/page.tsx`

Add `RSVPForm` and `GuestbookSection` to the public invitation page between the template and the share section.

- [ ] **Step 1: Replace `src/app/invitation/[slug]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import CountdownWidget from '@/components/CountdownWidget'
import ShareButtons from '@/components/invitation/ShareButtons'
import QRCodeDownload from '@/components/invitation/QRCodeDownload'
import RSVPForm from '@/components/invitation/RSVPForm'
import GuestbookSection from '@/components/invitation/GuestbookSection'
import { hashViewKey } from '@/lib/hash'
import type { Card } from '@/types/card'
import { FONT_PAIRS } from '@/lib/templates/presets'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await getSupabase()
    .from('cards')
    .select('config')
    .eq('slug', slug)
    .single()
  if (!data) return {}

  const { partner1, partner2 } = data.config.coupleNames
  const title = `${partner1} & ${partner2} — Thiệp cưới`

  return {
    title,
    description: `Trân trọng kính mời bạn đến dự lễ cưới của ${partner1} và ${partner2}`,
    openGraph: { title, type: 'website' },
  }
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = getSupabase()

  const { data } = await supabase.from('cards').select('*').eq('slug', slug).single()
  if (!data) notFound()

  const card = data as Card

  // Track view (fire-and-forget)
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  const ua = headersList.get('user-agent') ?? ''
  const viewHash = await hashViewKey(ip, ua)
  const today = new Date().toISOString().split('T')[0]
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

      {/* RSVP section */}
      <div className="bg-white px-6 py-14">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
            Xác nhận tham dự
          </h2>
          <p className="mb-8 text-center text-gray-500">
            Vui lòng xác nhận để chúng tôi chuẩn bị tốt nhất cho ngày trọng đại
          </p>
          <RSVPForm cardId={card.id} />
        </div>
      </div>

      {/* Guestbook section */}
      <div className="bg-gray-50 px-6 py-14">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
            Sổ lưu bút
          </h2>
          <p className="mb-8 text-center text-gray-500">
            Để lại lời chúc cho đôi uyên ương
          </p>
          <GuestbookSection cardId={card.id} />
        </div>
      </div>

      {/* Share & QR section */}
      <div className="bg-white py-14 text-center">
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

- [ ] **Step 3: Commit**

```bash
git add "src/app/invitation/[slug]/page.tsx"
git commit -m "feat: add RSVP and guestbook sections to invitation page"
```

---

## Task 7: Guests dashboard page

**Files:**

- Create: `src/app/(app)/cards/[id]/guests/page.tsx`

Server Component showing RSVPs (table with stats) and wishes (list) for a card the user owns.

- [ ] **Step 1: Create `src/app/(app)/cards/[id]/guests/page.tsx`**

```typescript
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { RSVP, Wish } from '@/types/rsvp'

export default async function GuestsPage({
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

  const { data: card } = await supabase
    .from('cards')
    .select('id, slug, config')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!card) notFound()

  const [{ data: rsvps }, { data: wishes }] = await Promise.all([
    supabase
      .from('rsvps')
      .select('*')
      .eq('card_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('wishes')
      .select('*')
      .eq('card_id', id)
      .order('created_at', { ascending: false }),
  ])

  const rsvpList = (rsvps ?? []) as RSVP[]
  const wishesList = (wishes ?? []) as Wish[]

  const attending = rsvpList.filter(r => r.attending)
  const notAttending = rsvpList.filter(r => !r.attending)
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0)

  const { partner1, partner2 } = card.config.coupleNames

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Dashboard
        </Link>
        <span className="text-gray-300">|</span>
        <h1 className="text-xl font-semibold text-gray-900">
          {partner1 && partner2 ? `${partner1} & ${partner2}` : 'Thiệp'} — Khách mời
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{rsvpList.length}</p>
          <p className="mt-1 text-sm text-gray-500">Phản hồi</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{attending.length}</p>
          <p className="mt-1 text-sm text-gray-500">Tham dự ({totalGuests} người)</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{notAttending.length}</p>
          <p className="mt-1 text-sm text-gray-500">Vắng mặt</p>
        </div>
      </div>

      {/* RSVPs */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Xác nhận tham dự
        </h2>
        {rsvpList.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có phản hồi nào.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Tham dự</th>
                  <th className="px-4 py-3">Số người</th>
                  <th className="px-4 py-3">Lời chúc</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {rsvpList.map(rsvp => (
                  <tr key={rsvp.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{rsvp.name}</td>
                    <td className="px-4 py-3 text-gray-500">{rsvp.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      {rsvp.attending ? (
                        <span className="font-medium text-green-600">✓ Có</span>
                      ) : (
                        <span className="text-red-500">✗ Không</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {rsvp.attending ? rsvp.guest_count : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{rsvp.message ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wishes */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Sổ lưu bút ({wishesList.length})
        </h2>
        {wishesList.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có lời chúc nào.</p>
        ) : (
          <div className="space-y-3">
            {wishesList.map(wish => (
              <div key={wish.id} className="rounded-lg border bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">{wish.name}</p>
                <p className="mt-1 text-sm text-gray-700">{wish.message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(wish.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            ))}
          </div>
        )}
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

- [ ] **Step 3: Commit**

```bash
git add "src/app/(app)/cards/[id]/guests/"
git commit -m "feat: add guests dashboard page (RSVPs + wishes)"
```

---

## Task 8: Update dashboard with guests link

**Files:**

- Modify: `src/app/(app)/dashboard/page.tsx`

Add a "Khách mời" link to each card in the dashboard grid.

- [ ] **Step 1: Replace `src/app/(app)/dashboard/page.tsx`**

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Card } from '@/types/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false })

  const cardList = (cards ?? []) as Card[]

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
                <div className="mt-4 grid grid-cols-3 gap-2">
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

- [ ] **Step 2: Run full test suite**

```bash
pnpm test:run
```

Expected: 35 + 4 RSVPForm + 4 GuestbookSection = 43 tests PASS.

- [ ] **Step 3: Verify type-check and lint**

```bash
pnpm type-check && pnpm lint:fix && pnpm format
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(app)/dashboard/page.tsx"
git commit -m "feat: add guests link to dashboard card grid"
```

---

## Final verification

- [ ] **Run full test suite**

```bash
pnpm test:run
```

Expected: 43 tests PASS across 11 test files.

- [ ] **Build check**

```bash
pnpm build
```

Expected: build succeeds with no errors.

- [ ] **Manual smoke test**

```
1. Chạy SQL pre-requisite trong Supabase dashboard
2. pnpm dev
3. Vào /invitation/[slug] — thấy section "Xác nhận tham dự" và "Sổ lưu bút"
4. Submit RSVP với tên + chọn "Tôi sẽ tham dự" → thấy success state
5. Submit lời chúc → thấy success + lời chúc xuất hiện trong danh sách
6. Vào dashboard → click "Khách mời" → thấy bảng RSVP + danh sách lời chúc
7. Stats hiển thị đúng: tổng phản hồi, tham dự, vắng mặt
```
