/**
 * Public surface of the articles module. Everything else inside the module is
 * private — deep imports are an ESLint violation.
 */

export { createArticleMockResponse, getArticlesListMockResponse } from './api/articles.mock';
export { ArticlesListContainer } from './containers/articles-list.container';
export { ArticleStatus, type ArticleStatusValue } from './enums/article-status.enum';
export { buildArticlesListQueryOptions } from './queries/article.queries';
export { articleQueryKeys } from './queries/article-query-keys';
export type { Article, ArticleListParams, ArticleListResult } from './types/article.types';
