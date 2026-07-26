import type { ChangeEvent, ReactNode } from 'react';

import type { AppLocale } from '@/packages/i18n';
import type { AppThemeValue } from '@/shared/enums/app-theme.enum';

export type ThemeLabels = Readonly<Record<AppThemeValue, string>>;

export interface ShellControlsProps {
  readonly locale: AppLocale;
  readonly localeLabel: string;
  readonly themeActionLabel: string;
  readonly themeIcon: string;
  readonly localeOptions: ReactNode;
  readonly onLocaleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onThemeChange: () => void;
}

export interface ShellControlsViewModel {
  readonly themeIcon: string;
  readonly themeActionLabel: string;
  readonly onLocaleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onThemeChange: () => void;
}

export interface ShellControlsContainerProps {
  readonly locale: AppLocale;
  readonly localeLabel: string;
  readonly themeLabel: string;
  readonly themeLabels: ThemeLabels;
}
