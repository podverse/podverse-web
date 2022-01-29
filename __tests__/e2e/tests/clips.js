const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Clips: function (browser) {
    browser
      .click('div a[href="/clips"]')
      .waitForElementWithText('.page-header h1', 'Clips') // Page Header

      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select') //Filter type
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select-item:nth-child(1)') //Filter type: Subscribed > All
      .waitForElementWithText(
        '.clip-list-item:nth-child(1) a.content-wrapper',
        'Lacus sed turpis tincidunt id aliquet risus feugiat in ante.'
      )
    // Clip List Item Title Header (1st)
  },
  after: function (browser) {
    browser.end()
  }
}
