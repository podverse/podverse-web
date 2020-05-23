const freeTrialExpiredAlertXpath = '//div[contains (text(), "Your free trial has ended.")]'
const membershipExpiredAlertXpath = '//div[contains (text(), "Your membership has expired.")]'

module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm')
  },
  'User login tests': function (browser) {
    browser
      .waitForElementWithText('h3', 'Clips')
      .waitForElementWithText('.hide-mobile:nth-child(5) a', 'Login')
      .loginUsingModal('freetrial@stage.podverse.fm')
      .pause(3000)
      .logOutUsingModal()
      .loginUsingModal('freetrialexpired@stage.podverse.fm')
      .waitForXpathPresent(freeTrialExpiredAlertXpath)
      .logOutUsingModal()
      .loginUsingModal('premium@stage.podverse.fm')
      .pause(3000)
      .logOutUsingModal()
      .loginUsingModal('premiumexpired@stage.podverse.fm')
      .waitForXpathPresent(membershipExpiredAlertXpath)
      .logOutUsingModal()
  },
  after: function (browser) {
    browser.end()
  }
};
