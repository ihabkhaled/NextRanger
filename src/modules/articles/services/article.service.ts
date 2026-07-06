import { fetchArticleListFromGateway, postArticleToGateway } from '../gateway/articles.gateway';
import { mapArticleApiItem, mapArticleListResponse } from '../mappers/article.mapper';
import type {
  Article,
  ArticleListResult,
  ArticleListParams,
  CreateArticleInput,
} from '../types/article.types';

/** Use-case: list articles. React does not exist at this layer. */
export async function listArticles(params: ArticleListParams): Promise<ArticleListResult> {
  const response = await fetchArticleListFromGateway(params);

  return mapArticleListResponse(response);
}

/** Use-case: create an article. */
export async function createArticle(input: CreateArticleInput): Promise<Article> {
  const response = await postArticleToGateway({
    title: input.title,
    summary: input.summary,
  });

  return mapArticleApiItem(response);
}
