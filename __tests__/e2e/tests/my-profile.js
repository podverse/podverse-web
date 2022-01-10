const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'My Profile': function (browser) {
    browser
      .click('div a[href="/my-profile"]')
      .waitForElementWithText('.page-header h1', 'My Profile')
      .waitForElementWithText('.message-with-action div', 'Log in to view your profile')

      .loginUsingModal('premium@stage.podverse.fm')
      .waitForElementWithText('.profile-page-header h1', 'Premium Valid - Test User')
      .waitForElementWithText('.page-scrollable-content ul.list li:nth-child(1) div', '99% Invisible')
      .waitForElementWithText(
        '.page-scrollable-content ul.list li:nth-child(3) div div:nth-child(2)',
        'All JavaScript Podcasts by Devchat.tv'
      )

      .logOutUsingModal()
  },
  after: function (browser) {
    browser.end()
  }
}
