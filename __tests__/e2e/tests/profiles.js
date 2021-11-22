const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Profiles': function (browser) {
    browser
      .click('div a[href="/profiles"]')
      .waitForElementWithText('.page-header h1', 'Profiles')

  },
  after: function (browser) {
    browser.end()
  }
}
