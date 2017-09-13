const path = require('path')
const fs = require('fs')
const Logger = require('./Logger')

/**
 * @param {string} file - file path
 */
function mkdirIfNotExist (file) {
  const dir = path.dirname(path.resolve(file))
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir)
    } catch (e) {
      Logger.error`can not make dir: ${e}`
      process.exit(1)
    }
  }
}

/**
 * @param {string} file - file path
 * @returns {string} - absolute file path
 */
function writeFile (file) {
  mkdirIfNotExist(file)
  return path.resolve(file)
}

module.exports = {
  writeFile
}
