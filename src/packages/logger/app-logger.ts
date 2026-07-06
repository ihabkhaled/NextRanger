import { publicEnv } from '@/packages/env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogContext = Readonly<Record<string, unknown>>;

const isVerboseEnvironment = publicEnv.appEnv !== 'production';

function write(level: LogLevel, message: string, context?: LogContext): void {
  const payload = context ? [message, context] : [message];

  switch (level) {
    case 'debug': {
      if (isVerboseEnvironment) {
        console.debug(...payload);
      }

      break;
    }
    case 'info': {
      if (isVerboseEnvironment) {
        console.info(...payload);
      }

      break;
    }
    case 'warn': {
      console.warn(...payload);

      break;
    }
    case 'error': {
      console.error(...payload);

      break;
    }
  }
}

/**
 * The single console owner. debug/info are muted in production; warn/error
 * always pass through so they reach monitoring.
 */
export const appLogger = {
  debug(message: string, context?: LogContext): void {
    write('debug', message, context);
  },
  info(message: string, context?: LogContext): void {
    write('info', message, context);
  },
  warn(message: string, context?: LogContext): void {
    write('warn', message, context);
  },
  error(message: string, context?: LogContext): void {
    write('error', message, context);
  },
};
