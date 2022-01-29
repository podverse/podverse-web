const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Settings: function (browser) {
    browser
      .loginUsingModal('premium@stage.podverse.fm')

      .click('.navbar-secondary__dropdown .react-dropdown-select')
      .click('.navbar-secondary__dropdown .react-dropdown-select-dropdown .react-dropdown-select-item:nth-child(3')
      .waitForElementWithText('.text-page h3', 'Account')

      .logOutUsingModal()
  },
  after: function (browser) {
    browser.end()
  }
}
