# Chroco

> `Chroco` operates \`[puppeteer](https://github.com/GoogleChrome/puppeteer/)\` with commandable, pluggable settings.  
> `Chroco` means _"black person"/"black clothes"_  in Japanese. [Wikipedia: 黒子](https://en.wikipedia.org/wiki/Kuroko)  
> **[Work in Progress] It's a experimental package. Help us.**

## Installation and Usage

### Installation

```bash
$ yarn install chroco
# or
$ npm i chroco
```

### Programmable Usage

```js
const { excecuter } = require('chroco')
const commands = {
  // your options, settings and scenario
}
executor(commands)
```

### CLI Usage

```bash
$ chroco # default, detect `.chrocorc`
# or
$ chroco --config ./path/to/.chrocorc
# or (if you will use yaml file )
$ chroco -c .chroco.yml
```

refs: [.chrocorc](./sample/.chrocorc) or [.chrocorc.yml](./sample/.chrocorc.yml)  
Default file path is \`.chrocorc\`.

### Chroco Configure

Configure should be `Object`.

|parms|detail|type|val|required|
|-----|------|----|---|--------|
|`options`|refs: [puppeteer launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)|`Object`| - |none|
|`options.logLevel`|Chroco original options|`Array.<string>|string`|`['info', 'warn', 'error']`|none|
|emulateOptions|refs: [puppeteer emulate options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulateoptions)|`Object`| - |none|
|receivers|Your Customized Receiver, [: sample](./sample/search.js)|`Array.<Function>`| - | none |
|scenarios|Your commandable, iterable `Array`|`Array.<Object.<Function>.<Array|Object|string>`| required |


#### Scenarios <Array>

- `scenarios[n].<Function>` is puppeteer's `class: Page` method.
- `scenarios[n].<Function>.<Array|Object|string>` is `params` for above method.

```js
{
  scenarios: [
    goto: [
      'https://www.google.com',
      { waitUntil: 'load' }
    ],
    screenshot: {
      path: 'temp/screenshot.png',
      fullPage: true
    }
  ]
}
```

this means...

```js
// blah blah
// const chrome = await puppeteer.launc()
// const browser = await chrome.newPage()
// blah blah
await page.goto(
  'https://www.google.com',
  { waitUntil: 'load' }
)
await page.screenshot(
  path: 'temp/screenshot.png',
  fullPage: true
)
```

Each Scenario's key is mapped to `class: Page` method with `puppeteer`.
