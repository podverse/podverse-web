const { WEB_ORIGIN } = require('../constants')

const mediaListSelectsSelector = '.media-list__selects'
const dropdownSelector = `.transparent.dropdown-toggle.btn.btn-secondary`
const rightDropdownSelector = `.media-list-selects__right ${dropdownSelector}`
const subLeftDropdownSelector = `.media-list-selects__inline .media-list__sub-select.dropdown:nth-child(1)`
const subRightDropdownSelector = `.media-list-selects__inline .media-list__sub-select.dropdown:nth-child(2)`

module.exports = {
  before: function (browser) {
    browser
      ._resetDatabase()
      .url(`${WEB_ORIGIN}/clips`)
  },  
  'Clips Page': function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        `Clips`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )

      .checkFilter('Quam elementum pulvinar etiam non quam lacus suspendisse.')

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
