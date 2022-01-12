const { WEB_ORIGIN } = require('../constants')

const mediaListSelectsSelector = `.media-list__selects`
const dropdownSelector = `.transparent.dropdown-toggle.btn.btn-secondary`
const rightDropdownSelector = `.media-list-selects__right ${dropdownSelector}`
const subLeftDropdownSelector = `.media-list-selects__inline .media-list__sub-select.dropdown:nth-child(1)`
const subRightDropdownSelector = `.media-list-selects__inline .media-list__sub-select.dropdown:nth-child(2)`

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/episodes`)
  },
  'Episodes Page': function (browser) {
    browser
      .waitForXpathPresent(
        `//div[contains(text(), 'Brian Greene is a theoretical physicist, mathematician, and string theorist. He has been a professor at Columbia University since 1996 and chairman of the World Science Festival since co-founding it in 2008. His new book "Until the End of Time" is now available: https://amzn.to/2ug680o')]`
      )
      .testSharedMetaTags()
      .testPageMetaTags(
        `Episodes`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )

      .checkFilter(`JSJ 420: OpenAPI, Redoc, and API Documentation with Adam Altman`)

      .scrollToSelector(`.pv-pagination`)
      .clickByXpath(`//button[@class="page-link"][contains (text(), "3")]`)
      .waitForXpathPresent(`//div[@class="media-list-item-a__title"][contains(text(), "067 JSJ Testem with Toby Ho")]`)
      .refresh()

      .waitForElementWithText(dropdownSelector, 'All')
      .waitForElementWithText(rightDropdownSelector, 'top - past week')

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All`, `Subscribed`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`Subscribed`, `All`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All`, `Categories`)
      .waitForElementWithText(subLeftDropdownSelector, 'Arts')
      .waitForElementWithText(subRightDropdownSelector, 'All')
  },
  after: function (browser) {
    browser.end()
  }
}
