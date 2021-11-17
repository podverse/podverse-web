const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Queue': function (browser) {
    browser
      .click('div a[href="/queue"] div')
      .waitForElementWithText('.app-main-wrapper main div p', 'Queue!!!')

  },
  after: function (browser) {
    browser.end()
  }
}
