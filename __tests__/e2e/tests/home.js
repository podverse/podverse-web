const WEB_ORIGIN = require('../constants')

const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Home Page tests': function (browser) {
    browser
      .waitForElementWithText('h3', 'Clips')
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        `Podverse - Create podcast highlights. Sync your podcasts across iOS, Android, and web. Open source technology.`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All Podcasts`, `Subscribed`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`Subscribed`, `All Podcasts`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All Podcasts`, `Categories`)
  },
  after: function (browser) {
    browser.end()
  }
}
