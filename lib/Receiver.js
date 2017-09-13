const { writeFile } = require('../internal/Util')

class Receiver {
  constructor (page) {
    this.page = page
  }

  /**
   * @async
   * @param {!Object} page
   * @param {number} delay
   * @returns {!Promise}
   * @memberof Receiver
   */
  async sleep (delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, delay)
    })
  }

  /**
   * @async
   * @param {!Object} page
   * @param {!Object} params
   * @memberof Receiver
   */
  async screenshot (params) {
    await this.page.screenshot(Object.assign(params, { path: writeFile(params.path) }))
  }
}

module.exports = Receiver
