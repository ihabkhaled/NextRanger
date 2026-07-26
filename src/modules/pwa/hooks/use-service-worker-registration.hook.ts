import { useEffect } from 'react';

import { registerAppServiceWorker } from '@/packages/browser';

export function useServiceWorkerRegistration(): void {
  useEffect(() => {
    void registerAppServiceWorker('/sw.js');
  }, []);
}
