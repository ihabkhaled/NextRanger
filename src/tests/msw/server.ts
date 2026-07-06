import { setupServer } from 'msw/node';

import { articlesHandlers } from './handlers/articles.handlers';
import { authHandlers } from './handlers/auth.handlers';

/**
 * MSW node server for unit/integration tests. Started globally in
 * src/tests/setup/vitest.setup.ts; tests add scenario overrides with
 * `mswServer.use(...)`.
 */
export const mswServer = setupServer(...articlesHandlers, ...authHandlers);
