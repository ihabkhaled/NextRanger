'use client';
// client-boundary-reason: the global error boundary replaces the crashed root layout and needs the reset callback.

import type { ReactElement } from 'react';

import { FALLBACK_ERROR_COPY } from '@/shared/constants/fallback-copy.constants';

import { globalErrorClasses } from './global-error.variants';

/**
 * Renders when the root layout itself crashes. The i18n provider is gone at
 * this point, so this screen uses the documented English fallback copy.
 */
export default function GlobalError(props: Readonly<{ reset: () => void }>): ReactElement {
  return (
    <html lang="en" dir="ltr">
      <body className={globalErrorClasses.body}>
        <main className={globalErrorClasses.main}>
          <h1 className={globalErrorClasses.title}>{FALLBACK_ERROR_COPY.title}</h1>
          <p className={globalErrorClasses.description}>{FALLBACK_ERROR_COPY.description}</p>
          <button type="button" className={globalErrorClasses.button} onClick={props.reset}>
            {FALLBACK_ERROR_COPY.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
