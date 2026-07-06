import { articlesListServerErrorHandler } from '@tests/msw/handlers/articles.handlers';
import { mswServer } from '@tests/msw/server';
import { describe, expect, it } from 'vitest';

import { isHttpError } from '@/packages/axios';

import { createArticle, listArticles } from '../services/article.service';

describe('listArticles', () => {
  it('returns mapped domain articles from the gateway', async () => {
    const result = await listArticles({ page: 1, pageSize: 10 });

    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.items[0]?.id).toMatch(/^a-/);
    expect(typeof result.items[0]?.readingTimeMinutes).toBe('number');
    // Domain shape only — no wire fields survive the mapper.
    expect(result.items[0]).not.toHaveProperty('published_at');
  });

  it('throws a normalized HttpError on server failure', async () => {
    mswServer.use(articlesListServerErrorHandler());

    const failure = await listArticles({ page: 1, pageSize: 10 }).catch((error: unknown) => error);

    expect(isHttpError(failure)).toBe(true);
  });
});

describe('createArticle', () => {
  it('posts the input and returns the created domain article', async () => {
    const created = await createArticle({ title: 'New title', summary: 'New summary' });

    expect(created.title).toBe('New title');
    expect(created.status).toBe('draft');
    expect(created.publishedAt).toBeNull();
  });
});
