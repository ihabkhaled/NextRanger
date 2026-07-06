import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@tests/helpers/render-with-providers';
import {
  articlesListEmptyHandler,
  articlesListServerErrorHandler,
} from '@tests/msw/handlers/articles.handlers';
import { mswServer } from '@tests/msw/server';
import { describe, expect, it } from 'vitest';

import { ArticlesListContainer } from '@/modules/articles';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';

describe('articles list flow', () => {
  it('shows the loading state, then renders the article cards', async () => {
    renderWithProviders(<ArticlesListContainer />);

    expect(screen.getByTestId(TEST_IDS.articlesLoading)).toBeInTheDocument();

    const list = await screen.findByTestId(TEST_IDS.articlesList);

    expect(list).toBeInTheDocument();
    expect(screen.getByText('Designing module-first frontends')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(5);
  });

  it('renders translated status labels and reading times', async () => {
    renderWithProviders(<ArticlesListContainer />);

    await screen.findByTestId(TEST_IDS.articlesList);

    expect(screen.getAllByText('Published').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('7 minute read')).toBeInTheDocument();
  });

  it('shows the empty state when the gateway returns no articles', async () => {
    mswServer.use(articlesListEmptyHandler());

    renderWithProviders(<ArticlesListContainer />);

    const empty = await screen.findByTestId(TEST_IDS.articlesEmpty);

    expect(empty).toHaveTextContent('No articles yet.');
  });

  it('shows the error state with a working retry on server failure', async () => {
    const user = userEvent.setup();

    mswServer.use(articlesListServerErrorHandler());

    renderWithProviders(<ArticlesListContainer />);

    const errorState = await screen.findByTestId(TEST_IDS.articlesError);

    expect(errorState).toHaveTextContent('We could not load the articles.');

    // Restore the healthy handler, then retry through the UI.
    mswServer.resetHandlers();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.articlesList)).toBeInTheDocument();
    });
  });
});
