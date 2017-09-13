const Chrome = require('./lib/Chrome')
const Receiver = require('./lib/Receiver')
const Logger = require('./internal/Logger')

/**
 * @param {!Object} commands - commands object
 */
async function executor (commands) {
  const {
    options, emulateOptions,
    receivers, scenarios
  } = commands

  // detect logLevel
  const logLevel = options && ('logLevel' in options)
    ? options.logLevel
    : []
  const logger = new Logger(logLevel)

  // instance launch
  const chrome = new Chrome(options)
  await chrome.launch()

  // open new page
  const page = await chrome.initPage()
  await chrome.emulate(emulateOptions)

  // internal receiver
  const receiver = new Receiver(page)

  // extended receivers
  const exReceivers = {}
  if (receivers) {
    for (const key in receivers) {
      exReceivers[key] = new receivers[key](page)
    }
  }

  // iterate scenarios
  for (const scenario of scenarios) {
    const method = Object.keys(scenario)[0]
    const params = scenario[method]
    const isExtendReceiver = Object.keys(exReceivers).includes(method)

    // actual command mapping to `exec` that should be executed
    const exec = isExtendReceiver
      ? () => exReceivers[method][params]()
      : method in receiver
        ? (_params) => receiver[method](_params)
        : (_params) => page[method](_params)

    try {
      if (isExtendReceiver) {
        await exec()
      } else if (Array.isArray(params)) {
        await exec(...params)
      } else {
        await exec(params)
      }
      // logger
      if (isExtendReceiver) {
        logger.info`receiver: ${method}`
        logger.info`receiver: ${params}`
      } else {
        logger.info`method: ${method}`
        logger.info`params: ${params}`
      }
    } catch (e) {
      logger.error`Can not execute: ${method}`
      chrome.close()
      return
    }
  }

  chrome.close()
}

module.exports = {
  executor,
  Logger
}
