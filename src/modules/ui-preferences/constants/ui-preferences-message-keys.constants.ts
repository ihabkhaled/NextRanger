import type { AppDirectionValue } from '@/shared/enums/app-direction.enum';
import type { AppThemeValue } from '@/shared/enums/app-theme.enum';

/** Message keys relative to the `settings` namespace. */
export const UI_PREFERENCES_MESSAGE_KEYS = {
  title: 'title',
  subtitle: 'subtitle',
  themeLabel: 'theme.label',
  themeOption: {
    light: 'theme.light',
    dark: 'theme.dark',
    system: 'theme.system',
  } satisfies Record<AppThemeValue, string>,
  directionLabel: 'direction.label',
  directionOption: {
    ltr: 'direction.ltr',
    rtl: 'direction.rtl',
  } satisfies Record<AppDirectionValue, string>,
  sidebarLabel: 'sidebar.label',
  sidebarExpanded: 'sidebar.expanded',
  sidebarCollapsed: 'sidebar.collapsed',
} as const;
