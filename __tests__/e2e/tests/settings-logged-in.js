const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
      browser
        .url(`${WEB_ORIGIN}/`)

  },
  'Subscribe to Playlist': function (browser) {
    
      browser
        .loginUsingModal('freetrial@stage.podverse.fm')
        .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

        .url(`${WEB_ORIGIN}/settings`)

        .expect.element(`input[id="settings-email"][value="freetrial@stage.podverse.fm"]`).to.be.present
      browser.expect.element(`input[id="settings-privacy-profile-link-input"][value="https://stage.podverse.fm/profile/EVHDBRZY"]`).to.be.present



  },
  after: function (browser) {
      browser.end()
  }
}
