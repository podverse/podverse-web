const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser._resetDatabaseExtension().url(`${WEB_ORIGIN}/`)
  },
  'Reset Database': function (browser) {
    browser.pause(60000).url(`${WEB_ORIGIN}/`)
  },
  after: function (browser) {
    browser.end()
  }
}
