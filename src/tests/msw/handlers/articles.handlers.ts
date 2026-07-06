import { http, HttpResponse } from 'msw';

import { createArticleMockResponse, getArticlesListMockResponse } from '@/modules/articles';

const ARTICLES_PATH = '*/api/gateway/articles';

export const articlesHandlers = [
  http.get(ARTICLES_PATH, () => HttpResponse.json(getArticlesListMockResponse())),
  http.post(ARTICLES_PATH, async ({ request }) => {
    const body = (await request.json()) as { title: string; summary: string };

    return HttpResponse.json(createArticleMockResponse(body), { status: 201 });
  }),
];

/** Override: articles list fails with a server error. */
export function articlesListServerErrorHandler(): (typeof articlesHandlers)[number] {
  return http.get(ARTICLES_PATH, () =>
    HttpResponse.json({ error: 'server_error' }, { status: 500 }),
  );
}

/** Override: articles list is empty. */
export function articlesListEmptyHandler(): (typeof articlesHandlers)[number] {
  return http.get(ARTICLES_PATH, () => HttpResponse.json({ items: [], total_count: 0 }));
}
