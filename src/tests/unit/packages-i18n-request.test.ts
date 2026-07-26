import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  // Pass-through so the exported value is the raw config function.
  getRequestConfig: (factory: unknown) => factory,
}));

type RequestConfigFactory = (input: {
  requestLocale: Promise<string | undefined>;
}) => Promise<{ locale: string; messages: Record<string, unknown> }>;

const requestModule = await import('@/packages/i18n/request');
const requestConfig = requestModule.default as RequestConfigFactory;

describe('i18n request config', () => {
  it('falls back to the default locale without a URL locale', async () => {
    const config = await requestConfig({ requestLocale: Promise.resolve(undefined) });

    expect(config.locale).toBe('en');
    expect(config.messages).toHaveProperty('app');
  });

  it('honors a supported URL locale and loads its catalog', async () => {
    const config = await requestConfig({ requestLocale: Promise.resolve('fa') });

    expect(config.locale).toBe('fa');
    expect(config.messages).toHaveProperty('nav');
  });

  it('ignores an unsupported URL locale', async () => {
    const config = await requestConfig({ requestLocale: Promise.resolve('xx') });

    expect(config.locale).toBe('en');
  });
});
