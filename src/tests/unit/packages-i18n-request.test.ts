import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieStore } = vi.hoisted(() => ({
  cookieStore: new Map<string, string>(),
}));

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieStore.get(name);

        return value === undefined ? undefined : { name, value };
      },
    }),
}));

vi.mock('next-intl/server', () => ({
  // Pass-through so the exported value is the raw config function.
  getRequestConfig: (factory: unknown) => factory,
}));

type RequestConfigFactory = () => Promise<{ locale: string; messages: Record<string, unknown> }>;

const requestModule = await import('@/packages/i18n/request');
const requestConfig = requestModule.default as RequestConfigFactory;

describe('i18n request config', () => {
  beforeEach(() => {
    cookieStore.clear();
  });

  it('falls back to the default locale without a cookie', async () => {
    const config = await requestConfig();

    expect(config.locale).toBe('en');
    expect(config.messages).toHaveProperty('app');
  });

  it('honors a supported locale cookie and loads its catalog', async () => {
    cookieStore.set('NEXT_LOCALE', 'ar');

    const config = await requestConfig();

    expect(config.locale).toBe('ar');
    expect(config.messages).toHaveProperty('nav');
  });

  it('ignores unsupported locale cookies', async () => {
    cookieStore.set('NEXT_LOCALE', 'xx');

    const config = await requestConfig();

    expect(config.locale).toBe('en');
  });
});
