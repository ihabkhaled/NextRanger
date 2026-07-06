import { httpClient } from '@/packages/axios';
import { parseSchema } from '@/packages/zod';
import { buildGatewayPath } from '@/shared/api/api-routes.constants';

import type {
  ArticleApiCreateRequest,
  ArticleApiItem,
  ArticleApiListResponse,
} from '../api/articles.api.types';
import { ARTICLE_ENDPOINTS } from '../constants/article.constants';
import { articleApiItemSchema, articleApiListResponseSchema } from '../schemas/article.schema';
import type { ArticleListParams } from '../types/article.types';

/**
 * HTTP contract layer: talks to the BFF gateway and validates the wire shape.
 * Returns API types only — mapping to domain happens in the service.
 */
export async function fetchArticleListFromGateway(
  params: ArticleListParams,
): Promise<ArticleApiListResponse> {
  const response = await httpClient.get<unknown>(buildGatewayPath(ARTICLE_ENDPOINTS.list), {
    params: { page: params.page, page_size: params.pageSize },
  });

  return parseSchema(articleApiListResponseSchema, response.data, 'articles list response');
}

export async function postArticleToGateway(
  request: ArticleApiCreateRequest,
): Promise<ArticleApiItem> {
  const response = await httpClient.post<unknown>(
    buildGatewayPath(ARTICLE_ENDPOINTS.create),
    request,
  );

  return parseSchema(articleApiItemSchema, response.data, 'article create response');
}
