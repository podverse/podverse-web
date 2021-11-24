const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Playlists': function (browser) {
    browser
      .click('div a[href="/playlists"]')
      .waitForElementWithText('.page-header h1', 'Playlists')
      .waitForElementWithText('.message-with-action div', 'Log in to view your playlists')

      .loginUsingModal('premium@stage.podverse.fm')

      .waitForElementWithText('.page-scrollable-content .playlist-list-item:nth-child(1) div.title', 'Premium - Test Playlist 1')
      .waitForElementWithText('.page-scrollable-content .playlist-list-item:nth-child(3) div.title', 'Premium - Test Playlist 2')
      .waitForElementWithText('.page-scrollable-content .playlist-list-item:nth-child(5) div.title', 'Free Trial - Test Playlist 1')
      .waitForElementWithText('.page-scrollable-content .playlist-list-item:nth-child(7) div.title', 'Free Trial - Test Playlist 2')



  },
  after: function (browser) {
    browser.end()
  }
}
