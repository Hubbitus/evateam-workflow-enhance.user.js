/**
 * Logging utility for HuEvaFlowEnhancer
 * Always logs to console for debugging in production
 */
class LoggerClass {
  #prefix = 'HuEvaFlowEnhancer:';

  /**
   * Logs a message to console
   * @param {...any} args - Arguments to output to console
   */
  log(...args) {
    console.log(this.#prefix, ...args);
  }

  /**
   * Logs a warning to console
   * @param {...any} args - Arguments to output to console
   */
  warn(...args) {
    console.warn(this.#prefix, ...args);
  }

  /**
   * Logs an error to console
   * @param {...any} args - Arguments to output to console
   */
  error(...args) {
    console.error(this.#prefix, ...args);
  }
}

export const Logger = new LoggerClass();
