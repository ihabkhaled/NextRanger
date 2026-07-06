import {
  AppRouterContext,
  type AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import type { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';

/**
 * Stub router provided through the same context objects Next.js uses, so
 * components exercising useAppNavigation run for real — no module mocking.
 */
export function buildRouterStub(): AppRouterInstance {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };
}

export function AppRouterStubProvider(
  props: Readonly<{
    router: AppRouterInstance;
    pathname?: string;
    children: ReactNode;
  }>,
): ReactElement {
  return (
    <AppRouterContext.Provider value={props.router}>
      <PathnameContext.Provider value={props.pathname ?? '/'}>
        {props.children}
      </PathnameContext.Provider>
    </AppRouterContext.Provider>
  );
}
