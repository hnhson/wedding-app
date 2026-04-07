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
