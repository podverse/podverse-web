const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/membership`)
  },
  'Premium Page': function (browser) {
    browser
      .testSharedMetaTags()
      .testPageMetaTags(
          'Podverse - Membership',
          'Free and premium membership options.'
      )
      .waitForElementWithText('h3', 'Premium')
  },
  after: function (browser) {
    browser.end()
  }
}
