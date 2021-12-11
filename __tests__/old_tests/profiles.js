const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Profiles Page': function (browser) {
    browser
      .url(`${WEB_ORIGIN}/profiles`)
      .waitForElementWithText('div', 'Login to view your profiles')
      .testSharedMetaTags()
      .testPageMetaTags(
          `Profiles`,
          `My subscribed profiles on Podverse`
      )
  },
  after: function (browser) {
    browser.end()
  }
}
