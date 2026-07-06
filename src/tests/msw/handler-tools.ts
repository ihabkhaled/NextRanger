/**
 * Re-exported MSW primitives for tests that need ad-hoc scenario handlers.
 * src/tests/msw is the owner of the msw vendor — tests import from here.
 */

export { http, HttpResponse } from 'msw';
