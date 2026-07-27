import type { AppLocale } from '@/packages/i18n';

export interface SeoMetadataInput {
  readonly locale: AppLocale;
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly socialImageAlt: string;
}
