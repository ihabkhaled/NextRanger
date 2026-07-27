import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { AppIntlProvider, DEFAULT_LOCALE, useAppTranslation } from '@/packages/i18n';
import enMessages from '@/packages/i18n/messages/en.json';
import { AppQueryProvider } from '@/packages/query';
import { VirtualizedList } from '@/packages/virtuoso';

function TranslatedAppTitle(): ReactElement {
  const t = useAppTranslation('app');
  return <span>{t('title')}</span>;
}

describe('AppQueryProvider', () => {
  it('provides the query cache to children (devtools included in local env)', () => {
    render(
      <AppQueryProvider>
        <span>query-child</span>
      </AppQueryProvider>,
    );

    expect(screen.getByText('query-child')).toBeInTheDocument();
  });
});

describe('AppIntlProvider', () => {
  it('provides the resolved locale to children', () => {
    render(
      <AppIntlProvider locale={DEFAULT_LOCALE}>
        <span>intl-child</span>
      </AppIntlProvider>,
    );

    expect(screen.getByText('intl-child')).toBeInTheDocument();
  });

  it('provides an explicit locale catalog to hydrated children', () => {
    render(
      <AppIntlProvider locale={DEFAULT_LOCALE} messages={enMessages}>
        <TranslatedAppTitle />
      </AppIntlProvider>,
    );

    expect(screen.getByText('Strict Next Ranger')).toBeInTheDocument();
  });
});

describe('VirtualizedList', () => {
  it('renders the initial rows via keys and render callbacks', () => {
    const items = Array.from({ length: 200 }, (_, index) => ({
      id: `row-${index}`,
      label: `Row ${index}`,
    }));

    render(
      <VirtualizedList
        items={items}
        heightPx={400}
        initialRenderCount={5}
        computeItemKey={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        testId="virtual-list"
      />,
    );

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.getByText('Row 0')).toBeInTheDocument();
    expect(screen.getByText('Row 4')).toBeInTheDocument();
    expect(screen.queryByText('Row 150')).not.toBeInTheDocument();
  });

  it('uses runtime measurement when no initial render count is supplied', () => {
    render(
      <VirtualizedList
        items={[{ id: 'measured', label: 'Measured row' }]}
        heightPx={200}
        computeItemKey={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        testId="measured-list"
      />,
    );

    expect(screen.getByTestId('measured-list')).toBeInTheDocument();
  });
});
