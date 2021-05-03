const { WEB_ORIGIN } = require('../constants')

const freeTrialExpiredAlertXpath = '//div[contains (text(), "Your free trial has ended.")]'
const membershipExpiredAlertXpath = '//div[contains (text(), "Your membership has expired.")]'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}`)
  },
  'Auth: User login': function (browser) {
    browser
      .waitForElementWithText('div', 'Clips')

      .loginUsingModal('freetrial@stage.podverse.fm')
      .pause(3000)
      .logOutUsingModal()
      
      .loginUsingModal('premium@stage.podverse.fm')
      .pause(3000)
      .logOutUsingModal()
      
  },
  after: function (browser) {
    browser.end()
  }
}
