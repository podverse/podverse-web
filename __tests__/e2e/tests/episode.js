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
  },
  after: function (browser) {
    browser.end()
  }
}
