const { WEB_ORIGIN } = require('../constants')

const mediaListSelectsSelector = '.media-list__selects'
const dropdownSelector = `.transparent.dropdown-toggle.btn.btn-secondary`
const rightDropdownSelector = `.media-list-selects__right ${dropdownSelector}`
const subLeftDropdownSelector = `.media-list-selects__left-and-right .media-list__sub-select.dropdown`
const subRightDropdownSelector = `.media-list-selects__left-and-right .media-list__sub-select.align-right-2.dropdown`

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/clips`)
  },
  'Clips Page tests': function (browser) {
    browser
      .waitForElementWithText('h3', 'Clips')
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        `Clips`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )

      .waitForElementWithText(dropdownSelector, 'All Podcasts')
      .waitForElementWithText(rightDropdownSelector, 'top - past week')

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All Podcasts`, `Subscribed`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`Subscribed`, `All Podcasts`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All Podcasts`, `Categories`)
      .waitForElementWithText(subLeftDropdownSelector, 'Arts')
      .waitForElementWithText(subRightDropdownSelector, 'All')
  },
  after: function (browser) {
    browser.end()
  }
}
