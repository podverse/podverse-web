const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Login': function (browser) {
    browser
      .click('.react-dropdown-select')
      .click('.react-dropdown-select-item:nth-child(3)')
      .waitForElementWithText('.ReactModal__Content h2', 'Login')
      


  },
  after: function (browser) {
    browser.end()
  }
}
