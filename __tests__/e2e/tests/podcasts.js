const WEB_ORIGIN = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/podcasts`)
  },
  'Podcasts Tests': function (browser) {
    browser
      .waitForElementWithText('div', 'The Joe Rogan Experience')
      .testSharedMetaTags()
      .testPageMetaTags(
          `Podcasts`,
          `Find and subscribe to podcasts.`
      )
  },
  after: function (browser) {
    browser.end()
  }
}
