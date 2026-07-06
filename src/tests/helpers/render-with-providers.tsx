import { render, type RenderResult } from '@testing-library/react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReactElement } from 'react';

import { DEFAULT_LOCALE, IntlMessagesProvider, type AppMessages } from '@/packages/i18n';
import enMessages from '@/packages/i18n/messages/en.json';
import { AppQueryClient, AppQueryClientProvider } from '@/packages/query';

import { AppRouterStubProvider, buildRouterStub } from './app-router-stub';

export interface RenderWithProvidersOptions {
  readonly router?: AppRouterInstance;
  readonly pathname?: string;
}

/**
 * Standard integration-test provider stack: a fresh query client (no retries,
 * so error paths resolve immediately), real English messages, and a stubbed
 * app router so navigation-dependent hooks run for real.
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult & { router: AppRouterInstance } {
  const queryClient = new AppQueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const router = options.router ?? buildRouterStub();

  const result = render(
    <AppRouterStubProvider router={router} pathname={options.pathname ?? '/'}>
      <AppQueryClientProvider client={queryClient}>
        <IntlMessagesProvider locale={DEFAULT_LOCALE} messages={enMessages as AppMessages}>
          {ui}
        </IntlMessagesProvider>
      </AppQueryClientProvider>
    </AppRouterStubProvider>,
  );

  return { ...result, router };
}
