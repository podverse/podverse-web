const { WEB_ORIGIN } = require('../constants')

const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Home Page': function (browser) {
    browser
      .waitForElementWithText('button', 'My Library')
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        `Podverse`,
        `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
      )
      .checkCurrentMedia(`Very Bad Wizards`, `podcast`)
      .checkCurrentMedia(`Lacus sed turpis tincidunt id aliquet risus feugiat in ante.`, `episode`)

      .checkFilter('Quam elementum pulvinar etiam non quam lacus suspendisse.')

      .scrollToSelector(`.pv-pagination`)
      .clickByXpath(`//button[@class="page-link"][contains (text(), "3")]`)
      .waitForXpathPresent(
        '//div[@class="media-list-item-a__title"][contains(text(), "Convallis tellus id interdum velit.")]'
      )

      .refresh()

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All`, `Subscribed`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`Subscribed`, `All`)

      .scrollToSelector(mediaListSelectsSelector)
      .clickDropdownToggleAndItem(`All`, `Categories`)
  },
  after: function (browser) {
    browser.end()
  }
}
