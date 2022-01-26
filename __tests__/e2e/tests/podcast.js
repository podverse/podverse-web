const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Podcast': function (browser) {
    browser
      
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select')
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select .react-dropdown-select-dropdown .react-dropdown-select-item:nth-child(1)')
      .click('.podcast-list-item:nth-child(5)')
      .waitForElementWithText('.podcast-page-header .podcast-title a', 'The Joe Rogan Experience')
      .waitForElementWithText('.page-scrollable-content .page-header h2', 'Episodes')
      .waitForElementWithText('ul.list li.episode-list-item div.text-wrapper h3', '#1452 - Greg Fitzsimmons')
      .click('.button-circle.small.backwards')
      .waitForElementWithText('.page-header h1', 'Podcasts')
      .click('.button-circle.small.forwards')
      .waitForElementWithText('.podcast-page-header .podcast-title a', 'The Joe Rogan Experience')
      .click('div.dropdown-primary-wrapper div')
      .click('div.dropdown-primary-wrapper span.react-dropdown-select-item:nth-child(2)')
      .waitForElementWithText('.page-scrollable-content .page-header h2', 'Clips')
      .waitForElementWithText('ul.list li.clip-list-item div.text-wrapper h3', 'Facilisis sed odio morbi quis commodo odio aenean sed adipiscing.')









  },
  after: function (browser) {
    browser.end()
  }
}
