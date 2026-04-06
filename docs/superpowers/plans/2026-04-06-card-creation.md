# Card Creation & Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete card creation and editing flow — users can create a wedding invitation card, choose a template, edit all content sections, customize styles, upload photos, set venue on Google Maps, and preview the result.

**Architecture:** POST /api/cards creates a card with a generated slug in Supabase. /cards/[id]/edit is a Server Component shell that passes initial card data to EditorShell (Client Component), which manages local config state, renders a live template preview, and auto-saves via PATCH /api/cards/[id] with 500ms debounce. Templates are React components driven by CSS variables resolved from config.colorPalette and config.fontPair.

**Tech Stack:** Next.js 16 App Router, Supabase (cards table), Vercel Blob (@vercel/blob), Day.js (countdown), @googlemaps/js-api-loader (venue map), shadcn/ui, Tailwind CSS v4, Vitest

---

## Pre-requisite: Database Setup

Before starting any task, run this SQL in the **Supabase Dashboard → SQL Editor**:

```sql
CREATE TABLE cards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL,
  slug        text UNIQUE NOT NULL,
  config      jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cards"
  ON cards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

Also add to `.env.local`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## File Map

| File                                            | Purpose                                            |
| ----------------------------------------------- | -------------------------------------------------- |
| `src/types/card.ts`                             | CardConfig, Template, ColorPalette, FontPair types |
| `src/lib/slug.ts`                               | Slug generation utility                            |
| `src/lib/slug.test.ts`                          | Slug utility tests                                 |
| `src/lib/templates/data.ts`                     | 6 template configs + DEFAULT_CARD_CONFIG           |
| `src/lib/templates/presets.ts`                  | 12 color palettes + 10 font pairs                  |
| `src/app/api/cards/route.ts`                    | POST — create card with slug                       |
| `src/app/api/cards/[id]/route.ts`               | GET / PATCH / DELETE                               |
| `src/app/api/upload/route.ts`                   | POST — Vercel Blob upload                          |
| `src/app/(app)/cards/new/page.tsx`              | New card form (couple names, date, template)       |
| `src/components/templates/ClassicTemplate.tsx`  | Classic layout renderer                            |
| `src/components/templates/ModernTemplate.tsx`   | Modern layout renderer                             |
| `src/components/templates/MinimalTemplate.tsx`  | Minimal layout renderer                            |
| `src/components/templates/FloralTemplate.tsx`   | Floral layout renderer                             |
| `src/components/templates/TemplateRenderer.tsx` | Routes to correct layout component by templateId   |
| `src/components/editor/EditorShell.tsx`         | Main editor — state, tabs, preview, auto-save      |
| `src/components/editor/ContentPanel.tsx`        | Edit love story, schedule, families                |
| `src/components/editor/StylePanel.tsx`          | Color palette + font pair pickers                  |
| `src/components/editor/MediaPanel.tsx`          | Hero + gallery image upload                        |
| `src/components/editor/MapPanel.tsx`            | Google Maps Places venue search                    |
| `src/components/CountdownWidget.tsx`            | Real-time countdown (Day.js)                       |
| `src/app/(app)/cards/[id]/edit/page.tsx`        | Editor page (RSC shell)                            |
| `src/app/(app)/cards/[id]/preview/page.tsx`     | Preview page (RSC)                                 |
| `src/app/(app)/dashboard/page.tsx`              | Update to list user's cards                        |

---

## Task 1: Install dependencies

**Files:**

- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install runtime dependencies**

```bash
pnpm add @vercel/blob dayjs @googlemaps/js-api-loader
```

Expected: packages added to `dependencies`.

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install card creation dependencies"
```

---

## Task 2: Types

**Files:**

- Create: `src/types/card.ts`

- [ ] **Step 1: Create `src/types/card.ts`**

```typescript
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

export interface FontPair {
  heading: string;
  body: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface FamilyInfo {
  side: 'groom' | 'bride';
  members: string[];
}

export interface CardConfig {
  templateId: string;
  coupleNames: { partner1: string; partner2: string };
  weddingDate: string;
  venue: {
    name: string;
    address: string;
    mapUrl: string;
    lat: number;
    lng: number;
  };
  loveStory: string;
  schedule: ScheduleItem[];
  families: FamilyInfo[];
  colorPalette: string;
  fontPair: string;
  heroImage: string | null;
  gallery: string[];
}

export interface Template {
  id: string;
  name: string;
  layout: 'classic' | 'modern' | 'minimal' | 'floral';
  colorPalettes: Record<string, ColorPalette>;
  fontPairs: Record<string, FontPair>;
}

export interface Card {
  id: string;
  user_id: string;
  slug: string;
  config: CardConfig;
  created_at: string;
  updated_at: string;
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/card.ts
git commit -m "feat: add card and template type definitions"
```

---

## Task 3: Slug utility (TDD)

**Files:**

- Create: `src/lib/slug.ts`
- Create: `src/lib/slug.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/slug.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { generateBaseSlug, appendRandomSuffix } from './slug';

describe('generateBaseSlug', () => {
  it('creates slug from ASCII names', () => {
    expect(generateBaseSlug('An', 'Binh', 2025)).toBe('an-binh-2025');
  });

  it('strips Vietnamese diacritics', () => {
    const slug = generateBaseSlug('Bình', 'Ánh', 2025);
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug).toContain('2025');
  });

  it('replaces đ with d', () => {
    const slug = generateBaseSlug('Đức', 'Linh', 2025);
    expect(slug).toMatch(/^duc/);
  });

  it('handles spaces in names', () => {
    const slug = generateBaseSlug('An Khang', 'Minh Anh', 2025);
    expect(slug).toMatch(/^[a-z0-9-]+-[a-z0-9-]+-2025$/);
  });

  it('truncates long names to 15 chars each', () => {
    const slug = generateBaseSlug(
      'Averylongfirstname',
      'Anotherlongname',
      2025,
    );
    const parts = slug.split('-');
    // last part is year, second-to-last could be part of name
    expect(parts[0].length).toBeLessThanOrEqual(15);
  });
});

describe('appendRandomSuffix', () => {
  it('appends a 4-char alphanumeric suffix', () => {
    const result = appendRandomSuffix('an-binh-2025');
    expect(result).toMatch(/^an-binh-2025-[a-z0-9]{4}$/);
  });

  it('returns different values on each call', () => {
    const a = appendRandomSuffix('slug');
    const b = appendRandomSuffix('slug');
    // Very unlikely to collide
    expect(a).not.toBe(b);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run src/lib/slug.test.ts
```

Expected: FAIL — `Cannot find module './slug'`

- [ ] **Step 3: Implement `src/lib/slug.ts`**

