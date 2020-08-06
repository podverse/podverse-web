const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/about`)
  },
  'About Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'About')
      .testSharedMetaTags()
      .testPageMetaTags(
        'About',
        'Information about the Podverse open source podcast app.'
      )
  },
  after: function (browser) {
    browser.end()
  }
}
