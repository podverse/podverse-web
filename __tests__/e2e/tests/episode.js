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
      .waitForElementWithText('.episode-list-item:nth-child(1) h3', '#1428 - Brian Greene') // Episode List Item Title Header (1st)
      .click('.episode-list-item:nth-child(1)') // Episode List Item
      .waitForElementWithText('a.podcast-title', 'The Joe Rogan Experience') // Episode Page Header
      .waitForElement('a[href="http://joeroganexp.joerogan.libsynpro.com/rss"]')
      .waitForElement('.header-share-button')
      .click('.header-share-button')
      .waitForElement('div.share-modal')
      .waitForElement(
        '.ReactModal__Content .text-input:nth-child(3) input[value="https://stage.podverse.fm/episode/z3kazYivU"]'
      ) // Episode
      .waitForElement(
        '.ReactModal__Content .text-input:nth-child(4) input[value="https://stage.podverse.fm/podcast/yKyjZDxsB"]'
      ) // Podcast
      .click('button.button-close')
  },
  after: function (browser) {
    browser.end()
  }
}
