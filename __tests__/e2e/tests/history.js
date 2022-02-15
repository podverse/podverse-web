const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  History: function (browser) {
    browser
      .click('div a[href="/history"]')
      .waitForElementWithText('.page-header h1', 'History') // Page Header
      .waitForElementWithText('.message-with-action div', 'Log in to view history') // Message with Action

      .loginUsingModal('premium@stage.podverse.fm')

      .waitForElementWithText('.page-scrollable-content .text-wrapper', '#1428 - Brian Greene')
      .logOutUsingModal()
  },
  after: function (browser) {
    browser.end()
  }
}
