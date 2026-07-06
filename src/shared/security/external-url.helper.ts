const SAFE_PROTOCOLS = new Set(['https:', 'mailto:']);

/**
 * Only https/mailto URLs may be rendered as external links. Everything else
 * (javascript:, data:, http:) is rejected at the boundary.
 */
export function isSafeExternalUrl(candidate: string): boolean {
  try {
    const parsed = new URL(candidate);

    return SAFE_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}
