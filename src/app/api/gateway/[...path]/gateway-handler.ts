import 'server-only';

import { createArticleMockResponse, getArticlesListMockResponse } from '@/modules/articles';
import { buildLoginMockResponse, AUTH_MOCK_REJECTED_PASSWORD } from '@/modules/auth';
import { getServerEnv } from '@/packages/env/server';
import { appLogger } from '@/packages/logger';

const JSON_HEADERS = { 'content-type': 'application/json' } as const;

const HTTP_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  badGateway: 502,
} as const;

function jsonResponse(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: JSON_HEADERS });
}

async function respondFromMock(request: Request, upstreamPath: string): Promise<Response> {
  if (upstreamPath === 'articles' && request.method === 'GET') {
    return jsonResponse(getArticlesListMockResponse(), HTTP_STATUS.ok);
  }

  if (upstreamPath === 'articles' && request.method === 'POST') {
    const body = (await request.json()) as { title?: string; summary?: string };

    if (!body.title || !body.summary) {
      return jsonResponse({ error: 'invalid_request' }, HTTP_STATUS.badRequest);
    }

    return jsonResponse(
      createArticleMockResponse({ title: body.title, summary: body.summary }),
      HTTP_STATUS.created,
    );
  }

  if (upstreamPath === 'auth/login' && request.method === 'POST') {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return jsonResponse({ error: 'invalid_request' }, HTTP_STATUS.badRequest);
    }

    const loginResponse = buildLoginMockResponse({ email: body.email, password: body.password });

    if (!loginResponse) {
      return jsonResponse({ error: 'invalid_credentials' }, HTTP_STATUS.unauthorized);
    }

    return jsonResponse(loginResponse, HTTP_STATUS.ok);
  }

  return jsonResponse({ error: 'not_found' }, HTTP_STATUS.notFound);
}

async function proxyToUpstream(request: Request, upstreamPath: string): Promise<Response> {
  const env = getServerEnv();
  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(`${upstreamPath}${requestUrl.search}`, `${env.apiBaseUrl}/`);

  const requestBody =
    request.method === 'GET' || request.method === 'HEAD' ? null : await request.text();

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        'content-type': request.headers.get('content-type') ?? 'application/json',
        cookie: request.headers.get('cookie') ?? '',
      },
      body: requestBody,
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: upstreamResponse.headers,
    });
  } catch (error) {
    appLogger.error('Gateway upstream request failed', {
      path: upstreamPath,
      message: error instanceof Error ? error.message : 'unknown',
    });

    return jsonResponse({ error: 'bad_gateway' }, HTTP_STATUS.badGateway);
  }
}

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
