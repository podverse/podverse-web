const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Search': function (browser) {
    browser
      .click('div a[href="/search"]')
      .waitForElementWithText('.page-header-tabs h1', 'Search')
      .sendKeys('.search-page-input .text-input-inner-wrapper input', 'Joe')
      .waitForElementWithText('.page-scrollable-content .podcast-list-item div.title', 'The Joe Rogan Experience')




  },
  after: function (browser) {
    browser.end()
  }
}
