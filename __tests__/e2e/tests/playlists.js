const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Playlists': function (browser) {
    browser
      .click('div a[href="/playlists"]')
      .waitForElementWithText('.page-header h1', 'Playlist')

  },
  after: function (browser) {
    browser.end()
  }
}
