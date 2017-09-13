const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const Logger = require('../internal/Logger')

class Chrome {
  /**
   * Creates an instance of Chorme.
   *
   * @param {!Object} [options={}]
   * @property {boolean} options.ignoreHTTPSErrors
   * @property {boolean} options.headless
   * @property {string} options.executablePath
   * @property {number} options.slowMo
   * @property {number} options.arg
   * @property {number} options.timeout
   * @property {boolean} options.dumpio
   * @property {!Array<string>} options.logLevel
   * @memberof Chorme
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
   */
  constructor (options = {}) {
    const initial = {
      ignoreHTTPSErrors: false,
      headless: true,
      handleSIGNT: true,
      timeout: 30000,
      dumpio: false,
      logLevel: []
    }
    this.instanceChrome = null
    this.page = null
    this.options = Object.assign(initial, options)
    this.logger = new Logger(this.options.logLevel)
  }

  async launch () {
    this.instanceChrome = await puppeteer.launch(this.options)
    this.logger.info`Chrome instance is launched.`
    this.logger.info`Options: ${this.options}`
  }

  async initPage () {
    this.page = await this.instanceChrome.newPage()
    this._onHandleErrors()
    this.logger.info`New page is ready.`
    return this.page
  }

  close () {
    try {
      this.instanceChrome.close()
      this.logger.info`Chrome instance is closed.`
    } catch (e) {
      this.logger.error`Chorme instance is not launched or not available to close.`
      this.logger.error`Error: ${e}`
      process.exit(1)
    }
  }

  /**
   * Page#Emulate
   *
   * @async
   * @param {!Object} [settings = {}]
   * @property {string} settings.device
   * @property {string} settings.userAgent
   * @property {!Object} settings.viewport
   * @property {number} settings.viewport.width
   * @property {number} settings.viewport.height
   * @property {number} settings.viewport.deviceScaleFactor
   * @property {boolean} settings.viewport.isMobile
   * @property {boolean} settings.viewport.hasTouch
   * @property {boolean} settings.viewport.isLandscape
   * @memberof Chrome
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulateoptions
   */
  async emulate (settings = {}) {
    let emulation
    const initial = {
      viewport: {
        width: 800,
        height: 800,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
      },
      userAgent: ''
    }
    // if params provide `device` emulation
    if ('device' in settings) {
      emulation = devices[settings.device]
      await this.page.emulate(emulation)
      this.logger.info`Emulation: ${emulation}`
      // if params `settings` is not empty object
    } else if (Object.keys(settings).length > 0) {
      const viewport = Object.assign(initial.viewport, settings.viewport)
      const userAgent = Object.assign(initial.userAgent, settings.userAgent)
      emulation = { viewport, userAgent }
      if (!emulation.userAgent) delete emulation.userAgent
      await this.page.emulate(emulation)
      this.logger.info`Emulation: ${emulation}`
    }
  }

  _onHandleErrors () {
    const { page, instanceChrome } = this
    // catch page's `error` event
    page.on('error', err => {
      this.logger.error`Catch error event ${err}`
      instanceChrome.close()
      process.exit(1)
    })
    // catch page's `pageerror`  event
    page.on('pageerror', exception => {
      this.logger.error`Catch pageerror event ${exception}`
      instanceChrome.close()
      process.exit(1)
    })
    // catch page `dialog` event / ignore dialog
    page.on('dialog', dialog => {
      dialog.dismiss()
    })
  }
}

module.exports = Chrome
