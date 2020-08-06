const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/faq`)
  },
  'FAQ Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'FAQ')
      .testSharedMetaTags()
      .testPageMetaTags(
        'FAQ',
        'Frequently asked questions'
      )
  },
  after: function (browser) {
    browser.end()
  }
}
