const episodesDropdownButtonXpath = '//button[contains (text(), "Episodes")]'
const freeTrialExpiredAlertXpath = '//div[contains (text(), "Your free trial has ended.")]'
const membershipExpiredAlertXpath = '//div[contains (text(), "Your membership has expired.")]'

module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm')
  },
  'User login tests': function (browser) {
    browser
      .waitForElementWithText('.hide-mobile:nth-child(5) a', 'Login')
      .loginUsingModal('freetrial@stage.podverse.fm')
      .waitForXpathPresent(episodesDropdownButtonXpath)
      .logOutUsingModal()
      .loginUsingModal('freetrialexpired@stage.podverse.fm')
      .waitForXpathPresent(episodesDropdownButtonXpath)
      .waitForXpathPresent(freeTrialExpiredAlertXpath)
      .logOutUsingModal()
      .loginUsingModal('premium@stage.podverse.fm')
      .waitForXpathPresent(episodesDropdownButtonXpath)
      .logOutUsingModal()
      .loginUsingModal('premiumexpired@stage.podverse.fm')
      .waitForXpathPresent(membershipExpiredAlertXpath)
      .logOutUsingModal()
  },
  after: function (browser) {
    browser.end()
  }
};
