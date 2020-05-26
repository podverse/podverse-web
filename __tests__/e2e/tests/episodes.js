const { WEB_ORIGIN } = require('../constants')

const mediaListSelectsSelector = `.media-list__selects`
const dropdownSelector = `.transparent.dropdown-toggle.btn.btn-secondary`

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/episodes`)
  },
  'Home Page tests': function (browser) {
    browser
      .waitForElementWithText('h3', 'Episodes')
      .waitForXpathPresent(`//div[contains(text(), '"Antisocial" author Andrew Marantz on how the far right hijacked the internet')]`)
      .testSharedMetaTags()
      .testPageMetaTags(
        `Podverse - Create podcast highlights. Sync your podcasts across iOS, Android, and web. Open source technology.`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )

      .waitForElementWithText(dropdownSelector, 'All Podcasts')


      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All Podcasts`, `Subscribed`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`Subscribed`, `All Podcasts`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All Podcasts`, `Categories`)
      .waitForElementWithText(dropdownSelector, 'Arts')
      .waitForElementWithText(dropdownSelector, 'All')

  },
  after: function (browser) {
    browser.end()
  }
}
