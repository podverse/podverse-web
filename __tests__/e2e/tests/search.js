const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Search': function (browser) {
    browser
      .click('div a[href="/search"]')
      .waitForElementWithText('.page-header-tabs h1', 'Search')


  },
  after: function (browser) {
    browser.end()
  }
}
