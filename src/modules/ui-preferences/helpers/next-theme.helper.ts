import { AppTheme, type AppThemeValue } from '@/shared/enums/app-theme.enum';

export function getNextTheme(theme: AppThemeValue): AppThemeValue {
  if (theme === AppTheme.Light) return AppTheme.Dark;
  if (theme === AppTheme.Dark) return AppTheme.System;
  return AppTheme.Light;
}

export function buildThemeActionLabel(
  actionLabel: string,
  currentLabel: string,
  nextLabel: string,
): string {
  return `${actionLabel}: ${currentLabel} → ${nextLabel}`;
}
