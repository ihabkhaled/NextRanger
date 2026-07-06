'use client';
// client-boundary-reason: owns the TanStack Query client instance, which lives in browser memory.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactElement, type ReactNode } from 'react';

import { publicEnv } from '@/packages/env';

const DEFAULT_STALE_TIME_MS = 30_000;
const DEFAULT_GC_TIME_MS = 5 * 60_000;
const DEFAULT_RETRY_COUNT = 1;

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        gcTime: DEFAULT_GC_TIME_MS,
        retry: DEFAULT_RETRY_COUNT,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * App-wide query provider. Server data lives exclusively in this cache —
 * copying it into Zustand is an architecture violation.
 */
export function AppQueryProvider(props: Readonly<{ children: ReactNode }>): ReactElement {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      {publicEnv.appEnv === 'local' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
