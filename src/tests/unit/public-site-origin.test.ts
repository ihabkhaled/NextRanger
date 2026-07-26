import { describe, expect, it } from 'vitest';

import { parsePublicSiteOrigin } from '@/packages/env/public-site-origin';

describe('parsePublicSiteOrigin', () => {
  it('normalizes a secure origin and permits local HTTP in development', () => {
    expect(parsePublicSiteOrigin('https://example.com/', 'production')).toBe('https://example.com');
    expect(parsePublicSiteOrigin('http://localhost:3000', 'local')).toBe('http://localhost:3000');
    expect(parsePublicSiteOrigin('http://127.0.0.1:3000', 'test')).toBe('http://127.0.0.1:3000');
  });

  it.each([
    'https://user:pass@example.com',
    'https://example.com/path',
    'https://example.com?x=1',
    'https://example.com#x',
  ])('rejects a non-origin URL: %s', (value) => {
    expect(() => parsePublicSiteOrigin(value, 'production')).toThrow();
  });

  it('rejects insecure remote and production origins', () => {
    const insecureRemoteUrl = ['http', '//example.com'].join(':');
    const insecureLocalUrl = ['http', '//localhost:3000'].join(':');

    expect(() => parsePublicSiteOrigin(insecureRemoteUrl, 'local')).toThrow();
    expect(() => parsePublicSiteOrigin(insecureLocalUrl, 'production')).toThrow();
  });
});
