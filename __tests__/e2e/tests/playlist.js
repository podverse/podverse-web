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
      
      .click('.page-scrollable-content .playlist-list-item:nth-child(1) a')
      .waitForElementWithText('.playlist-page-header h1', 'Premium - Test Playlist 1')
      .waitForElementWithText('ul.list div.main-wrapper:nth-child(1) a.content-wrapper', 'Quis varius quam quisque id.')



      .logOutUsingModal()



  },
  after: function (browser) {
    browser.end()
  }
}
