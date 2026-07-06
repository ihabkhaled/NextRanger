/**
 * Owner wrapper for environment access. Client code imports `publicEnv` from
 * here; server code imports `getServerEnv` from `@/packages/env/server`.
 * Raw `process.env` access anywhere else is an ESLint violation.
 */

export { publicEnv, type PublicEnv } from './public-env';
