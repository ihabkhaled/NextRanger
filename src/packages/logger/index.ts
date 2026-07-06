/**
 * Owner wrapper for console/logging output. `no-console` is enforced
 * everywhere else; app code logs through `appLogger`.
 */

export { appLogger, type LogContext, type LogLevel } from './app-logger';
