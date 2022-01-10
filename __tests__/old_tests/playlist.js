const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Playlist: function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .loginUsingModal(`premium@stage.podverse.fm`)

      .url(`${WEB_ORIGIN}/playlist/-67KgiG1`)
      .waitForElementWithText('div', 'Diam quis enim lobortis scelerisque fermentum dui faucibus.')

      .testSharedMetaTags()
      .testPageMetaTags(
        `Premium - Test Playlist 1`,
        `Premium - Test Playlist 1 - playlist on Podverse - Consequat ac felis donec et. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Vitae et leo duis ut diam. Pretium aenean pharetra magna ac placerat vestibulum lectus. Iaculis at erat pellentesque adipiscing. Donec pretium vulputate sapien nec. Mattis pellentesque id nibh tortor id.`
      )
  },
  after: function (browser) {
    browser.end()
  }
}
