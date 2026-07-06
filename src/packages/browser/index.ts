/**
 * Owner wrapper for browser globals (window, document, matchMedia,
 * navigator.clipboard). Direct access elsewhere is an ESLint violation.
 */

export {
  copyTextToClipboard,
  getSafeDocument,
  getSafeWindow,
  isBrowser,
  matchesMediaQuery,
  prefersReducedMotion,
} from './browser-environment';
export { getRootAttribute, setRootAttribute } from './dom-attributes';
