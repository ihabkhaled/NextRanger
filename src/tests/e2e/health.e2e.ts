import { expect, test } from '@playwright/test';

test.describe('health endpoint', () => {
  test('responds 200 with an ok status payload', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { status: string; checkedAt: string };

    expect(body.status).toBe('ok');
    expect(new Date(body.checkedAt).toString()).not.toBe('Invalid Date');
  });
});
