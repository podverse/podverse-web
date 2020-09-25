const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser
      ._resetDatabase()
      .url(`${WEB_ORIGIN}/`)
  },
  'Reset Database': function (browser) {
    browser
      .waitForElementWithText('h3', 'Clips', 300000)
  },
  after: function (browser) {
    browser.end()
  }
}
