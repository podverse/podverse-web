const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/terms`)
  },
  'Terms Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'Terms of Service')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Podverse - Terms of Service',
        'Podverse terms of service agreement.'
      )
  },
  after: function (browser) {
    browser.end()
  }
}
