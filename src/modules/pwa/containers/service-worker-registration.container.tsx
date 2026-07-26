'use client';
// client-boundary-reason: registers the PWA service worker after browser hydration.

import type { ReactElement } from 'react';

import { useServiceWorkerRegistration } from '../hooks/use-service-worker-registration.hook';

export function ServiceWorkerRegistrationContainer(): ReactElement | null {
  useServiceWorkerRegistration();
  return null;
}
