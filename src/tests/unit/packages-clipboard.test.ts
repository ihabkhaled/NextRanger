import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyTextToClipboard } from '@/packages/browser';

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves false when the clipboard API is unavailable (jsdom default)', async () => {
    expect(await copyTextToClipboard('hello')).toBe(false);
  });

  it('writes and resolves true when the clipboard API exists', async () => {
    const writeText = vi.fn(async () => {});

    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    expect(await copyTextToClipboard('hello')).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('resolves false when the clipboard write is denied', async () => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    });

    expect(await copyTextToClipboard('hello')).toBe(false);
  });
});
