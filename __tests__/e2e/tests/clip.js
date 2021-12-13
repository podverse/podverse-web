const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Clips': function (browser) {
    browser
      .click('div a[href="/clips"]')
      .waitForElementWithText('.page-header h1', 'Clips')   // Page Header
      .click('.clip-list-item:nth-child(1)', 'Lacus sed turpis tincidunt id aliquet risus feugiat in ante.')  // Clip List Item Title Header (1st)
      .waitForElementWithText('.clip-page-header a.podcast-title', 'Very Bad Wizards') // Clip Page Header


  },
  after: function (browser) {
    browser.end()
  }
}
