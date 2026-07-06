import type { ArticleStatusValue } from '../enums/article-status.enum';

/**
 * Wire types for the articles backend contract (snake_case). These shapes
 * exist only at the gateway boundary — mappers convert them to domain types
 * before anything else sees them.
 */
export interface ArticleApiItem {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly status: ArticleStatusValue;
  readonly published_at: string | null;
  readonly reading_time_minutes: number;
}

export interface ArticleApiListResponse {
  readonly items: readonly ArticleApiItem[];
  readonly total_count: number;
}

export interface ArticleApiCreateRequest {
  readonly title: string;
  readonly summary: string;
}
