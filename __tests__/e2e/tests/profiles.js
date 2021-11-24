const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Profiles': function (browser) {
    browser
      .click('div a[href="/profiles"]')
      .waitForElementWithText('.page-header h1', 'Profiles')
      .waitForElementWithText('.message-with-action div', 'Log in to view your profiles')

      .loginUsingModal('premium@stage.podverse.fm')
      .waitForElementWithText('.page-scrollable-content .profile-list-item:nth-child(1) div.name', 'Free Trial Expired - Test User')
      .waitForElementWithText('.page-scrollable-content .profile-list-item:nth-child(3) div.name', 'Free Trial Valid - Test User')
      .waitForElementWithText('.page-scrollable-content .profile-list-item:nth-child(5) div.name', 'Premium Expired - Test User')


  },
  after: function (browser) {
    browser.end()
  }
}
