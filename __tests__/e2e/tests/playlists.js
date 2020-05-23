const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/playlists`)
  },
  'Playlists Page': function (browser) {
    browser
      .waitForElementWithText('div', 'Login to view your playlists')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Playlists',
        'Create and share playlists of podcast clips and episodes.'
      )
  },
  after: function (browser) {
    browser.end()
  }
}
