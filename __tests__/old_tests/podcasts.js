const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/podcasts`)
  },
  'Podcasts Page': function (browser) {
    browser
      .waitForXpathPresent('//a[@class="header-nav-tab active"][contains(text(), "Podcasts")]')
      .testSharedMetaTags()
      .testPageMetaTags(`Podcasts`, `Find and subscribe to podcasts.`)

      .scrollToSelector(`.pv-pagination`)
      .clickByXpath(`//button[@class="page-link"][contains (text(), "3")]`)
      .waitForXpathPresent('//div[@class="media-list-item-b__title"][contains(text(), "99% Invisible")]')
      .refresh()
  },
  after: function (browser) {
    browser.end()
  }
}
