import { renderHook } from '@testing-library/react';
import {
  AppRouterContext,
  type AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useAppNavigation } from '@/packages/navigation';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';

/**
 * The hook needs Next's app-router context; tests provide it directly via the
 * context objects Next itself uses (a stub router, no vendor mocking).
 */
function buildRouterStub(): AppRouterInstance {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };
}

function buildWrapper(router: AppRouterInstance, pathname: string) {
  return function Wrapper(props: Readonly<{ children: ReactNode }>): ReactElement {
    return (
      <AppRouterContext.Provider value={router}>
        <PathnameContext.Provider value={pathname}>{props.children}</PathnameContext.Provider>
      </AppRouterContext.Provider>
    );
  };
}

describe('useAppNavigation', () => {
  it('exposes the current pathname', () => {
    const router = buildRouterStub();
    const { result } = renderHook(() => useAppNavigation(), {
      wrapper: buildWrapper(router, '/articles'),
    });

    expect(result.current.pathname).toBe('/articles');
  });

  it('delegates push/replace/back/refresh to the router', () => {
    const router = buildRouterStub();
    const { result } = renderHook(() => useAppNavigation(), {
      wrapper: buildWrapper(router, '/'),
    });

    result.current.push(ROUTE_PATHS.home);
    result.current.replace(ROUTE_PATHS.settings);
    result.current.back();
    result.current.refresh();

    expect(router.push).toHaveBeenCalledWith('/');
    expect(router.replace).toHaveBeenCalledWith('/settings');
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
});
