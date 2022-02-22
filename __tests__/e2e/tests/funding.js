const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Funding: function (browser) {
    browser

      .url(`https://stage.podverse.fm/podcast/ys-xJk8awD`) // Podcasting 2.0
      .waitForElement('button.header-funding-button') // Funding Present
      .click('button.header-funding-button')
      .waitForElement('a[href="https://paypal.me/podcastindex"]')
      .click('button.button-close')

      .url(`https://stage.podverse.fm/podcast/Yqft_RG8j`) // Very Bad Wizards
      .waitForElementNotPresent('button.header-funding-button') // Funding NOT Present
  },
  after: function (browser) {
    browser.end()
  }
}
