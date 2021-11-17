const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Clips': function (browser) {
    browser
      .click('div a[href="/clips"] div')
      .waitForElementWithText('.app-main-wrapper main div p', 'clips!!!')

  },
  after: function (browser) {
    browser.end()
  }
}
