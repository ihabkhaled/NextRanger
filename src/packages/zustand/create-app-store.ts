/**
 * App-owned store factory. A thin, deliberate re-export: keeping the vendor
 * import here means swapping or instrumenting the state library later touches
 * exactly one file.
 */

export { create as createAppStore } from 'zustand';
