import type { ReactElement } from 'react';

import { getRequestNonce } from '@/packages/headers';
import { getServerTranslations, setServerLocale } from '@/packages/i18n';
import { AppLink } from '@/packages/link';
import { buttonVariants, Card, CardContent, CardHeader, CardTitle } from '@/packages/ui-primitives';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { EditorialSection } from '../components/editorial-section.component';
import { MarketingPage } from '../components/marketing-page.component';
import { RouteAtlas } from '../components/route-atlas.component';
import {
  MARKETING_ATLAS_STATIONS,
  MARKETING_MESSAGE_KEYS,
} from '../constants/marketing-message-keys.constants';
import { MARKETING_PATHS } from '../constants/marketing-seo.constants';
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
  const tApp = await getServerTranslations({
    locale: props.locale,
    namespace: I18N_NAMESPACES.app,
  });
  const tHome = await getServerTranslations({
    locale: props.locale,
    namespace: I18N_NAMESPACES.home,
  });
  const tNav = await getServerTranslations({
    locale: props.locale,
    namespace: I18N_NAMESPACES.nav,
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
  const faqItems = MARKETING_MESSAGE_KEYS.questions.map((key) => ({
    question: t(`${key}.question`),
    answer: t(`${key}.answer`),
  }));
  const questions = faqItems.map((item) => (
    <details key={item.question} className={marketingClasses.faq}>
      <summary className={marketingClasses.faqQuestion}>{item.question}</summary>
      <p className={marketingClasses.faqAnswer}>{item.answer}</p>
    </details>
  ));
  const atlasStations = MARKETING_ATLAS_STATIONS.map((station) => {
    const href = buildLocalizedPath(props.locale, MARKETING_PATHS[station.kind]);
    const stationPageKey = MARKETING_MESSAGE_KEYS.pages[station.kind];
    return (
      <li key={station.kind} className={marketingClasses.atlasStation}>
        <span className={marketingClasses.atlasNode} aria-hidden="true">
          {station.code}
        </span>
        <code className={marketingClasses.atlasPath}>{href}</code>
        <AppLink href={href} className={marketingClasses.atlasLink}>
          {tNav(station.navKey)}
        </AppLink>
        <p className={marketingClasses.atlasStationDescription}>
          {t(`${stationPageKey}.description`)}
        </p>
      </li>
    );
  });
  const routeAtlas = (
    <RouteAtlas
      label={t(MARKETING_MESSAGE_KEYS.routeAtlasLabel)}
      title={tApp('title')}
      description={tApp('description')}
      stations={atlasStations}
    />
  );
  const principles = MARKETING_MESSAGE_KEYS.principles.map((key, index) => (
    <li key={key} className={marketingClasses.principle}>
      <span className={marketingClasses.principleIndex} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <p className={marketingClasses.principleText}>{tHome(key)}</p>
    </li>
  ));
  const principlesSection = (
    <EditorialSection
      eyebrow={t(`${pageKey}.eyebrow`)}
      title={tHome(MARKETING_MESSAGE_KEYS.principlesTitle)}
      description={tHome('subtitle')}
      content={<ol className={marketingClasses.principles}>{principles}</ol>}
    />
  );
  const highlightsSection = <section className={marketingClasses.grid}>{highlights}</section>;
  let content = (
    <div className={marketingClasses.contentStack}>
      {routeAtlas}
      {highlightsSection}
    </div>
  );
  switch (props.kind) {
    case 'home': {
      break;
    }
    case 'about': {
      content = principlesSection;
      break;
    }
    case 'features': {
      content = (
        <div className={marketingClasses.contentStack}>
          {highlightsSection}
          {principlesSection}
        </div>
      );
      break;
    }
    case 'faq': {
      content = <section className={marketingClasses.faqGrid}>{questions}</section>;
      break;
    }
    case 'contact': {
      content = <ContactFormContainer />;
      break;
    }
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
        faqItems,
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
