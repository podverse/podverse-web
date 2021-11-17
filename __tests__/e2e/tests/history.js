const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'History': function (browser) {
    browser
      .click('div a[href="/history"] div')
      .waitForElementWithText('.app-main-wrapper main div p', 'history!!!')

  },
  after: function (browser) {
    browser.end()
  }
}
