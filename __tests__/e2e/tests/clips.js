const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Clips': function (browser) {
    browser
      .click('div a[href="/clips"]')
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select')
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select .react-dropdown-select-dropdown .react-dropdown-select-item:nth-child(1)')
      .waitForElementWithText('.page-header h1', 'Clips') // Page Header
      .waitForElementWithText('.clip-list-item:nth-child(1) a.content-wrapper', 'Lacus sed turpis tincidunt id aliquet risus feugiat in ante.')
      // Clip List Item Title Header (1st)


  },
  after: function (browser) {
    browser.end()
  }
}
