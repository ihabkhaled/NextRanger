import { getSafeWindow } from './browser-environment';

export async function registerAppServiceWorker(
  path: string,
): Promise<ServiceWorkerRegistration | null> {
  const safeWindow = getSafeWindow();
  if (!safeWindow || !('serviceWorker' in safeWindow.navigator)) return null;
  return safeWindow.navigator.serviceWorker.register(path);
}
