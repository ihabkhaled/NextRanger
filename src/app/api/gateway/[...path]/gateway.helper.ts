import { createArticleMockResponse, getArticlesListMockResponse } from '@/modules/articles';
import { buildLoginMockResponse } from '@/modules/auth';
import { getServerEnv } from '@/packages/env/server';
import { appLogger } from '@/packages/logger';

import { GATEWAY_HTTP_STATUS, GATEWAY_JSON_HEADERS } from './gateway.constants';

export function jsonResponse(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: GATEWAY_JSON_HEADERS });
}

export async function respondFromMock(request: Request, upstreamPath: string): Promise<Response> {
  if (upstreamPath === 'articles' && request.method === 'GET') {
    return jsonResponse(getArticlesListMockResponse(), GATEWAY_HTTP_STATUS.ok);
  }

  if (upstreamPath === 'articles' && request.method === 'POST') {
    const body = (await request.json()) as { title?: string; summary?: string };

    if (!body.title || !body.summary) {
      return jsonResponse({ error: 'invalid_request' }, GATEWAY_HTTP_STATUS.badRequest);
    }

    return jsonResponse(
      createArticleMockResponse({ title: body.title, summary: body.summary }),
      GATEWAY_HTTP_STATUS.created,
    );
  }

  if (upstreamPath === 'auth/login' && request.method === 'POST') {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return jsonResponse({ error: 'invalid_request' }, GATEWAY_HTTP_STATUS.badRequest);
    }

    const loginResponse = buildLoginMockResponse({ email: body.email, password: body.password });

    if (!loginResponse) {
      return jsonResponse({ error: 'invalid_credentials' }, GATEWAY_HTTP_STATUS.unauthorized);
    }

    return jsonResponse(loginResponse, GATEWAY_HTTP_STATUS.ok);
  }

  return jsonResponse({ error: 'not_found' }, GATEWAY_HTTP_STATUS.notFound);
}

export async function proxyToUpstream(request: Request, upstreamPath: string): Promise<Response> {
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

    return jsonResponse({ error: 'bad_gateway' }, GATEWAY_HTTP_STATUS.badGateway);
  }
}
