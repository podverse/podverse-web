const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Queue': function (browser) {
    browser
      .click('div a[href="/queue"]')
      .waitForElementWithText('.page-header h1', 'Queue')

  },
  after: function (browser) {
    browser.end()
  }
}
