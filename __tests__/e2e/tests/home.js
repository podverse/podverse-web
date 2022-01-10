const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Home Page': function (browser) {
    browser
      .waitForElementWithText('.page-header h1', 'Podcasts')
      .waitForElementWithText('.podcast-list-item:nth-child(1) div div:nth-child(2)', 'The Joe Rogan Experience')
      .click('.dropdown-sort-wrapper div div')
      .waitForElementWithText('.react-dropdown-select-item:nth-child(5)', 'Top - All Time')
      .click('.react-dropdown-select-item:nth-child(5)')
      .waitForElementWithText('.podcast-list-item:nth-child(1) div div:nth-child(2)', 'Song Exploder')
  },
  after: function (browser) {
    browser.end()
  }
}
