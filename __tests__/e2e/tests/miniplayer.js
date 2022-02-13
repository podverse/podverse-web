const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/miniplayer/episode/SMYBlc783`)
  },
  Miniplayer: function (browser) {
    browser
      .waitForElementWithText('div.episode-title', '#1452 - Greg Fitzsimmons') // Episode Title
      .waitForElementWithText('div.podcast-title', 'The Joe Rogan Experience') // Podcast Title
      .waitForElementWithText('div.player-bar-label', '0:00') // Player Bar Time

      .url(`${WEB_ORIGIN}/miniplayer/clip/-zqM13-H`)

      .waitForElementWithText('div.episode-title', 'Magna fringilla urna porttitor rhoncus dolor.') // Episode Title
      .waitForElementWithText('div.podcast-title', 'Very Bad Wizards') // Podcast Title
      .waitForElementWithText('div.player-bar-label', '0:00') // Player Bar Time
  },
  after: function (browser) {
    browser.end()
  }
}