```typescript
function toSlugPart(name: string): string {
  return name
    .normalize('NFD') // decompose Vietnamese diacritics
    .replace(/[\u0300-\u036f]/g, '') // remove combining marks
    .replace(/đ/gi, 'd') // Vietnamese đ → d
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric → hyphen
    .replace(/^-|-$/g, '') // trim leading/trailing hyphens
    .slice(0, 15); // max 15 chars per part
}

export function generateBaseSlug(
  partner1: string,
  partner2: string,
  year: number,
): string {
  const p1 = toSlugPart(partner1);
  const p2 = toSlugPart(partner2);
  return `${p1}-${p2}-${year}`;
}

export function appendRandomSuffix(slug: string): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run src/lib/slug.test.ts
```

Expected: 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/slug.ts src/lib/slug.test.ts
git commit -m "feat: add slug generation utility"
```

---

## Task 4: Template presets and configs

**Files:**

- Create: `src/lib/templates/presets.ts`
- Create: `src/lib/templates/data.ts`

- [ ] **Step 1: Create `src/lib/templates/presets.ts`**

```typescript
import type { ColorPalette, FontPair } from '@/types/card';

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  'rose-gold': {
    primary: '#B76E79',
    secondary: '#F7E7E9',
    accent: '#D4AF37',
    bg: '#FFF9F9',
  },
  'sage-white': {
    primary: '#7C9A7E',
    secondary: '#F5F7F5',
    accent: '#C9A96E',
    bg: '#FAFAFA',
  },
  'midnight-blue': {
    primary: '#1B3A4B',
    secondary: '#E8EFF5',
    accent: '#C9A96E',
    bg: '#F8FAFC',
  },
  'ivory-gold': {
    primary: '#8B7355',
    secondary: '#FAF8F0',
    accent: '#D4AF37',
    bg: '#FFFDF5',
  },
  'blush-pink': {
    primary: '#D4A0A7',
    secondary: '#FFF0F2',
    accent: '#B5838D',
    bg: '#FFFAFA',
  },
  'forest-green': {
    primary: '#2D5016',
    secondary: '#F0F5EB',
    accent: '#8B7355',
    bg: '#F8FAF5',
  },
  'dusty-rose': {
    primary: '#C08B8B',
    secondary: '#FDF0F0',
    accent: '#8B6A6A',
    bg: '#FFFAFA',
  },
  'navy-silver': {
    primary: '#1C2B4A',
    secondary: '#F0F2F5',
    accent: '#A8B2C3',
    bg: '#F5F7FA',
  },
  terracotta: {
    primary: '#C1666B',
    secondary: '#FDF3F1',
    accent: '#8B5E52',
    bg: '#FDFAF9',
  },
  lavender: {
    primary: '#7B6FA0',
    secondary: '#F3F0F8',
    accent: '#C9A96E',
    bg: '#FAF9FC',
  },
  emerald: {
    primary: '#2E7D5E',
    secondary: '#F0F7F4',
    accent: '#D4AF37',
    bg: '#F8FCF9',
  },
  charcoal: {
    primary: '#3A3A3A',
    secondary: '#F5F5F5',
    accent: '#C9A96E',
    bg: '#FAFAFA',
  },
};

export const FONT_PAIRS: Record<string, FontPair> = {
  'playfair-lato': { heading: 'Playfair Display', body: 'Lato' },
  'cormorant-jost': { heading: 'Cormorant Garamond', body: 'Jost' },
  'libre-nunito': { heading: 'Libre Baskerville', body: 'Nunito' },
  'cinzel-raleway': { heading: 'Cinzel', body: 'Raleway' },
  'great-vibes-montserrat': { heading: 'Great Vibes', body: 'Montserrat' },
  'sacramento-poppins': { heading: 'Sacramento', body: 'Poppins' },
  'tangerine-roboto': { heading: 'Tangerine', body: 'Roboto' },
  'allura-source': { heading: 'Allura', body: 'Source Sans 3' },
  'alex-josefin': { heading: 'Alex Brush', body: 'Josefin Sans' },
  'gfs-open': { heading: 'GFS Didot', body: 'Open Sans' },
};

export const DEFAULT_PALETTE = COLOR_PALETTES['rose-gold'];
export const DEFAULT_FONT_PAIR = FONT_PAIRS['playfair-lato'];
```

- [ ] **Step 2: Create `src/lib/templates/data.ts`**

```typescript
import type { Template, CardConfig } from '@/types/card';
import { COLOR_PALETTES, FONT_PAIRS } from './presets';

export const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    layout: 'classic',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'modern',
    name: 'Modern',
    layout: 'modern',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    layout: 'minimal',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'floral',
    name: 'Floral',
    layout: 'floral',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'golden',
    name: 'Golden',
    layout: 'classic',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
  {
    id: 'rustic',
    name: 'Rustic',
    layout: 'minimal',
    colorPalettes: COLOR_PALETTES,
    fontPairs: FONT_PAIRS,
  },
];

export const DEFAULT_CARD_CONFIG: CardConfig = {
  templateId: 'classic',
  coupleNames: { partner1: '', partner2: '' },
  weddingDate: '',
  venue: { name: '', address: '', mapUrl: '', lat: 0, lng: 0 },
  loveStory: '',
  schedule: [],
  families: [],
  colorPalette: 'rose-gold',
  fontPair: 'playfair-lato',
  heroImage: null,
  gallery: [],
};

export function getTemplate(templateId: string): Template {
  return TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
}
```

- [ ] **Step 3: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/templates/
git commit -m "feat: add template configs and color/font presets"
```

---

## Task 5: Cards API — POST (create card)

**Files:**

- Create: `src/app/api/cards/route.ts`
- Create: `src/app/api/cards/route.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/app/api/cards/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBaseSlug, appendRandomSuffix } from '@/lib/slug';

// Unit test the slug logic used by the route (route itself requires full Next.js runtime)
describe('Card creation slug logic', () => {
  it('generates expected slug from couple names and year', () => {
    const slug = generateBaseSlug('An', 'Binh', 2025);
    expect(slug).toBe('an-binh-2025');
  });

  it('generates a unique slug on collision by appending suffix', () => {
    const base = generateBaseSlug('An', 'Binh', 2025);
    const withSuffix = appendRandomSuffix(base);
    expect(withSuffix).toMatch(/^an-binh-2025-[a-z0-9]{4}$/);
  });
});
```

- [ ] **Step 2: Run test to verify it passes (imports slug which is already built)**

```bash
pnpm test:run src/app/api/cards/route.test.ts
```

Expected: 2 tests PASS.

