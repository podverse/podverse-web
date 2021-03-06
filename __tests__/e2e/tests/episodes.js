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
      .waitForXpathPresent(`//div[contains(text(), '"Antisocial" author Andrew Marantz on how the far right hijacked the internet')]`)
      .testSharedMetaTags()
      .testPageMetaTags(
        `Episodes`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )

      .checkFilter(`JSJ 420: OpenAPI, Redoc, and API Documentation with Adam Altman`)

      .scrollToSelector(`.pv-pagination`)
      .clickByXpath(`//button[@class="page-link"][contains (text(), "3")]`)
      .waitForXpathPresent('//div[@class="media-list-item-a__title"][contains(text(), "LUCIEN GREAVES")]')
      .refresh()

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
