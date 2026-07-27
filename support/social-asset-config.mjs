import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPPORT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));

export const REPOSITORY_ROOT = path.resolve(SUPPORT_DIRECTORY, '..');
export const MESSAGE_DIRECTORY = path.join(REPOSITORY_ROOT, 'src/packages/i18n/messages');
export const FONT_DIRECTORY = path.join(REPOSITORY_ROOT, 'src/shared/fonts/social');
export const SOCIAL_IMAGE_DIRECTORY = path.join(REPOSITORY_ROOT, 'public/social');
export const FONT_WEIGHTS = [400, 800, 900];
export const LOCALE_FONT_FAMILIES = {
  en: 'Noto Sans',
  ar: 'Noto Sans Arabic',
  fr: 'Noto Sans',
  it: 'Noto Sans',
  de: 'Noto Sans',
  hi: 'Noto Sans Devanagari',
  fa: 'Noto Sans Arabic',
  th: 'Noto Sans Thai',
  ja: 'Noto Sans JP',
  zh: 'Noto Sans SC',
  es: 'Noto Sans',
  pt: 'Noto Sans',
  ko: 'Noto Sans KR',
  tr: 'Noto Sans',
};

export function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

export async function readLocaleRecord(locale) {
  const source = await readFile(path.join(MESSAGE_DIRECTORY, `${locale}.json`), 'utf8');
  const messages = JSON.parse(source);
  const copy = {
    description: messages.marketing.home.description,
    eyebrow: messages.marketing.routeAtlasLabel,
    title: messages.marketing.home.title,
  };
  const sourceText = [
    copy.eyebrow,
    copy.title,
    copy.description,
    'N',
    '01',
    '02',
    '03',
    '04',
    '05',
    `/${locale}`,
  ].join(' ');

  return {
    copy,
    direction: locale === 'ar' || locale === 'fa' ? 'rtl' : 'ltr',
    family: LOCALE_FONT_FAMILIES[locale],
    glyphs: [...new Set(sourceText)].join(''),
    locale,
    messageHash: digest(sourceText),
  };
}

export async function readLocaleRecords() {
  const records = [];
  for (const locale of Object.keys(LOCALE_FONT_FAMILIES)) {
    records.push(await readLocaleRecord(locale));
  }
  return records;
}
