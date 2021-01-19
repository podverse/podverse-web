const { WEB_ORIGIN } = require('../constants')

const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Home Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'Clips')
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        `Podverse`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )
      .checkCurrentMedia(`Recode Decode`, `podcast`)

      .checkFilter('Quam elementum pulvinar etiam non quam lacus suspendisse.')

      .scrollToSelector(`.pv-pagination`)
      .clickByXpath(`//button[@class="page-link"][contains (text(), "3")]`)
      .waitForXpathPresent('//div[@class="media-list-item-a__title"][contains(text(), "Tellus elementum sagittis vitae et.")]')

      .refresh()

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
