const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Home Page': function (browser) {
    browser
      .waitForElementWithText('.page-header h1', 'Podcasts')
  },
  after: function (browser) {
    browser.end()
  }
}
