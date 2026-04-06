import { describe, it, expect } from 'vitest';
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
