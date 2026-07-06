import { afterEach, describe, expect, it, vi } from 'vitest';

import { appLogger } from '@/packages/logger';

describe('appLogger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs errors with context through console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    appLogger.error('Something failed', { code: 500 });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]?.join(' ')).toContain('Something failed');
  });

  it('logs warnings through console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    appLogger.warn('Heads up');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('logs info and debug in non-production environments', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    appLogger.info('FYI');
    appLogger.debug('Detail', { step: 1 });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledTimes(1);
  });
});
