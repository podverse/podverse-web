const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Profiles': function (browser) {
    browser
      .click('div a[href="/profiles"] div')
      .waitForElementWithText('.app-main-wrapper main div p', 'profiles!!!')

  },
  after: function (browser) {
    browser.end()
  }
}
