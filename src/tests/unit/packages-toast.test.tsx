import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppToaster, showToast, ToastType } from '@/packages/toast';

/**
 * Behavior test against the real toast vendor: showToast must surface the
 * message in the mounted toast viewport.
 */
describe('showToast + AppToaster', () => {
  it('renders a success toast message', async () => {
    render(<AppToaster />);

    act(() => {
      showToast({ type: ToastType.Success, message: 'Saved successfully.' });
    });

    await waitFor(() => {
      expect(screen.getByText('Saved successfully.')).toBeInTheDocument();
    });
  });

  it('renders an error toast message', async () => {
    render(<AppToaster />);

    act(() => {
      showToast({ type: ToastType.Error, message: 'Something broke.' });
    });

    await waitFor(() => {
      expect(screen.getByText('Something broke.')).toBeInTheDocument();
    });
  });

  it('deduplicates toasts sharing a stable id', async () => {
    render(<AppToaster />);

    act(() => {
      showToast({ type: ToastType.Info, message: 'Only once.', id: 'dedupe-check' });
      showToast({ type: ToastType.Info, message: 'Only once.', id: 'dedupe-check' });
    });

    await waitFor(() => {
      expect(screen.getAllByText('Only once.')).toHaveLength(1);
    });
  });

  it('renders warning toasts', async () => {
    render(<AppToaster />);

    act(() => {
      showToast({ type: ToastType.Warning, message: 'Careful there.' });
    });

    await waitFor(() => {
      expect(screen.getByText('Careful there.')).toBeInTheDocument();
    });
  });
});
