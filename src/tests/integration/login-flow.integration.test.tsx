import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@tests/helpers/render-with-providers';
import { loginDelayedHandler } from '@tests/msw/handlers/auth.handlers';
import { mswServer } from '@tests/msw/server';
import { beforeEach, describe, expect, it } from 'vitest';

import { AUTH_MOCK_REJECTED_PASSWORD, LoginFormContainer, useAuthStore } from '@/modules/auth';
import { AppToaster } from '@/packages/toast';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';

describe('login flow', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('shows translated validation messages on empty submit', async () => {
    const user = userEvent.setup();
    const { router } = renderWithProviders(<LoginFormContainer />);

    await user.click(screen.getByTestId(TEST_IDS.loginSubmit));

    expect(await screen.findByText('Enter your email address.')).toBeInTheDocument();
    expect(screen.getByText('Enter your password.')).toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('shows the short-password message key translated', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginFormContainer />);

    await user.type(screen.getByTestId(TEST_IDS.loginEmail), 'demo@example.com');
    await user.type(screen.getByTestId(TEST_IDS.loginPassword), 'short');
    await user.click(screen.getByTestId(TEST_IDS.loginSubmit));

    expect(await screen.findByText('Password must be at least 8 characters.')).toBeInTheDocument();
  });

  it('signs in, stores the session snapshot, toasts, and redirects home', async () => {
    const user = userEvent.setup();
    const { router } = renderWithProviders(
      <>
        <AppToaster />
        <LoginFormContainer />
      </>,
    );

    await user.type(screen.getByTestId(TEST_IDS.loginEmail), 'demo@example.com');
    await user.type(screen.getByTestId(TEST_IDS.loginPassword), 'valid-password');
    await user.click(screen.getByTestId(TEST_IDS.loginSubmit));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/en');
    });

    expect(useAuthStore.getState().session?.displayName).toBe('demo');
    expect(await screen.findByText('Signed in successfully.')).toBeInTheDocument();
  });

  it('disables the submit button and shows the pending label while signing in', async () => {
    mswServer.use(loginDelayedHandler(150));

    const user = userEvent.setup();

    renderWithProviders(<LoginFormContainer />);

    await user.type(screen.getByTestId(TEST_IDS.loginEmail), 'demo@example.com');
    await user.type(screen.getByTestId(TEST_IDS.loginPassword), 'valid-password');
    await user.click(screen.getByTestId(TEST_IDS.loginSubmit));

    const submit = screen.getByTestId(TEST_IDS.loginSubmit);

    await waitFor(() => {
      expect(submit).toBeDisabled();
    });
    expect(submit).toHaveTextContent('Signing in…');
  });

  it('shows the generic error on rejected credentials and keeps the session anonymous', async () => {
    const user = userEvent.setup();
    const { router } = renderWithProviders(<LoginFormContainer />);

    await user.type(screen.getByTestId(TEST_IDS.loginEmail), 'demo@example.com');
    await user.type(screen.getByTestId(TEST_IDS.loginPassword), AUTH_MOCK_REJECTED_PASSWORD);
    await user.click(screen.getByTestId(TEST_IDS.loginSubmit));

    const alert = await screen.findByTestId(TEST_IDS.loginError);

    expect(alert).toHaveTextContent('Sign-in failed. Check your credentials and try again.');
    expect(useAuthStore.getState().session).toBeNull();
    expect(router.push).not.toHaveBeenCalled();
  });
});
