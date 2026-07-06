import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { mswServer } from '../msw/server';

// The server-only marker throws outside a React Server environment; unit
// tests exercise server modules directly, so neutralize it here.
vi.mock('server-only', () => ({}));

// jsdom does not implement matchMedia; the browser facade expects it. The
// untyped read mirrors src/packages/browser — lib.dom types cannot express
// "absent in this runtime".
const globalRecord = globalThis as Record<string, unknown>;

if (typeof globalRecord['matchMedia'] !== 'function') {
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});
