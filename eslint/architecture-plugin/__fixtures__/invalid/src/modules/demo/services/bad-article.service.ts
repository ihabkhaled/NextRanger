// FIXTURE: deliberate violations for the frontend-architecture rule tests.
import axios from 'axios';

import { ArticleCard } from '@/modules/articles/components/article-card.component';

export const ARTICLES_ENDPOINT = '/api/articles';

type InlineServiceResult = {
  items: unknown[];
};

export async function badListArticles(): Promise<InlineServiceResult> {
  const token = localStorage.getItem('auth-token');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${baseUrl}${ARTICLES_ENDPOINT}`, {
    headers: { Authorization: `Bearer ${token ?? ''}` },
  });

  void ArticleCard;

  return { items: response.data };
}
