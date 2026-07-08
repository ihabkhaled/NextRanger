import { describe, expect, it } from 'vitest';

import { resolveArticlesListState } from '../helpers/article-list-state.helper';

describe('resolveArticlesListState', () => {
  it('returns loading when pending', () => {
    expect(resolveArticlesListState({ isPending: true, isError: false, itemCount: 0 })).toBe(
      'loading',
    );
  });

  it('returns error when errored, even if empty', () => {
    expect(resolveArticlesListState({ isPending: false, isError: true, itemCount: 0 })).toBe(
      'error',
    );
  });

  it('returns empty when ready but has no items', () => {
    expect(resolveArticlesListState({ isPending: false, isError: false, itemCount: 0 })).toBe(
      'empty',
    );
  });

  it('returns ready when resolved with items', () => {
    expect(resolveArticlesListState({ isPending: false, isError: false, itemCount: 3 })).toBe(
      'ready',
    );
  });
});
