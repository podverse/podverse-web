const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'History': function (browser) {
    browser
      .click('div a[href="/history"]')
      .waitForElementWithText('.page-header h1', 'History')


  },
  after: function (browser) {
    browser.end()
  }
}
