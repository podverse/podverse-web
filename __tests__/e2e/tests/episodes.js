const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Episodes: function (browser) {
    browser
      .click('div a[href="/episodes"]')
      .waitForElementWithText('.page-header h1', 'Episodes') // Page Header
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select') // Filter type
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select-item:nth-child(1)') //Filter type: Subscribed > All
      .waitForElementWithText('.episode-list-item:nth-child(1) h3', 'Caribou - Home') // Episode List Item Title Header

      .sendKeys('.search-bar-filter .text-input input', 'Vanessa') 
      .pause(5000)
      .waitForElementWithText('.main-wrapper .content-wrapper .text-wrapper h3', '82: Vanessa Van Edwards | Pumping up the Volume of Nonverbal Communication')
  },
  after: function (browser) {
    browser.end()
  }
}
