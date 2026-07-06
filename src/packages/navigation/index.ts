/**
 * Owner wrapper for `next/navigation`. Client code navigates through
 * `useAppNavigation`; server code uses `appRedirect` / `appNotFound`.
 */

export type { AppNavigation } from './navigation-types';
export { appNotFound, appRedirect } from './server-navigation';
export { useAppNavigation } from './use-app-navigation.hook';
