/**
 * Simple logging utility for client-side production safety
 * Only logs in development environment to avoid exposing sensitive information in production
 */

class Logger {
  constructor() {
    // Check if we're in development mode
    this.isDevelopment = import.meta.env.DEV ||
                        import.meta.env.MODE === 'development';
  }

  log(...args) {
    if (this.isDevelopment) {
      console.log('[LOG]', ...args);
    }
  }

  error(...args) {
    if (this.isDevelopment) {
      console.error('[ERROR]', ...args);
    }
  }

  warn(...args) {
    if (this.isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  }

  info(...args) {
    if (this.isDevelopment) {
      console.info('[INFO]', ...args);
    }
  }

  debug(...args) {
    if (this.isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }
}

export default new Logger();
