import type { ReactElement } from 'react';

import { getRequestNonce } from '@/packages/headers';
import { getServerTranslations, setServerLocale } from '@/packages/i18n';
import { AppLink } from '@/packages/link';
import { buttonVariants, Card, CardContent, CardHeader, CardTitle } from '@/packages/ui-primitives';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { MarketingPage } from '../components/marketing-page.component';
import { MARKETING_MESSAGE_KEYS } from '../constants/marketing-message-keys.constants';
import { marketingClasses } from '../constants/marketing-style.constants';
import { buildMarketingStructuredData } from '../helpers/marketing-structured-data.helper';
import type { MarketingPageContainerProps } from '../types/marketing.types';

import { ContactFormContainer } from './contact-form.container';

export async function MarketingPageContainer(
  props: MarketingPageContainerProps,
): Promise<ReactElement> {
  setServerLocale(props.locale);
  const t = await getServerTranslations({
    locale: props.locale,
    namespace: I18N_NAMESPACES.marketing,
  });
  const nonce = await getRequestNonce();
  const pageKey = MARKETING_MESSAGE_KEYS.pages[props.kind];
  const highlights = MARKETING_MESSAGE_KEYS.highlights.map((key) => (
    <Card key={key} className={marketingClasses.card}>
      <CardHeader>
        <CardTitle className={marketingClasses.cardTitle}>{t(`${key}.title`)}</CardTitle>
      </CardHeader>
      <CardContent>{t(`${key}.description`)}</CardContent>
    </Card>
  ));
  const questions = MARKETING_MESSAGE_KEYS.questions.map((key) => (
    <details key={key} className={marketingClasses.faq}>
      <summary className={marketingClasses.faqQuestion}>{t(`${key}.question`)}</summary>
      <p className={marketingClasses.faqAnswer}>{t(`${key}.answer`)}</p>
    </details>
  ));
  let content = <section className={marketingClasses.grid}>{highlights}</section>;
  if (props.kind === 'faq') {
    content = <section className={marketingClasses.faqGrid}>{questions}</section>;
  } else if (props.kind === 'contact') {
    content = <ContactFormContainer />;
  }

  return (
    <MarketingPage
      eyebrow={t(`${pageKey}.eyebrow`)}
      title={t(`${pageKey}.title`)}
      description={t(`${pageKey}.description`)}
      trustLabel={t(MARKETING_MESSAGE_KEYS.trustLabel)}
      content={content}
      nonce={nonce}
      structuredData={buildMarketingStructuredData(
        props.locale,
        props.kind,
        t(`${pageKey}.title`),
        t(`${pageKey}.description`),
      )}
      primaryAction={
        <AppLink
          href={buildLocalizedPath(props.locale, ROUTE_PATHS.features)}
          className={buttonVariants({ variant: 'primary' })}
        >
          {t(MARKETING_MESSAGE_KEYS.primaryAction)}
        </AppLink>
      }
      secondaryAction={
        <AppLink
          href={buildLocalizedPath(props.locale, ROUTE_PATHS.workbench)}
          className={buttonVariants({ variant: 'secondary' })}
        >
          {t(MARKETING_MESSAGE_KEYS.secondaryAction)}
        </AppLink>
      }
    />
  );
}
