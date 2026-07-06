'use client';
// client-boundary-reason: the toast viewport renders into the browser DOM and reacts to runtime events.

import type { ReactElement } from 'react';
import { Toaster } from 'sonner';

/** Toast viewport, mounted once in the root layout. */
export function AppToaster(): ReactElement {
  return <Toaster position="bottom-right" richColors closeButton />;
}
