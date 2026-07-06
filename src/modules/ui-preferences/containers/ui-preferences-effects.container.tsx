'use client';
// client-boundary-reason: runs browser-only side effects (storage hydration, DOM attribute sync) for UI preferences.

import { useUiPreferencesEffects } from '../hooks/use-ui-preferences-effects.hook';

/** Renders nothing; mounts the preference side effects once in the providers. */
export function UiPreferencesEffects(): null {
  useUiPreferencesEffects();

  return null;
}
