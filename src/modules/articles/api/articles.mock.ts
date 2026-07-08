import { ArticleStatus } from '../enums/article-status.enum';

import type {
  ArticleApiCreateRequest,
  ArticleApiItem,
  ArticleApiListResponse,
} from './articles.api.types';

/**
 * Demo backend data served by the BFF gateway when SERVER_API_MOCKING is
 * enabled. This keeps the reference app fully runnable without a backend.
 * Fixture content is data, not UI copy — it is not subject to i18n rules.
 */
const ARTICLES_FIXTURE: readonly ArticleApiItem[] = [
  {
    id: 'a-1001',
    title: 'Designing module-first frontends',
    summary: 'Why feature modules with strict public surfaces beat global folders at scale.',
    status: ArticleStatus.Published,
    published_at: '2026-06-21T09:00:00.000Z',
    reading_time_minutes: 7,
  },
  {
    id: 'a-1002',
    title: 'TSX-only component files in practice',
    summary: 'Moving every decision out of the render tree and into hooks, helpers, and mappers.',
    status: ArticleStatus.Published,
    published_at: '2026-05-02T10:30:00.000Z',
    reading_time_minutes: 5,
  },
  {
    id: 'a-1003',
    title: 'One owner per package',
    summary: 'How vendor wrappers turn dependency upgrades into single-file changes.',
    status: ArticleStatus.Published,
    published_at: '2026-03-14T08:15:00.000Z',
    reading_time_minutes: 6,
  },
  {
    id: 'a-1004',
    title: 'Query keys are cache addresses',
    summary: 'Builder-generated keys, exact invalidation, and why inline arrays fragment caches.',
    status: ArticleStatus.Draft,
    published_at: null,
    reading_time_minutes: 4,
  },
  {
    id: 'a-1005',
    title: 'The retirement of the utils folder',
    summary: 'A tour of the utils/helpers/mappers/schemas split and what belongs where.',
    status: ArticleStatus.Archived,
    published_at: '2025-11-30T12:00:00.000Z',
    reading_time_minutes: 9,
  },
];

export function getArticlesListMockResponse(): ArticleApiListResponse {
  return {
    items: ARTICLES_FIXTURE,
    total_count: ARTICLES_FIXTURE.length,
  };
}

export function createArticleMockResponse(request: ArticleApiCreateRequest): ArticleApiItem {
  return {
    id: `a-${Date.now()}`,
    title: request.title,
    summary: request.summary,
    status: ArticleStatus.Draft,
    published_at: null,
    reading_time_minutes: 1,
  };
}
