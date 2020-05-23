const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Profiles Tests': function (browser) {
    browser
      .url(`${WEB_ORIGIN}/profiles`)
      .waitForElementWithText('p', 'You are not subscribed to any user profiles.')
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
