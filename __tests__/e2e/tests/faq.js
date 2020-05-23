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
        'Podverse - FAQ',
        'Podverse - Frequently asked questions'
      )
  },
  after: function (browser) {
    browser.end()
  }
}
