import { afterEach, describe, expect, it, vi } from 'vitest';

import { publicEnv } from '@/packages/env';

describe('publicEnv', () => {
  it('provides validated defaults in the test environment', () => {
    expect(publicEnv.appEnv).toBe('local');
    expect(publicEnv.appUrl).toBe('http://localhost:3000');
  });
});

describe('getServerEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('parses and caches the server environment with defaults', async () => {
    const { getServerEnv } = await import('@/packages/env/server');
    const first = getServerEnv();

    expect(first.apiBaseUrl).toBe('http://localhost:4000');
    expect(first.apiMocking).toBe('enabled');
    expect(getServerEnv()).toBe(first);
  });

  it('honors provided values', async () => {
    vi.stubEnv('SERVER_API_BASE_URL', 'https://api.internal.example.com');
    vi.stubEnv('SERVER_API_MOCKING', 'disabled');
    vi.resetModules();

    const { getServerEnv } = await import('@/packages/env/server');
    const env = getServerEnv();

    expect(env.apiBaseUrl).toBe('https://api.internal.example.com');
    expect(env.apiMocking).toBe('disabled');
  });

  it('rejects malformed values instead of propagating them', async () => {
    vi.stubEnv('SERVER_API_BASE_URL', 'not-a-url');
    vi.resetModules();

    const { getServerEnv } = await import('@/packages/env/server');

    expect(() => getServerEnv()).toThrow(/server environment/);
  });
});
