import { getSafeDocument } from './browser-environment';

/**
 * Mutate a root <html> attribute (theme, direction). The only sanctioned DOM
 * mutation path outside React rendering.
 */
export function setRootAttribute(name: string, value: string): void {
  const safeDocument = getSafeDocument();

  if (safeDocument) {
    safeDocument.documentElement.setAttribute(name, value);
  }
}

export function getRootAttribute(name: string): string | null {
  const safeDocument = getSafeDocument();

  return safeDocument ? safeDocument.documentElement.getAttribute(name) : null;
}