- [ ] **Step 3: Create `src/app/api/cards/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateBaseSlug, appendRandomSuffix } from '@/lib/slug';
import { DEFAULT_CARD_CONFIG } from '@/lib/templates/data';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { partner1, partner2, weddingDate, templateId } = await request.json();

  if (!partner1 || !partner2 || !weddingDate || !templateId) {
    return NextResponse.json(
      { error: 'partner1, partner2, weddingDate, templateId are required' },
      { status: 400 },
    );
  }

  const year = new Date(weddingDate).getFullYear();
  const baseSlug = generateBaseSlug(partner1, partner2, year);

  let slug = baseSlug;
  let card = null;
  let attempts = 0;

  while (!card && attempts < 5) {
    const { data, error } = await supabase
      .from('cards')
      .insert({
        user_id: user.id,
        slug,
        config: {
          ...DEFAULT_CARD_CONFIG,
          templateId,
          coupleNames: { partner1, partner2 },
          weddingDate,
        },
      })
      .select()
      .single();

    if (error?.code === '23505') {
      slug = appendRandomSuffix(baseSlug);
      attempts++;
    } else if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      card = data;
    }
  }

  if (!card) {
    return NextResponse.json(
      { error: 'Failed to generate unique slug' },
      { status: 500 },
    );
  }

  return NextResponse.json(card, { status: 201 });
}
```

- [ ] **Step 4: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cards/
git commit -m "feat: add cards POST API route"
```

---

## Task 6: Cards API — GET / PATCH / DELETE

**Files:**

- Create: `src/app/api/cards/[id]/route.ts`

- [ ] **Step 1: Create `src/app/api/cards/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CardConfig } from '@/types/card';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: { config: CardConfig } = await request.json();

  const { data, error } = await supabase
    .from('cards')
    .update({ config: body.config })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cards/[id]/route.ts
git commit -m "feat: add cards GET/PATCH/DELETE API routes"
```

---

## Task 7: Upload API (Vercel Blob)

**Files:**

- Create: `src/app/api/upload/route.ts`

- [ ] **Step 1: Create `src/app/api/upload/route.ts`**

```typescript
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  if (!filename)
    return NextResponse.json(
      { error: 'filename query param is required' },
      { status: 400 },
    );

  if (!request.body)
    return NextResponse.json({ error: 'No file body' }, { status: 400 });

  const blob = await put(
    `wedding/${user.id}/${Date.now()}-${filename}`,
    request.body,
    {
      access: 'public',
      contentType: request.headers.get('content-type') ?? 'image/jpeg',
    },
  );

  return NextResponse.json({ url: blob.url });
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: add Vercel Blob upload API route"
```

---

## Task 8: New card page

**Files:**

- Create: `src/app/(app)/cards/new/page.tsx`

This is a Client Component — a 2-step form: (1) couple names + wedding date, (2) template selection.

- [ ] **Step 1: Create `src/app/(app)/cards/new/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TEMPLATES } from '@/lib/templates/data'

