import { renderHook, waitFor } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DEFAULT_LOCALE, IntlMessagesProvider } from '@/packages/i18n';
import enMessages from '@/packages/i18n/messages/en.json';
import { AppQueryClient, AppQueryClientProvider } from '@/packages/query';

import { articleQueryKeys } from '../queries/article-query-keys';
import { invalidateArticleLists } from '../queries/article.invalidate';
import { useCreateArticleMutation } from '../queries/article.mutations';

function buildWrapper(queryClient: AppQueryClient) {
  return function Wrapper(props: Readonly<{ children: ReactNode }>): ReactElement {
    return (
      <AppQueryClientProvider client={queryClient}>
        <IntlMessagesProvider locale={DEFAULT_LOCALE} messages={enMessages}>
          {props.children}
        </IntlMessagesProvider>
      </AppQueryClientProvider>
    );
  };
}

describe('invalidateArticleLists', () => {
  it('invalidates exactly the article list key group', async () => {
    const queryClient = new AppQueryClient();
    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    await invalidateArticleLists(queryClient);

    expect(spy).toHaveBeenCalledWith({ queryKey: articleQueryKeys.lists() });
  });
});

describe('useCreateArticleMutation', () => {
  it('creates an article via the gateway and invalidates the lists', async () => {
    const queryClient = new AppQueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateArticleMutation(), {
      wrapper: buildWrapper(queryClient),
    });

    result.current.mutate({ title: 'From test', summary: 'Created in a test' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.title).toBe('From test');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: articleQueryKeys.lists() });
  });
});
