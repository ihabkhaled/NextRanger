import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale } from '@/packages/i18n';
import arMessages from '@/packages/i18n/messages/ar.json';
import deMessages from '@/packages/i18n/messages/de.json';
import enMessages from '@/packages/i18n/messages/en.json';
import esMessages from '@/packages/i18n/messages/es.json';
import faMessages from '@/packages/i18n/messages/fa.json';
import frMessages from '@/packages/i18n/messages/fr.json';
import hiMessages from '@/packages/i18n/messages/hi.json';
import itMessages from '@/packages/i18n/messages/it.json';
import jaMessages from '@/packages/i18n/messages/ja.json';
import koMessages from '@/packages/i18n/messages/ko.json';
import ptMessages from '@/packages/i18n/messages/pt.json';
import thMessages from '@/packages/i18n/messages/th.json';
import trMessages from '@/packages/i18n/messages/tr.json';
import zhMessages from '@/packages/i18n/messages/zh.json';

const catalogs: Readonly<Record<AppLocale, Record<string, unknown>>> = {
  en: enMessages,
  ar: arMessages,
  fr: frMessages,
  it: itMessages,
  de: deMessages,
  hi: hiMessages,
  fa: faMessages,
  th: thMessages,
  ja: jaMessages,
  zh: zhMessages,
  es: esMessages,
  pt: ptMessages,
  ko: koMessages,
  tr: trMessages,
};
const permittedSharedCopyPaths = new Set([
  'app.title',
  'home.title',
  'workbench.samplePlaceholder',
]);
const questionCopyPath = /^marketing\.questions\.[^.]+\.question$/u;
const placeholderPattern = /\{([A-Za-z]\w*)/gu;

function flattenCatalog(
  value: Record<string, unknown>,
  prefix = '',
  result: Record<string, string> = {},
): Record<string, string> {
  for (const [key, child] of Object.entries(value)) {
    const childPath = prefix ? `${prefix}.${key}` : key;

    if (typeof child === 'string') {
      result[childPath] = child;
    } else if (child && typeof child === 'object' && !Array.isArray(child)) {
      flattenCatalog(child as Record<string, unknown>, childPath, result);
    }
  }

  return result;
}

function extractPlaceholders(value: string): string[] {
  return [...value.matchAll(placeholderPattern)]
    .map((match) => match[1] ?? '')
    .toSorted((left, right) => left.localeCompare(right));
}

function sortKeys(value: Record<string, string>): string[] {
  return Object.keys(value).toSorted((left, right) => left.localeCompare(right));
}

describe('localized message catalogs', () => {
  const english = flattenCatalog(catalogs[DEFAULT_LOCALE]);

  it.each(SUPPORTED_LOCALES)(
    '%s has the complete English key and placeholder contract',
    (locale) => {
      const localized = flattenCatalog(catalogs[locale]);

      expect(sortKeys(localized)).toEqual(sortKeys(english));
      for (const [key, englishCopy] of Object.entries(english)) {
        expect(extractPlaceholders(localized[key] ?? '')).toEqual(extractPlaceholders(englishCopy));
      }
    },
  );

  it.each(SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE))(
    '%s contains no long English fallback or replacement corruption',
    (locale) => {
      const localized = flattenCatalog(catalogs[locale]);
      const longEnglishFallbacks = Object.entries(localized)
        .filter(
          ([key, copy]) =>
            copy.length >= 18 && copy === english[key] && !permittedSharedCopyPaths.has(key),
        )
        .map(([key]) => key);
      const corruptedCopy = Object.entries(localized)
        .filter(
          ([key, copy]) =>
            copy.includes('\uFFFD') || (copy.includes('?') && !questionCopyPath.test(key)),
        )
        .map(([key]) => key);

      expect(longEnglishFallbacks).toEqual([]);
      expect(corruptedCopy).toEqual([]);
    },
  );

  it('describes the local mail handoff without claiming an app opened or a message sent', () => {
    expect(enMessages.marketing.contactForm.ready).not.toMatch(/\b(opened|sent automatically)\b/iu);
  });
});
