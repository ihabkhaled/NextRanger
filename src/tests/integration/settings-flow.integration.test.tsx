import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@tests/helpers/render-with-providers';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  UiPreferencesContainer,
  UiPreferencesEffects,
  useUiPreferencesStore,
} from '@/modules/ui-preferences';
import { STORAGE_KEYS } from '@/shared/constants/storage-keys.constants';
import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';

function matchMediaDark(query: string): MediaQueryList {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as MediaQueryList;
}

describe('settings flow', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
    document.documentElement.dataset['theme'] = 'light';
    document.documentElement.setAttribute('dir', 'ltr');
    useUiPreferencesStore.setState({
      theme: AppTheme.Light,
      direction: AppDirection.Ltr,
      isSidebarExpanded: true,
      hasHydrated: false,
    });
  });

  it('marks the current theme option as pressed', () => {
    renderWithProviders(<UiPreferencesContainer />);

    expect(screen.getByTestId('settings-theme-light')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('settings-theme-dark')).toHaveAttribute('aria-pressed', 'false');
  });

  it('selecting dark updates the store, the DOM attribute, and persists', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <UiPreferencesEffects />
        <UiPreferencesContainer />
      </>,
    );

    await user.click(screen.getByTestId('settings-theme-dark'));

    expect(useUiPreferencesStore.getState().theme).toBe(AppTheme.Dark);
    expect(screen.getByTestId('settings-theme-dark')).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.dataset['theme']).toBe('dark');

    const persisted = globalThis.localStorage.getItem(STORAGE_KEYS.uiPreferences);

    expect(persisted).toContain('"theme":"dark"');
  });

  it('system theme resolves through the color-scheme media query', async () => {
    const user = userEvent.setup();

    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: matchMediaDark,
    });

    renderWithProviders(
      <>
        <UiPreferencesEffects />
        <UiPreferencesContainer />
      </>,
    );

    await user.click(screen.getByTestId('settings-theme-system'));

    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('keeps the URL-derived RTL direction when stored preferences say LTR', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    globalThis.localStorage.setItem(
      STORAGE_KEYS.uiPreferences,
      JSON.stringify({ theme: 'dark', direction: 'ltr', isSidebarExpanded: false }),
    );

    renderWithProviders(<UiPreferencesEffects />);

    await waitFor(() => {
      expect(useUiPreferencesStore.getState().hasHydrated).toBe(true);
    });

    expect(useUiPreferencesStore.getState().direction).toBe(AppDirection.Rtl);
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  });

  it('toggling the sidebar updates the label', async () => {
    const user = userEvent.setup();

    renderWithProviders(<UiPreferencesContainer />);

    expect(screen.getByRole('button', { name: 'Expanded' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expanded' }));

    expect(screen.getByRole('button', { name: 'Collapsed' })).toBeInTheDocument();
  });

  it('hydrates a stored snapshot on mount', async () => {
    globalThis.localStorage.setItem(
      STORAGE_KEYS.uiPreferences,
      JSON.stringify({ theme: 'dark', direction: 'rtl', isSidebarExpanded: false }),
    );

    renderWithProviders(<UiPreferencesEffects />);

    await waitFor(() => {
      expect(useUiPreferencesStore.getState().hasHydrated).toBe(true);
    });

    expect(useUiPreferencesStore.getState().theme).toBe(AppTheme.Dark);
  });
});
