import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent, ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { SiteNavigationContainer } from '@/modules/site-navigation';
import { ShellControlsContainer, useUiPreferencesStore } from '@/modules/ui-preferences';
import { useAppNavigation } from '@/packages/navigation';
import { AppTheme } from '@/shared/enums/app-theme.enum';
import { AppRouterStubProvider, buildRouterStub } from '@/tests/helpers/app-router-stub';

const labels = {
  home: 'Home',
  about: 'About',
  features: 'Features',
  faq: 'FAQ',
  contact: 'Contact',
  articles: 'Articles',
  settings: 'Settings',
  workbench: 'Workbench',
  login: 'Sign in',
} as const;
const MOBILE_MENU_TEST_ID = 'mobile-navigation-test';

function preventTestNavigation(event: MouseEvent<HTMLElement>): void {
  event.preventDefault();
}

describe('site navigation', () => {
  beforeEach(() => {
    useUiPreferencesStore.setState({ theme: AppTheme.Light });
  });

  it('marks the current localized route semantically', () => {
    const router = buildRouterStub();
    const wrapper = ({ children }: Readonly<{ children: ReactNode }>) => (
      <AppRouterStubProvider router={router} pathname="/en/features">
        {children}
      </AppRouterStubProvider>
    );
    const view = renderHook(() => useAppNavigation(), { wrapper });
    expect(view.result.current.pathname).toBe('/en/features');
    render(
      <AppRouterStubProvider router={router} pathname="/en/features">
        <SiteNavigationContainer locale="en" labels={labels} scope="marketing" />
      </AppRouterStubProvider>,
    );

    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('aria-current', 'page');
  });

  it('closes an open mobile navigation menu after selecting a route', async () => {
    const user = userEvent.setup();
    render(
      <AppRouterStubProvider router={buildRouterStub()} pathname="/en">
        <details open data-testid={MOBILE_MENU_TEST_ID} onClickCapture={preventTestNavigation}>
          <summary>Menu</summary>
          <SiteNavigationContainer locale="en" labels={labels} scope="marketing" />
        </details>
      </AppRouterStubProvider>,
    );
    const menu = screen.getByTestId(MOBILE_MENU_TEST_ID);

    expect(menu).toHaveAttribute('open');
    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(menu).not.toHaveAttribute('open');
  });

  it('names the compact theme action with current and next modes', () => {
    render(
      <AppRouterStubProvider router={buildRouterStub()} pathname="/en">
        <ShellControlsContainer
          locale="en"
          localeLabel="Change language"
          themeLabel="Change color theme"
          themeLabels={{ light: 'Light', dark: 'Dark', system: 'System' }}
        />
      </AppRouterStubProvider>,
    );

    expect(screen.getByRole('button', { name: /Light.*Dark/u })).toBeInTheDocument();
  });
});
