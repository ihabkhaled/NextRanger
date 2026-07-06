/**
 * BFF route constants. Client services call same-origin gateway paths built
 * here — never external hosts and never raw endpoint strings.
 */
export const API_ROUTES = {
  health: '/api/health',
  gatewayPrefix: '/api/gateway',
} as const;

export function buildGatewayPath(upstreamPath: string): string {
  const normalized = upstreamPath.startsWith('/') ? upstreamPath.slice(1) : upstreamPath;

  return `${API_ROUTES.gatewayPrefix}/${normalized}`;
}
