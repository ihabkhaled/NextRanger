/**
 * SSR-safe facades over browser globals. This file is one of the only two
 * places (with src/packages/storage) allowed to touch window/document/etc.
 *
 * Detection goes through an untyped global read because lib.dom declares
 * `window` as always present — the type system cannot express "absent on the
 * server", so this facade is where that reality is encoded once.
 */

function readGlobalProperty(name: string): unknown {
  return (globalThis as Record<string, unknown>)[name];
}

export function isBrowser(): boolean {
  return readGlobalProperty('window') !== undefined;
}

export function getSafeWindow(): Window | null {
  const value = readGlobalProperty('window');

  return value === undefined ? null : (value as Window);
}

export function getSafeDocument(): Document | null {
  const value = readGlobalProperty('document');

  return value === undefined ? null : (value as Document);
}

/** Query and hash suffix for URL-preserving client navigation. */
export function getBrowserLocationSuffix(): string {
  const safeWindow = getSafeWindow();
  return safeWindow ? `${safeWindow.location.search}${safeWindow.location.hash}` : '';
}

export function openEmailDraft(recipient: string, subject: string, body: string): boolean {
  const safeWindow = getSafeWindow();
  if (!safeWindow) return false;
  safeWindow.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return true;
}

/** Evaluate a media query; returns false during SSR. */
export function matchesMediaQuery(query: string): boolean {
  const safeWindow = getSafeWindow();

  if (!safeWindow) {
    return false;
  }

  return safeWindow.matchMedia(query).matches;
}

export function prefersReducedMotion(): boolean {
  return matchesMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Copy text to the clipboard; resolves false when unavailable or denied. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  const clipboard = getSafeWindow()?.navigator.clipboard;

  if (!clipboard) {
    return false;
  }

  try {
    await clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
}
