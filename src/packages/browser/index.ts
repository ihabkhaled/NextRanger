/**
 * Owner wrapper for browser globals (window, document, matchMedia,
 * navigator.clipboard). Direct access elsewhere is an ESLint violation.
 */

export {
  copyTextToClipboard,
  getSafeDocument,
  getSafeWindow,
  getBrowserLocationSuffix,
  openEmailDraft,
  isBrowser,
  matchesMediaQuery,
  prefersReducedMotion,
} from './browser-environment';
export { getRootAttribute, setRootAttribute } from './dom-attributes';
export { registerAppServiceWorker } from './service-worker';
