import { describe, expect, it } from 'vitest';

import { articleQueryKeys } from '../queries/article-query-keys';

describe('articleQueryKeys', () => {
  it('roots every key under the module namespace', () => {
    expect(articleQueryKeys.root).toEqual(['articles']);
    expect(articleQueryKeys.lists()).toEqual(['articles', 'list']);
    expect(articleQueryKeys.details()).toEqual(['articles', 'detail']);
  });

  it('embeds list params so distinct pages get distinct cache entries', () => {
    const first = articleQueryKeys.list({ page: 1, pageSize: 10 });
    const second = articleQueryKeys.list({ page: 2, pageSize: 10 });

    expect(first).toEqual(['articles', 'list', { page: 1, pageSize: 10 }]);
    expect(first).not.toEqual(second);
  });

  it('builds detail keys from the id', () => {
    expect(articleQueryKeys.detail('a-9')).toEqual(['articles', 'detail', 'a-9']);
  });

  it('keeps list keys prefixed by lists() so group invalidation matches', () => {
    const listKey = articleQueryKeys.list({ page: 1, pageSize: 10 });

    expect(listKey.slice(0, 2)).toEqual([...articleQueryKeys.lists()]);
  });
});
