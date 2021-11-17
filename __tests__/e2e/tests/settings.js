const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Settings': function (browser) {
    browser
      .click('.react-dropdown-select')
      .click('.react-dropdown-select-item:nth-child(2)')
      .waitForElementWithText('.app-main-wrapper main div p', 'settings!!!')
      


  },
  after: function (browser) {
    browser.end()
  }
}
