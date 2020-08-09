const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Playlist Tests': function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .loginUsingModal(`premium@stage.podverse.fm`)
      
      .url(`${WEB_ORIGIN}/playlist/-67KgiG1`)
      .waitForElementWithText('div', 'Diam quis enim lobortis scelerisque fermentum dui faucibus.')

      .testSharedMetaTags()
      .testPageMetaTags(
        `Premium - Test Playlist 1`,
        `Premium - Test Playlist 1 - playlist on Podverse `
      )
  },
  after: function (browser) {
      browser.end()
  }
}
