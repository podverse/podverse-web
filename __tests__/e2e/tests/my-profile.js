const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
      browser.url(`${WEB_ORIGIN}/`)
  },
  'My-Profile': function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      // .loginUsingModal(`premium@stage.podverse.fm`)

      // .url(`${WEB_ORIGIN}/my-profile`)
      // .waitForXpathPresent('//div[contains(text(), "Premium Valid - Test User")]')

      // .testSharedMetaTags()
      // .testPageMetaTags(
      //   `My Profile`,
      //   `My Podverse Profile. Subscribe to podcasts, playlists, and other profiles`
      // )            
  },
  after: function (browser) {
      browser.end()
  }
}
