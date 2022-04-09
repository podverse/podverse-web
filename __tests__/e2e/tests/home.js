const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Home Page': function (browser) {
    browser
      .waitForElementWithText('.page-header h1', 'Podcasts') // Page Header
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select')
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select-item:nth-child(1)')
      .waitForElementWithText('.podcast-list-item:nth-child(3) div div.title', 'Very Bad Wizards') // Podcast List Item Title (1st)
      .click('.dropdown-sort-wrapper div div') // TODO: Needs better target
      .waitForElementWithText('.react-dropdown-select-item:nth-child(5)', 'Top - All Time') // Filter - All Time
      .click('.react-dropdown-select-item:nth-child(3)') // Filter - All Time
      .waitForElementWithText('.podcast-list-item:nth-child(3) div div.title', 'Very Bad Wizards') // Podcast List Item Title (1st)

      .sendKeys('.search-bar-filter .text-input input', 'Dan')
      .pause(5000)
      .waitForElementWithText(`.podcast-list-item .text-wrapper .title`, `Dan Carlin's Hardcore History`)
  },
  after: function (browser) {
    browser.end()
  }
}
