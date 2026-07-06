import { z } from '@/packages/zod';

import { ARTICLE_STATUS_VALUES } from '../enums/article-status.enum';

/** Wire-format validation for the articles backend contract. */
export const articleApiItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  status: z.enum(ARTICLE_STATUS_VALUES),
  published_at: z.iso.datetime().nullable(),
  reading_time_minutes: z.number().int().nonnegative(),
});

export const articleApiListResponseSchema = z.object({
  items: z.array(articleApiItemSchema),
  total_count: z.number().int().nonnegative(),
});

export const createArticleInputSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
});
