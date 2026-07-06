/**
 * Owner wrapper for `zustand`. Stores are created only through
 * `createAppStore` inside module store/ layers, and hold true client global
 * state exclusively — never server data (that belongs to the query cache).
 */

export { createAppStore } from './create-app-store';
export { useAppStoreShallow } from './store-hooks';
