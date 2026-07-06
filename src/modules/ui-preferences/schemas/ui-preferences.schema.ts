import { z } from '@/packages/zod';
import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';

/** Validates persisted snapshots read back from browser storage. */
export const uiPreferencesSnapshotSchema = z.object({
  theme: z.enum([AppTheme.Light, AppTheme.Dark, AppTheme.System]),
  direction: z.enum([AppDirection.Ltr, AppDirection.Rtl]),
  isSidebarExpanded: z.boolean(),
});