export default function NewCardPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [partner1, setPartner1] = useState('')
  const [partner2, setPartner2] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [templateId, setTemplateId] = useState('classic')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!partner1.trim() || !partner2.trim() || !weddingDate) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }
    setError('')
    setStep(2)
  }

  async function handleCreate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner1, partner2, weddingDate, templateId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Có lỗi xảy ra')
        return
      }
      const card = await res.json()
      router.push(`/cards/${card.id}/edit`)
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Tạo thiệp cưới mới</CardTitle>
            <CardDescription>Điền thông tin cơ bản của đôi uyên ương</CardDescription>
          </CardHeader>
          <form onSubmit={handleStep1}>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="space-y-1">
                <Label htmlFor="partner1">Tên người 1</Label>
                <Input
                  id="partner1"
                  value={partner1}
                  onChange={e => setPartner1(e.target.value)}
                  placeholder="Nguyễn Văn An"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="partner2">Tên người 2</Label>
                <Input
                  id="partner2"
                  value={partner2}
                  onChange={e => setPartner2(e.target.value)}
                  placeholder="Trần Thị Bình"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weddingDate">Ngày cưới</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={weddingDate}
                  onChange={e => setWeddingDate(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Tiếp theo: Chọn template</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Chọn template</h1>
        <p className="mt-1 text-gray-600">
          Thiệp của <strong>{partner1}</strong> & <strong>{partner2}</strong> — {new Date(weddingDate).toLocaleDateString('vi-VN')}
        </p>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => setTemplateId(template.id)}
            className={`rounded-lg border-2 p-4 text-left transition-colors ${
              templateId === template.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="mb-2 h-24 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-sm">
              {template.layout}
            </div>
            <p className="font-medium text-gray-900">{template.name}</p>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(1)}>Quay lại</Button>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo thiệp'}
        </Button>
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
git add "src/app/(app)/cards/new/"
git commit -m "feat: add new card creation page"
```

---

## Task 9: Template components

**Files:**

- Create: `src/components/templates/ClassicTemplate.tsx`
- Create: `src/components/templates/ModernTemplate.tsx`
- Create: `src/components/templates/MinimalTemplate.tsx`
- Create: `src/components/templates/FloralTemplate.tsx`
- Create: `src/components/templates/TemplateRenderer.tsx`

All templates receive `config: CardConfig` and render using CSS variables injected via `style` prop. The CSS variables `--card-primary`, `--card-secondary`, `--card-accent`, `--card-bg` are set by the parent (EditorShell or TemplateRenderer).

- [ ] **Step 1: Create `src/components/templates/ClassicTemplate.tsx`**

```typescript
import type { CardConfig } from '@/types/card'

interface Props {
  config: CardConfig
}

export default function ClassicTemplate({ config }: Props) {
  const { coupleNames, weddingDate, venue, loveStory, schedule, families, heroImage, gallery } = config
  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) : 'Chưa có ngày'

  return (
    <div className="min-h-screen" style={{ background: 'var(--card-bg)', color: 'var(--card-primary)', fontFamily: 'var(--card-font-body, serif)' }}>
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center py-20 text-center">
        {heroImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={heroImage} alt="Hero" className="h-full w-full object-cover opacity-20" />
          </div>
        )}
        <div className="relative z-10">
          <p className="mb-4 text-lg tracking-widest uppercase" style={{ color: 'var(--card-accent)' }}>Trân trọng kính mời</p>
          <h1 className="mb-2 text-5xl font-bold" style={{ fontFamily: 'var(--card-font-heading, serif)' }}>
            {coupleNames.partner1 || 'Người 1'}
          </h1>
          <p className="my-4 text-3xl" style={{ color: 'var(--card-accent)' }}>&amp;</p>
          <h1 className="mb-6 text-5xl font-bold" style={{ fontFamily: 'var(--card-font-heading, serif)' }}>
            {coupleNames.partner2 || 'Người 2'}
          </h1>
          <div className="mx-auto mb-6 h-px w-32" style={{ background: 'var(--card-accent)' }} />
          <p className="text-xl">{formattedDate}</p>
          {venue.name && <p className="mt-2 text-base opacity-80">{venue.name}</p>}
        </div>
      </div>

      {/* Love Story */}
      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-12 text-center">
          <h2 className="mb-6 text-2xl" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Câu chuyện của chúng tôi</h2>
          <p className="leading-relaxed opacity-90 whitespace-pre-wrap">{loveStory}</p>
        </div>
      )}

      {/* Schedule */}
      {schedule.length > 0 && (
        <div className="px-8 py-12" style={{ background: 'var(--card-secondary)' }}>
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center text-2xl" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Lịch trình</h2>
            <div className="space-y-6">
              {schedule.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 shrink-0 text-right text-sm font-semibold" style={{ color: 'var(--card-accent)' }}>{item.time}</div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    {item.description && <p className="mt-1 text-sm opacity-70">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="px-8 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Khoảnh khắc đáng nhớ</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((url, i) => (
                <img key={i} src={url} alt={`Gallery ${i + 1}`} className="h-40 w-full rounded-lg object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Venue */}
      {venue.address && (
        <div className="px-8 py-12 text-center" style={{ background: 'var(--card-secondary)' }}>
          <h2 className="mb-4 text-2xl" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Địa điểm</h2>
          <p className="font-semibold text-lg">{venue.name}</p>
          <p className="mt-1 opacity-80">{venue.address}</p>
          {venue.mapUrl && (
            <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-block rounded px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--card-primary)' }}>
              Chỉ đường
            </a>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/templates/ModernTemplate.tsx`**

```typescript
import type { CardConfig } from '@/types/card'

export default function ModernTemplate({ config }: { config: CardConfig }) {
  const { coupleNames, weddingDate, venue, loveStory, schedule, heroImage, gallery } = config
  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : 'Chưa có ngày'

  return (
    <div className="min-h-screen" style={{ background: 'var(--card-bg)', fontFamily: 'var(--card-font-body, sans-serif)' }}>
      {/* Split hero */}
      <div className="grid min-h-screen md:grid-cols-2">
        <div className="flex flex-col items-start justify-center px-12 py-20">
          <p className="mb-6 text-xs tracking-widest uppercase" style={{ color: 'var(--card-accent)' }}>We Are Getting Married</p>
          <h1 className="mb-2 text-6xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-primary)' }}>
            {coupleNames.partner1 || 'Người 1'}
          </h1>
          <p className="my-3 text-2xl" style={{ color: 'var(--card-accent)' }}>—</p>
          <h1 className="mb-8 text-6xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-primary)' }}>
            {coupleNames.partner2 || 'Người 2'}
          </h1>
          <p className="text-lg opacity-70" style={{ color: 'var(--card-primary)' }}>{formattedDate}</p>
          {venue.name && <p className="mt-2 text-base opacity-60" style={{ color: 'var(--card-primary)' }}>{venue.name}</p>}
        </div>
        <div className="relative overflow-hidden" style={{ background: 'var(--card-secondary)' }}>
          {heroImage
            ? <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
            : <div className="flex h-full items-center justify-center text-gray-400">Ảnh chính</div>
          }
        </div>
      </div>

      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-16">
          <h2 className="mb-6 text-xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Our Story</h2>
          <p className="leading-relaxed opacity-80 whitespace-pre-wrap" style={{ color: 'var(--card-primary)' }}>{loveStory}</p>
        </div>
      )}

      {schedule.length > 0 && (
        <div className="border-t px-8 py-16" style={{ borderColor: 'var(--card-secondary)', color: 'var(--card-primary)' }}>
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-xl font-light" style={{ fontFamily: 'var(--card-font-heading, serif)', color: 'var(--card-accent)' }}>Schedule</h2>
            {schedule.map((item, i) => (
              <div key={i} className="mb-6 flex gap-8 border-b pb-6" style={{ borderColor: 'var(--card-secondary)' }}>
                <p className="w-16 shrink-0 text-sm font-bold" style={{ color: 'var(--card-accent)' }}>{item.time}</p>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  {item.description && <p className="mt-1 text-sm opacity-60">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gallery.length > 0 && (
        <div className="px-8 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((url, i) => (
                <img key={i} src={url} alt="" className="aspect-square w-full object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/templates/MinimalTemplate.tsx`**

```typescript
import type { CardConfig } from '@/types/card'

export default function MinimalTemplate({ config }: { config: CardConfig }) {
  const { coupleNames, weddingDate, venue, loveStory, schedule, heroImage } = config
  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : ''

  return (
    <div className="min-h-screen px-8 py-20" style={{ background: 'var(--card-bg)', color: 'var(--card-primary)', fontFamily: 'var(--card-font-body, sans-serif)' }}>
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl" style={{ fontFamily: 'var(--card-font-heading, serif)' }}>
            {coupleNames.partner1 || 'Người 1'} & {coupleNames.partner2 || 'Người 2'}
          </h1>
          <p className="mt-4 text-sm tracking-widest uppercase opacity-60">{formattedDate}</p>
          {venue.name && <p className="mt-1 text-sm opacity-50">{venue.name}</p>}
        </div>

        {heroImage && (
          <img src={heroImage} alt="Hero" className="mb-16 w-full rounded object-cover" style={{ maxHeight: '400px' }} />
        )}

        {loveStory && (
          <div className="mb-16">
            <p className="leading-relaxed opacity-80 whitespace-pre-wrap text-center">{loveStory}</p>
          </div>
        )}

        {schedule.length > 0 && (
          <div className="mb-16">
            <p className="mb-6 text-xs tracking-widest uppercase opacity-50">Lịch trình</p>
            {schedule.map((item, i) => (
              <div key={i} className="mb-4 flex gap-6 text-sm">
                <span className="w-14 shrink-0 opacity-50">{item.time}</span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        )}

        {venue.address && (
          <div className="text-center text-sm opacity-70">
            <p>{venue.address}</p>
            {venue.mapUrl && (
              <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline">
                Xem bản đồ
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/templates/FloralTemplate.tsx`**

```typescript
import type { CardConfig } from '@/types/card'

export default function FloralTemplate({ config }: { config: CardConfig }) {
  const { coupleNames, weddingDate, venue, loveStory, schedule, heroImage, gallery } = config
  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) : 'Chưa có ngày'

  return (
    <div className="min-h-screen" style={{ background: 'var(--card-bg)', color: 'var(--card-primary)', fontFamily: 'var(--card-font-body, serif)' }}>
      {/* Decorative top border */}
      <div className="h-3" style={{ background: `linear-gradient(to right, var(--card-primary), var(--card-accent), var(--card-primary))` }} />

      <div className="flex flex-col items-center py-20 text-center px-8">
        <p className="mb-2 text-sm tracking-widest uppercase" style={{ color: 'var(--card-accent)' }}>✿ Kính mời ✿</p>

        {heroImage && (
          <div className="my-8 h-64 w-64 overflow-hidden rounded-full border-4" style={{ borderColor: 'var(--card-accent)' }}>
            <img src={heroImage} alt="Hero" className="h-full w-full object-cover" />
          </div>
        )}

        <h1 className="text-6xl" style={{ fontFamily: 'var(--card-font-heading, cursive)', color: 'var(--card-primary)' }}>
          {coupleNames.partner1 || 'Người 1'}
        </h1>
        <p className="my-4 text-3xl" style={{ color: 'var(--card-accent)' }}>❤</p>
        <h1 className="text-6xl" style={{ fontFamily: 'var(--card-font-heading, cursive)', color: 'var(--card-primary)' }}>
          {coupleNames.partner2 || 'Người 2'}
        </h1>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px w-20" style={{ background: 'var(--card-accent)' }} />
          <p className="text-lg">{formattedDate}</p>
          <div className="h-px w-20" style={{ background: 'var(--card-accent)' }} />
        </div>

        {venue.name && <p className="text-base opacity-80">{venue.name}</p>}
      </div>

      {loveStory && (
        <div className="mx-auto max-w-2xl px-8 py-10 text-center">
          <p className="text-3xl mb-4" style={{ color: 'var(--card-accent)', fontFamily: 'var(--card-font-heading)' }}>Chuyện tình của chúng tôi</p>
          <p className="leading-relaxed opacity-90 whitespace-pre-wrap italic">{loveStory}</p>
        </div>
      )}

      {schedule.length > 0 && (
        <div className="px-8 py-12" style={{ background: 'var(--card-secondary)' }}>
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-8 text-3xl" style={{ fontFamily: 'var(--card-font-heading)', color: 'var(--card-accent)' }}>Chương trình</p>
            {schedule.map((item, i) => (
              <div key={i} className="mb-6">
                <p className="text-sm font-semibold" style={{ color: 'var(--card-accent)' }}>{item.time}</p>
                <p className="font-medium">{item.title}</p>
                {item.description && <p className="text-sm opacity-70">{item.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {gallery.length > 0 && (
        <div className="px-8 py-12">
          <div className="mx-auto max-w-3xl grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.map((url, i) => (
              <img key={i} src={url} alt="" className="h-48 w-full rounded-lg object-cover" style={{ border: `2px solid var(--card-secondary)` }} />
            ))}
          </div>
        </div>
      )}

      <div className="h-3" style={{ background: `linear-gradient(to right, var(--card-primary), var(--card-accent), var(--card-primary))` }} />
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/templates/TemplateRenderer.tsx`**

```typescript
import type { CardConfig } from '@/types/card'
import { getTemplate } from '@/lib/templates/data'
import { COLOR_PALETTES, FONT_PAIRS, DEFAULT_PALETTE, DEFAULT_FONT_PAIR } from '@/lib/templates/presets'
import ClassicTemplate from './ClassicTemplate'
import ModernTemplate from './ModernTemplate'
import MinimalTemplate from './MinimalTemplate'
import FloralTemplate from './FloralTemplate'

interface Props {
  config: CardConfig
  className?: string
}

export default function TemplateRenderer({ config, className }: Props) {
  const template = getTemplate(config.templateId)
  const palette = COLOR_PALETTES[config.colorPalette] ?? DEFAULT_PALETTE
  const fontPair = FONT_PAIRS[config.fontPair] ?? DEFAULT_FONT_PAIR

  const cssVars = {
    '--card-primary': palette.primary,
    '--card-secondary': palette.secondary,
    '--card-accent': palette.accent,
    '--card-bg': palette.bg,
    '--card-font-heading': `"${fontPair.heading}", serif`,
    '--card-font-body': `"${fontPair.body}", sans-serif`,
  } as React.CSSProperties

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    floral: FloralTemplate,
  }[template.layout] ?? ClassicTemplate

  return (
    <div style={cssVars} className={className}>
      <TemplateComponent config={config} />
    </div>
  )
}
```

- [ ] **Step 6: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/templates/
git commit -m "feat: add template components (classic, modern, minimal, floral)"
```

---

## Task 10: Countdown widget

**Files:**

- Create: `src/components/CountdownWidget.tsx`
- Create: `src/components/CountdownWidget.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/CountdownWidget.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountdownWidget from './CountdownWidget'

describe('CountdownWidget', () => {
  it('shows countdown for future date', () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    render(<CountdownWidget weddingDate={futureDate} />)
    expect(screen.getByText(/ngày/i)).toBeInTheDocument()
  })

  it('shows "ngày hạnh phúc" for past date', () => {
    render(<CountdownWidget weddingDate="2020-01-01" />)
    expect(screen.getByText(/ngày hạnh phúc/i)).toBeInTheDocument()
  })

  it('shows nothing for empty date', () => {
    const { container } = render(<CountdownWidget weddingDate="" />)
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run src/components/CountdownWidget.test.tsx
```

Expected: FAIL — `Cannot find module './CountdownWidget'`

- [ ] **Step 3: Create `src/components/CountdownWidget.tsx`**

```typescript
'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

interface TimeLeft {
  isPast: boolean
  daysPast: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(weddingDate: string): TimeLeft {
  const now = dayjs()
  const wedding = dayjs(weddingDate)
  const diff = wedding.diff(now)

  if (diff <= 0) {
    return { isPast: true, daysPast: now.diff(wedding, 'day'), days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const dur = dayjs.duration(diff)
  return {
    isPast: false,
    daysPast: 0,
    days: Math.floor(dur.asDays()),
    hours: dur.hours(),
    minutes: dur.minutes(),
    seconds: dur.seconds(),
  }
}

export default function CountdownWidget({ weddingDate }: { weddingDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!weddingDate) return
    setTimeLeft(getTimeLeft(weddingDate))
    const interval = setInterval(() => setTimeLeft(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(interval)
  }, [weddingDate])

  if (!weddingDate || !timeLeft) return null

  if (timeLeft.isPast) {
    return (
      <div className="text-center">
        <p className="text-2xl font-light" style={{ color: 'var(--card-accent, #D4AF37)' }}>
          Đã {timeLeft.daysPast} ngày hạnh phúc
        </p>
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-6 text-center">
      {[
        { value: timeLeft.days, label: 'Ngày' },
        { value: timeLeft.hours, label: 'Giờ' },
        { value: timeLeft.minutes, label: 'Phút' },
        { value: timeLeft.seconds, label: 'Giây' },
      ].map(({ value, label }) => (
        <div key={label}>
          <p className="text-4xl font-bold" style={{ color: 'var(--card-primary, #B76E79)' }}>
            {String(value).padStart(2, '0')}
          </p>
          <p className="text-xs uppercase tracking-widest opacity-70">{label}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run src/components/CountdownWidget.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/CountdownWidget.tsx src/components/CountdownWidget.test.tsx
git commit -m "feat: add countdown widget with Day.js"
```

---

## Task 11: Editor shell with auto-save

**Files:**

- Create: `src/components/editor/EditorShell.tsx`
- Create: `src/app/(app)/cards/[id]/edit/page.tsx`

- [ ] **Step 1: Create `src/components/editor/EditorShell.tsx`**

This is the main client component. It holds the full config state, renders tabs, live preview, and auto-saves.

```typescript
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Card, CardConfig } from '@/types/card'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import ContentPanel from './ContentPanel'
import StylePanel from './StylePanel'
import MediaPanel from './MediaPanel'
import MapPanel from './MapPanel'
import { FONT_PAIRS } from '@/lib/templates/presets'

type Tab = 'content' | 'style' | 'media' | 'map'

const TAB_LABELS: Record<Tab, string> = {
  content: 'Nội dung',
  style: 'Phong cách',
  media: 'Ảnh',
  map: 'Địa điểm',
}

interface Props {
  card: Card
}

export default function EditorShell({ card }: Props) {
  const [config, setConfig] = useState<CardConfig>(card.config)
  const [activeTab, setActiveTab] = useState<Tab>('content')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>()

  // Load Google Font when fontPair changes
  useEffect(() => {
    const fontPair = FONT_PAIRS[config.fontPair]
    if (!fontPair) return
    const id = `font-${config.fontPair}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    const families = [
      `${fontPair.heading.replace(/ /g, '+')}:wght@400;700`,
      `${fontPair.body.replace(/ /g, '+')}:wght@400;600`,
    ].join('&family=')
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`
    document.head.appendChild(link)
  }, [config.fontPair])

  const save = useCallback(async (latestConfig: CardConfig) => {
    setSaveStatus('saving')
    try {
      await fetch(`/api/cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: latestConfig }),
      })
      setSaveStatus('saved')
    } catch {
      setSaveStatus('unsaved')
    }
  }, [card.id])

  // Auto-save with 500ms debounce
  useEffect(() => {
    setSaveStatus('unsaved')
    clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => save(config), 500)
    return () => clearTimeout(autoSaveRef.current)
  }, [config, save])

  // beforeunload fallback
  useEffect(() => {
    const handler = () => {
      if (saveStatus === 'unsaved') {
        navigator.sendBeacon(`/api/cards/${card.id}`, JSON.stringify({ config }))
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [config, card.id, saveStatus])

  function updateConfig(patch: Partial<CardConfig>) {
    setConfig(prev => ({ ...prev, ...patch }))
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r bg-white">
        {/* Tabs */}
        <div className="flex border-b">
          {(Object.keys(TAB_LABELS) as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Save status */}
        <div className="border-b px-4 py-2">
          <p className="text-xs text-gray-400">
            {saveStatus === 'saving' ? 'Đang lưu...' : saveStatus === 'saved' ? '✓ Đã lưu' : '● Chưa lưu'}
          </p>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'content' && <ContentPanel config={config} onChange={updateConfig} />}
          {activeTab === 'style' && <StylePanel config={config} onChange={updateConfig} />}
          {activeTab === 'media' && <MediaPanel config={config} onChange={updateConfig} cardId={card.id} />}
          {activeTab === 'map' && <MapPanel config={config} onChange={updateConfig} />}
        </div>
      </div>

      {/* Live preview */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <div className="mx-auto max-w-2xl rounded-lg shadow-lg overflow-hidden">
          <TemplateRenderer config={config} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/(app)/cards/[id]/edit/page.tsx`**

```typescript
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditorShell from '@/components/editor/EditorShell'
import type { Card } from '@/types/card'

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!data) notFound()

  return <EditorShell card={data as Card} />
}
```

- [ ] **Step 3: Verify type-check**

```bash
pnpm type-check
```

Expected: no errors (there may be errors about missing ContentPanel, StylePanel, MediaPanel, MapPanel — that's expected until Tasks 12–15 create them).

If type errors about missing panel imports: create stub files first:

```bash
mkdir -p src/components/editor
```

For each missing panel, create a temporary stub:

`src/components/editor/ContentPanel.tsx`:

```typescript
import type { CardConfig } from '@/types/card'
export default function ContentPanel({ config, onChange }: { config: CardConfig; onChange: (p: Partial<CardConfig>) => void }) {
  return <div>Content Panel (coming in Task 12)</div>
}
```

`src/components/editor/StylePanel.tsx`:

```typescript
import type { CardConfig } from '@/types/card'
export default function StylePanel({ config, onChange }: { config: CardConfig; onChange: (p: Partial<CardConfig>) => void }) {
  return <div>Style Panel (coming in Task 13)</div>
}
```

`src/components/editor/MediaPanel.tsx`:

```typescript
import type { CardConfig } from '@/types/card'
export default function MediaPanel({ config, onChange, cardId }: { config: CardConfig; onChange: (p: Partial<CardConfig>) => void; cardId: string }) {
  return <div>Media Panel (coming in Task 14)</div>
}
```

`src/components/editor/MapPanel.tsx`:

```typescript
import type { CardConfig } from '@/types/card'
export default function MapPanel({ config, onChange }: { config: CardConfig; onChange: (p: Partial<CardConfig>) => void }) {
  return <div>Map Panel (coming in Task 15)</div>
}
```

Then run `pnpm type-check` again — should pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/editor/ "src/app/(app)/cards/[id]/edit/"
git commit -m "feat: add editor shell with auto-save and live preview"
```

---

## Task 12: Content panel

**Files:**

- Modify: `src/components/editor/ContentPanel.tsx` (replace stub)

- [ ] **Step 1: Replace stub with full ContentPanel**

```typescript
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { CardConfig, ScheduleItem, FamilyInfo } from '@/types/card'

interface Props {
  config: CardConfig
  onChange: (patch: Partial<CardConfig>) => void
}

export default function ContentPanel({ config, onChange }: Props) {
  const [newScheduleItem, setNewScheduleItem] = useState<ScheduleItem>({ time: '', title: '', description: '' })

  function addScheduleItem() {
    if (!newScheduleItem.time || !newScheduleItem.title) return
    onChange({ schedule: [...config.schedule, newScheduleItem] })
    setNewScheduleItem({ time: '', title: '', description: '' })
  }

  function removeScheduleItem(index: number) {
    onChange({ schedule: config.schedule.filter((_, i) => i !== index) })
  }

  function updateFamily(side: 'groom' | 'bride', members: string) {
    const existing = config.families.filter(f => f.side !== side)
    const memberList = members.split('\n').map(m => m.trim()).filter(Boolean)
    onChange({ families: [...existing, { side, members: memberList }] })
  }

  const groomFamily = config.families.find(f => f.side === 'groom')?.members.join('\n') ?? ''
  const brideFamily = config.families.find(f => f.side === 'bride')?.members.join('\n') ?? ''

  return (
    <div className="space-y-6">
      {/* Love story */}
      <div className="space-y-1">
        <Label>Câu chuyện tình yêu</Label>
        <textarea
          value={config.loveStory}
          onChange={e => onChange({ loveStory: e.target.value })}
          placeholder="Kể câu chuyện của các bạn..."
          rows={5}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      {/* Schedule */}
      <div>
        <Label className="mb-2 block">Lịch trình</Label>
        {config.schedule.map((item, i) => (
          <div key={i} className="mb-2 flex items-start gap-2 rounded border p-2 text-sm">
            <div className="flex-1">
              <p className="font-medium">{item.time} — {item.title}</p>
              {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
            </div>
            <button onClick={() => removeScheduleItem(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
          </div>
        ))}
        <div className="mt-3 space-y-2">
          <Input
            placeholder="Giờ (vd: 08:00)"
            value={newScheduleItem.time}
            onChange={e => setNewScheduleItem(prev => ({ ...prev, time: e.target.value }))}
          />
          <Input
            placeholder="Tên sự kiện"
            value={newScheduleItem.title}
            onChange={e => setNewScheduleItem(prev => ({ ...prev, title: e.target.value }))}
          />
          <Input
            placeholder="Mô tả (tùy chọn)"
            value={newScheduleItem.description}
            onChange={e => setNewScheduleItem(prev => ({ ...prev, description: e.target.value }))}
          />
          <Button size="sm" variant="outline" onClick={addScheduleItem} className="w-full">
            + Thêm sự kiện
          </Button>
        </div>
      </div>

      {/* Families */}
      <div className="space-y-3">
        <Label>Gia đình nhà trai (mỗi người một dòng)</Label>
        <textarea
          value={groomFamily}
          onChange={e => updateFamily('groom', e.target.value)}
          rows={3}
          placeholder="Ông Nguyễn Văn A&#10;Bà Trần Thị B"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <Label>Gia đình nhà gái (mỗi người một dòng)</Label>
        <textarea
          value={brideFamily}
          onChange={e => updateFamily('bride', e.target.value)}
          rows={3}
          placeholder="Ông Lê Văn C&#10;Bà Phạm Thị D"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
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
git add src/components/editor/ContentPanel.tsx
git commit -m "feat: add content editor panel"
```

---

## Task 13: Style panel

**Files:**

- Modify: `src/components/editor/StylePanel.tsx` (replace stub)

- [ ] **Step 1: Replace stub with full StylePanel**

```typescript
'use client'

import { Label } from '@/components/ui/label'
import type { CardConfig } from '@/types/card'
import { COLOR_PALETTES, FONT_PAIRS } from '@/lib/templates/presets'
import { TEMPLATES } from '@/lib/templates/data'

interface Props {
  config: CardConfig
  onChange: (patch: Partial<CardConfig>) => void
}

export default function StylePanel({ config, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Template selection */}
      <div>
        <Label className="mb-2 block">Template</Label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => onChange({ templateId: template.id })}
              className={`rounded border p-2 text-left text-xs transition-colors ${
                config.templateId === template.id
                  ? 'border-gray-900 bg-gray-50 font-semibold'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color palettes */}
      <div>
        <Label className="mb-2 block">Bảng màu</Label>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
            <button
              key={key}
              onClick={() => onChange({ colorPalette: key })}
              title={key}
              className={`h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                config.colorPalette === key ? 'border-gray-900 scale-110' : 'border-transparent'
              }`}
              style={{ background: `linear-gradient(135deg, ${palette.primary} 50%, ${palette.accent} 50%)` }}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">Đang chọn: {config.colorPalette}</p>
      </div>

      {/* Font pairs */}
      <div>
        <Label className="mb-2 block">Font chữ</Label>
        <div className="space-y-2">
          {Object.entries(FONT_PAIRS).map(([key, pair]) => (
            <button
              key={key}
              onClick={() => onChange({ fontPair: key })}
              className={`w-full rounded border px-3 py-2 text-left transition-colors ${
                config.fontPair === key
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <p className="text-sm font-medium">{pair.heading}</p>
              <p className="text-xs text-gray-500">{pair.body}</p>
            </button>
          ))}
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
git add src/components/editor/StylePanel.tsx
git commit -m "feat: add style editor panel with color and font pickers"
```

---

## Task 14: Media panel (image upload)

**Files:**

- Modify: `src/components/editor/MediaPanel.tsx` (replace stub)

- [ ] **Step 1: Replace stub with full MediaPanel**

```typescript
'use client'

import { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { CardConfig } from '@/types/card'

interface Props {
  config: CardConfig
  onChange: (patch: Partial<CardConfig>) => void
  cardId: string
}

async function uploadFile(file: File): Promise<string> {
  const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('Upload thất bại')
  const data = await res.json()
  return data.url as string
}

export default function MediaPanel({ config, onChange }: Props) {
  const heroInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [heroUploading, setHeroUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeroUploading(true)
    setError('')
    try {
      const url = await uploadFile(file)
      onChange({ heroImage: url })
    } catch {
      setError('Lỗi upload ảnh chính')
    } finally {
      setHeroUploading(false)
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    if (config.gallery.length + files.length > 12) {
      setError('Tối đa 12 ảnh trong gallery')
      return
    }
    setGalleryUploading(true)
    setError('')
    try {
      const urls = await Promise.all(files.map(uploadFile))
      onChange({ gallery: [...config.gallery, ...urls] })
    } catch {
      setError('Lỗi upload ảnh gallery')
    } finally {
      setGalleryUploading(false)
    }
  }

  function removeGalleryImage(index: number) {
    onChange({ gallery: config.gallery.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Hero image */}
      <div>
        <Label className="mb-2 block">Ảnh chính</Label>
        {config.heroImage ? (
          <div className="relative">
            <img src={config.heroImage} alt="Hero" className="h-40 w-full rounded object-cover" />
            <button
              onClick={() => onChange({ heroImage: null })}
              className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-xs text-red-600 shadow"
            >
              Xóa
            </button>
          </div>
        ) : (
          <button
            onClick={() => heroInputRef.current?.click()}
            disabled={heroUploading}
            className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400"
          >
            {heroUploading ? 'Đang upload...' : '+ Chọn ảnh chính'}
          </button>
        )}
        <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
      </div>

      {/* Gallery */}
      <div>
        <Label className="mb-2 block">Gallery ({config.gallery.length}/12 ảnh)</Label>
        <div className="grid grid-cols-3 gap-2">
          {config.gallery.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="h-20 w-full rounded object-cover" />
              <button
                onClick={() => removeGalleryImage(i)}
                className="absolute right-1 top-1 rounded-full bg-white px-1.5 py-0.5 text-xs text-red-600 shadow"
              >
                ✕
              </button>
            </div>
          ))}
          {config.gallery.length < 12 && (
            <button
              onClick={() => galleryInputRef.current?.click()}
              disabled={galleryUploading}
              className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-xs text-gray-500 hover:border-gray-400"
            >
              {galleryUploading ? '...' : '+'}
            </button>
          )}
        </div>
        <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
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
git add src/components/editor/MediaPanel.tsx
git commit -m "feat: add media panel with Vercel Blob image upload"
```

---

## Task 15: Map panel (Google Maps Places)

**Files:**

- Modify: `src/components/editor/MapPanel.tsx` (replace stub)

Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`.

- [ ] **Step 1: Replace stub with full MapPanel**

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CardConfig } from '@/types/card'

interface Props {
  config: CardConfig
  onChange: (patch: Partial<CardConfig>) => void
}

export default function MapPanel({ config, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError('Chưa cấu hình Google Maps API key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)')
      return
    }

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      libraries: ['places'],
    })

    loader.load().then(() => {
      setLoaded(true)
    }).catch(() => {
      setError('Không thể tải Google Maps')
    })
  }, [])

  useEffect(() => {
    if (!loaded || !inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['name', 'formatted_address', 'geometry', 'url'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location) return

      onChange({
        venue: {
          name: place.name ?? '',
          address: place.formatted_address ?? '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          mapUrl: place.url ?? `https://maps.google.com/?q=${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        },
      })
    })
  }, [loaded, onChange])

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Tìm kiếm địa điểm</Label>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <Input
            ref={inputRef}
            placeholder={loaded ? 'Nhập tên địa điểm...' : 'Đang tải Google Maps...'}
            disabled={!loaded}
          />
        )}
      </div>

      {config.venue.name && (
        <div className="rounded border bg-gray-50 p-3 text-sm">
          <p className="font-semibold">{config.venue.name}</p>
          <p className="text-gray-600">{config.venue.address}</p>
          {config.venue.mapUrl && (
            <a href={config.venue.mapUrl} target="_blank" rel="noopener noreferrer"
              className="mt-1 inline-block text-blue-600 hover:underline text-xs">
              Xem trên Google Maps ↗
            </a>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Tên địa điểm (chỉnh tay)</Label>
        <Input
          value={config.venue.name}
          onChange={e => onChange({ venue: { ...config.venue, name: e.target.value } })}
          placeholder="Nhà hàng ABC"
        />
        <Label>Địa chỉ (chỉnh tay)</Label>
        <Input
          value={config.venue.address}
          onChange={e => onChange({ venue: { ...config.venue, address: e.target.value } })}
          placeholder="123 Đường XYZ, Quận 1, TP.HCM"
        />
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
git add src/components/editor/MapPanel.tsx
git commit -m "feat: add map panel with Google Maps Places Autocomplete"
```

---

## Task 16: Preview page

**Files:**

- Create: `src/app/(app)/cards/[id]/preview/page.tsx`

- [ ] **Step 1: Create `src/app/(app)/cards/[id]/preview/page.tsx`**

```typescript
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import CountdownWidget from '@/components/CountdownWidget'
import type { Card } from '@/types/card'
import { FONT_PAIRS } from '@/lib/templates/presets'

export default async function PreviewCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!data) notFound()

  const card = data as Card
  const fontPair = FONT_PAIRS[card.config.fontPair]

  return (
    <div>
      {/* Toolbar */}
      <div className="fixed top-16 left-0 right-0 z-10 flex items-center justify-between bg-white border-b px-6 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href={`/cards/${id}/edit`} className="text-sm text-blue-600 hover:underline">
            ← Quay lại chỉnh sửa
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">Preview — slug: <code className="bg-gray-100 px-1 rounded text-xs">{card.slug}</code></span>
        </div>
        <Link
          href={`/invitation/${card.slug}`}
          target="_blank"
          className="text-sm font-medium text-gray-900 hover:underline"
        >
          Xem trang công khai ↗
        </Link>
      </div>

      {/* Load fonts */}
      {fontPair && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontPair.heading.replace(/ /g, '+')}:wght@400;700&family=${fontPair.body.replace(/ /g, '+')}:wght@400;600&display=swap`}
        />
      )}

      {/* Countdown (if wedding date set) */}
      {card.config.weddingDate && (
        <div className="pt-24 pb-4 text-center">
          <CountdownWidget weddingDate={card.config.weddingDate} />
        </div>
      )}

      {/* Template */}
      <div className="pt-4">
        <TemplateRenderer config={card.config} />
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
git add "src/app/(app)/cards/[id]/preview/"
git commit -m "feat: add card preview page"
```

---

## Task 17: Update dashboard to list cards

**Files:**

- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Replace dashboard page with card listing**

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import type { Card } from '@/types/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
          <Link href="/cards/new" className="mt-3 inline-block text-blue-600 hover:underline">
            Tạo thiệp đầu tiên →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardList.map(card => {
            const { coupleNames, weddingDate } = card.config
            return (
              <div key={card.id} className="rounded-lg border bg-white p-5 shadow-sm">
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
                <p className="mt-1 text-xs text-gray-400">/invitation/{card.slug}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/cards/${card.id}/edit`}
                    className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    href={`/cards/${card.id}/preview`}
                    className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-center text-sm hover:bg-gray-50"
                  >
                    Xem trước
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

Expected: all prior tests still pass (17 from auth + 7 from slug + 3 from CountdownWidget = 27 tests).

- [ ] **Step 3: Verify type-check and lint**

```bash
pnpm type-check && pnpm lint:fix && pnpm format
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(app\)/dashboard/page.tsx
git commit -m "feat: update dashboard to list user cards"
```

---

## Final verification

- [ ] **Run full test suite**

```bash
pnpm test:run
```

Expected: 27 tests PASS across 6 test files.

- [ ] **Build check**

```bash
pnpm build
```

Expected: build succeeds. Fix any type errors before proceeding.

- [ ] **Manual smoke test**

```
1. pnpm dev
2. Login at http://localhost:3000/login
3. Click "Tạo thiệp mới" → fill names + date → pick template → create
4. Editor loads — test each tab (Content, Style, Media, Map)
5. Verify auto-save shows "✓ Đã lưu" after 500ms
6. Click "Xem trước" → preview page renders template
7. Return to dashboard — card appears in list
```
