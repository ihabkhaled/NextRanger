import type { ReactNode, SyntheticEvent } from 'react';

import type { AppRegisteredFieldProps } from '@/packages/forms';
import type { AppLocale } from '@/packages/i18n';

export type MarketingPageKind = 'home' | 'about' | 'features' | 'faq' | 'contact';

export interface MarketingPageCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

export interface MarketingPageProps extends MarketingPageCopy {
  readonly trustLabel: string;
  readonly primaryAction: ReactNode;
  readonly secondaryAction: ReactNode;
  readonly content: ReactNode;
  readonly structuredData: string;
  readonly nonce?: string | undefined;
}

export interface MarketingPageContainerProps {
  readonly locale: AppLocale;
  readonly kind: MarketingPageKind;
}

export interface RouteAtlasProps {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly stations: ReactNode;
}

export interface EditorialSectionProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly content: ReactNode;
}

export interface MarketingFaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface ContactFormValues {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}
export interface ContactFieldViewModel {
  readonly fieldId: string;
  readonly label: string;
  readonly error?: string | undefined;
  readonly inputProps: AppRegisteredFieldProps;
}
export interface ContactFormViewModel {
  readonly name: ContactFieldViewModel;
  readonly email: ContactFieldViewModel;
  readonly message: ContactFieldViewModel;
  readonly submitLabel: string;
  readonly outcome: string | null;
  readonly onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}
export interface ContactFormProps {
  readonly viewModel: ContactFormViewModel;
}
