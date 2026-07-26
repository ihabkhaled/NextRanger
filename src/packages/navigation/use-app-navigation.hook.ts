'use client';
// client-boundary-reason: wraps Next.js client router and pathname hooks behind the navigation owner.

import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import type { AppNavigation } from './navigation-types';

/**
 * Client navigation facade. Router mutations happen only through this hook,
 * so navigation side effects stay mockable in tests.
 */
export function useAppNavigation(): AppNavigation {
  const router = useRouter();
  const pathname = usePathname();

  return useMemo(
    () => ({
      pathname,
      push: (href: Route) => {
        router.push(href);
      },
      replace: (href: Route) => {
        router.replace(href);
      },
      back: () => {
        router.back();
      },
      refresh: () => {
        router.refresh();
      },
    }),
    [router, pathname],
  );
}
