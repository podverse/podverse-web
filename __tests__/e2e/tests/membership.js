const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Membership: function (browser) {
    browser
      .click('.navbar-secondary__dropdown .react-dropdown-select') // Primary? Dropdown
      .click('.navbar-secondary__dropdown .react-dropdown-select-item')
      .waitForElementWithText('.app-main-wrapper main div p', 'Enjoy Podverse Premium for three months at no cost')
  },
  after: function (browser) {
    browser.end()
  }
}
