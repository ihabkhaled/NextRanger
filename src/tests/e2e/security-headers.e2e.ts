import { expect, test } from '@playwright/test';

function extractNonce(csp: string): string {
  return /'nonce-([^']+)'/.exec(csp)?.[1] ?? '';
}

test.describe('security headers', () => {
  test('pages ship the nonce CSP and static security headers', async ({ page }) => {
    const response = await page.goto('/');

    expect(response).not.toBeNull();

    const headers = response?.headers() ?? {};
    const csp = headers['content-security-policy'] ?? '';

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("'strict-dynamic'");
    expect(csp).toMatch(/'nonce-[^']+'/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('the CSP nonce rotates per request', async ({ page }) => {
    const first = await page.goto('/');
    const firstCsp = first?.headers()['content-security-policy'] ?? '';

    const second = await page.goto('/');
    const secondCsp = second?.headers()['content-security-policy'] ?? '';

    expect(extractNonce(firstCsp)).not.toBe('');
    expect(extractNonce(firstCsp)).not.toBe(extractNonce(secondCsp));
  });
});
