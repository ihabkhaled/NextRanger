import { describe, expect, it } from 'vitest';

import { safeParseSchema } from '@/packages/zod';

import {
  articleApiItemSchema,
  articleApiListResponseSchema,
  createArticleInputSchema,
} from '../schemas/article.schema';

const validItem = {
  id: 'a-1',
  title: 'Title',
  summary: '',
  status: 'draft',
  published_at: null,
  reading_time_minutes: 0,
};

describe('articleApiItemSchema', () => {
  it('accepts a valid wire item', () => {
    expect(safeParseSchema(articleApiItemSchema, validItem).success).toBe(true);
  });

  it('rejects an unknown status', () => {
    const result = safeParseSchema(articleApiItemSchema, { ...validItem, status: 'deleted' });

    expect(result.success).toBe(false);
  });

  it('rejects a non-ISO published_at', () => {
    const result = safeParseSchema(articleApiItemSchema, {
      ...validItem,
      published_at: 'yesterday',
    });

    expect(result.success).toBe(false);
  });

  it('rejects negative reading time', () => {
    const result = safeParseSchema(articleApiItemSchema, {
      ...validItem,
      reading_time_minutes: -1,
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty id', () => {
    expect(safeParseSchema(articleApiItemSchema, { ...validItem, id: '' }).success).toBe(false);
  });
});

describe('articleApiListResponseSchema', () => {
  it('accepts a valid list response', () => {
    const result = safeParseSchema(articleApiListResponseSchema, {
      items: [validItem],
      total_count: 1,
    });

    expect(result.success).toBe(true);
  });

  it('rejects a missing total_count', () => {
    expect(safeParseSchema(articleApiListResponseSchema, { items: [] }).success).toBe(false);
  });
});

describe('createArticleInputSchema', () => {
  it('accepts a valid input', () => {
    const result = safeParseSchema(createArticleInputSchema, { title: 'T', summary: 'S' });

    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = safeParseSchema(createArticleInputSchema, { title: '', summary: 'S' });

    expect(result.success).toBe(false);
  });
});
