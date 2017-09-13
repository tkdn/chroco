const fs = require('fs')
const mime = require('mime-types')
const yaml = require('js-yaml')
const pkg = require('./package.json')
const { executor } = require('./')
const argv = require('yargs')
  .usage('Usage: $0 [--config, -c] `path to commands file`')
  .config('config', path => {
    let commands
    const type = mime.lookup(path)
    if (type === 'text/yaml') {
      commands = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    } else {
      commands = JSON.parse(fs.readFileSync(path, 'utf-8'))
    }
    return { commands }
  })
  .alias('c', 'config')
  .default('config', '.chrocorc')
  .version(pkg.version)
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .epilog('yay! Chroco operates `puppeteer`!')
  .argv

executor(argv.commands)
