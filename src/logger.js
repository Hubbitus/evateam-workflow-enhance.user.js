/**
 * Logging utility with ability to disable in production
 */
class LoggerClass {
  // In dev mode import.meta.env.DEV = true, in prod = false
  #debug = import.meta.env.DEV;

  /**
   * Logs a message only if DEBUG mode is enabled
   * @param {...any} args - Arguments to output to console
   */
  log(...args) {
    if (this.#debug) {
      console.log('[DEBUG]', ...args);
    }
  }

  /**
   * Logs a warning only if DEBUG mode is enabled
   * @param {...any} args - Arguments to output to console
   */
  warn(...args) {
    if (this.#debug) {
      console.warn('[DEBUG]', ...args);
    }
  }

  /**
   * Logs an error always (regardless of DEBUG)
   * @param {...any} args - Arguments to output to console
   */
  error(...args) {
    console.error('[ERROR]', ...args);
  }
}

export const Logger = new LoggerClass();
