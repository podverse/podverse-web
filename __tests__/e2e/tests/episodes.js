const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Episodes: function (browser) {
    browser
      .click('div a[href="/episodes"]')
      .waitForElementWithText('.page-header h1', 'Episodes')
      .waitForElementWithText('.text-wrapper h3', '#1428 - Brian Greene')
  },
  after: function (browser) {
    browser.end()
  }
}
