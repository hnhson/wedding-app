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
