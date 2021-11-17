const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Playlists': function (browser) {
    browser
      .click('div a[href="/playlists"] div')
      .waitForElementWithText('.app-main-wrapper main div p', 'Playlists!!!')

  },
  after: function (browser) {
    browser.end()
  }
}
