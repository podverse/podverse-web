const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Queue': function (browser) {
    browser
      .click('div a[href="/queue"]')
      .waitForElementWithText('.page-header h1', 'Queue')
      .waitForElementWithText('.message-with-action div', 'Log in to view your queue')

      .loginUsingModal('premium@stage.podverse.fm')

      .logOutUsingModal()


  },
  after: function (browser) {
    browser.end()
  }
}
