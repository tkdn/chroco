const chalk = require('chalk')
const success = chalk.green
const error = chalk.bold.red
const warn = chalk.yellow
const log = console.log

class Logger {
  /**
   * Creates an instance of Logger.
   * 
   * @param {!Array<string>|string} [logLevel=[]]
   * @memberof Logger
   */
  constructor (logLevel = []) {
    this.logLevel = logLevel
  }

  /**
   * @param {string} str
   * @param {!Array<*>} val
   * @memberof Logger
   */
  info (str, ...val) {
    if (this.logLevel.includes('info')) {
      log(success(this.tagged(str, ...val)))
    }
  }

  /**
   * @param {string} str
   * @param {!Array<*>} val
   * @memberof Logger
   */
  error (str, ...val) {
    if (this.logLevel.includes('error')) {
      log(error(this.tagged(str, ...val)))
    }
  }

  /**
   * @param {string} str
   * @param {!Array<*>} val
   * @memberof Logger
   */
  warn (str, ...val) {
    if (this.logLevel.includes('warn')) {
      log(warn(this.tagged(str, ...val)))
    }
  }

  /**
   * @param {string} str
   * @param {!Array<*>} val
   * @returns {string}
   * @memberof Logger
   */
  tagged (str, ...val) {
    const stringifiedVal = typeof val[0] === 'object'
      ? JSON.stringify(val[0], null, 2)
      : val[0]
    return str[0] + (stringifiedVal || '') + '\n'
  }
}

module.exports = Logger
