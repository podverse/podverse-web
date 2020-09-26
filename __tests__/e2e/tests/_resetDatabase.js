const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser
      ._resetDatabase()
      .pause(120000)
      .url(`${WEB_ORIGIN}/`)
  },
  'Reset Database': function (browser) {
    browser
      .waitForElementWithText('h3', 'Clips')
  },
  after: function (browser) {
    browser.end()
  }
}
