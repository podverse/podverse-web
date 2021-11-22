const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Clips': function (browser) {
    browser
      .click('div a[href="/clips"]')
      .waitForElementWithText('.page-header h1', 'Clips')
      .waitForElementWithText('.text-wrapper h3', 'Lacus sed turpis tincidunt id aliquet risus feugiat in ante.')


  },
  after: function (browser) {
    browser.end()
  }
}
