const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Episodes': function (browser) {
    browser
      .click('div a[href="/episodes"]')
      .waitForElementWithText('.page-header h1', 'Episodes') // Page Header
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select')
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select .react-dropdown-select-dropdown .react-dropdown-select-item:nth-child(1)')
      .waitForElementWithText('.episode-list-item:nth-child(1) a.content-wrapper div.text-wrapper h3', '#1428 - Brian Greene') // Episode List Item Title Header




  },
  after: function (browser) {
    browser.end()
  }
}
