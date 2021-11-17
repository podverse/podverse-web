const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'My Profile': function (browser) {
    browser
      .click('div a[href="/my-profile"] div')
      .waitForElementWithText('.app-main-wrapper main div p', 'My Profile!!!')

  },
  after: function (browser) {
    browser.end()
  }
}
