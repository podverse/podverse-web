const WEB_ORIGIN = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/settings`)
  },
  'Settings Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'Settings')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Podverse - Settings',
        'Customize your account settings on Podverse.'
      )
  },
  after: function (browser) {
    browser.end()
  }
}
