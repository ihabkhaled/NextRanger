import { MARKETING_TECHNOLOGY_KEYWORDS } from '../constants/marketing-seo.constants';

/** Combines locale-native search intent with stable product technology names. */
export function buildMarketingKeywords(localizedTerms: readonly string[]): readonly string[] {
  return [
    ...new Set([
      ...localizedTerms.map((term) => term.trim()).filter(Boolean),
      ...MARKETING_TECHNOLOGY_KEYWORDS,
    ]),
  ];
}
