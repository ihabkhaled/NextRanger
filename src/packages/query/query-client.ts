/**
 * Vendor client/provider re-exports for composition outside the default
 * AppQueryProvider (primarily the test provider stack).
 */

export {
  QueryClient as AppQueryClient,
  QueryClientProvider as AppQueryClientProvider,
} from '@tanstack/react-query';
