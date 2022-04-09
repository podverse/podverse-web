const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Episode: function (browser) {
    browser
      .click('div a[href="/episodes"]')
      .waitForElementWithText('.page-header h1', 'Episodes') // Page Header

      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select') //Filter type
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select-item:nth-child(1)') //Filter type: Subscribed > All
      .waitForElementWithText('.episode-list-item:nth-child(1) h3', 'Caribou - Home') // Episode List Item Title Header (1st)
      .click('.episode-list-item:nth-child(1)') // Episode List Item
      .waitForElementWithText('a.podcast-title', 'Song Exploder') // Episode Page Header
      .waitForElement('a[href="http://feed.songexploder.net/SongExploder"]')
      .waitForElement('.header-share-button')
      .click('.header-share-button')
      .waitForElement('div.share-modal')
      .waitForElement(
        '.ReactModal__Content .text-input:nth-child(3) input[value="https://stage.podverse.fm/episode/18z7yrPvI"]'
      ) // Episode
      .waitForElement(
        '.ReactModal__Content .text-input:nth-child(4) input[value="https://stage.podverse.fm/podcast/xSTqnMUb57K"]'
      ) // Podcast
      .click('button.button-close')
  },
  after: function (browser) {
    browser.end()
  }
}
