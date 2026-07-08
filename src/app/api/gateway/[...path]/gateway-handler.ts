import 'server-only';

import { getServerEnv } from '@/packages/env/server';

import { proxyToUpstream, respondFromMock } from './gateway.helper';

/**
 * BFF gateway: the single place browser traffic crosses to the backend.
 * In mock mode (SERVER_API_MOCKING=enabled) it serves module fixtures so the
 * reference app runs without a backend; otherwise it proxies to
 * SERVER_API_BASE_URL. The sentinel password for the negative login path is
 * AUTH_MOCK_REJECTED_PASSWORD ("{@link AUTH_MOCK_REJECTED_PASSWORD}").
 */
export function handleGatewayRequest(
  request: Request,
  pathSegments: readonly string[],
): Promise<Response> {
  const upstreamPath = pathSegments.join('/');
  const env = getServerEnv();

  if (env.apiMocking === 'enabled') {
    return respondFromMock(request, upstreamPath);
  }

  return proxyToUpstream(request, upstreamPath);
}
