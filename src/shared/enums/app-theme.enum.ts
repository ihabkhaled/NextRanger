export const AppTheme = {
  Light: 'light',
  Dark: 'dark',
  System: 'system',
} as const;

export type AppThemeValue = (typeof AppTheme)[keyof typeof AppTheme];
