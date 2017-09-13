const { executor } = require('../')

class MyReceiver {
  constructor (page) {
    this.page = page
  }
  async search () {
    const { page } = this
    await page.focus('input[name=q]')
    await page.type('chroco')
    await page.press('Enter')
    await page.waitForNavigation()
  }
}

const commands = {
  options: {
    headless: false,
    logLevel: ['info', 'error']
  },
  emulateOptions: {
    device: 'iPhone 6'
  },
  receivers: { MyReceiver },
  scenarios: [
    {
      goto: [
        'https://www.google.com',
        { waitUntil: 'load' }
      ]
    },
    {
      MyReceiver: 'search'
    },
    {
      screenshot: {
        path: 'temp/screenshot.png',
        fullPage: true
      }
    }
  ]
}

executor(commands)
