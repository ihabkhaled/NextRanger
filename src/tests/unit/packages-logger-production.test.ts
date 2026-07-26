import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * The logger gates debug/info on the app environment, which is resolved at
 * module load — so this suite reloads the module graph per scenario.
 */
describe('appLogger in production', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('mutes debug and info but keeps warn and error', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');
    vi.resetModules();

    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { appLogger } = await import('@/packages/logger');

    appLogger.debug('hidden');
    appLogger.info('hidden');
    appLogger.warn('visible');
    appLogger.error('visible');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
