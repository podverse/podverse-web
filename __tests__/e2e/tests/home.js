const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Home Page': function (browser) {
    browser
      .waitForElementWithText('.page-header h1', 'Podcasts')  // Page Header
      .waitForElementWithText('.podcast-list-item div div.title', 'The Joe Rogan Experience') // Podcast List Item Title (1st)
      .click('.dropdown-sort-wrapper div div')  // TODO: Needs better target
      .waitForElementWithText('.react-dropdown-select-item:nth-child(5)', 'Top - All Time') // Filter - All Time
      .click('.react-dropdown-select-item:nth-child(5)') // Filter - All Time
      .waitForElementWithText('.podcast-list-item div div.title', 'Song Exploder') // Podcast List Item Title (1st)


  },
  after: function (browser) {
    browser.end()
  }
}
