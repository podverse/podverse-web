const { WEB_ORIGIN } = require('../constants')

const dropdownToggleClipsXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Clips")]'
const dropdownToggleChaptersXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Chapters")]'
const dropdownItemClipsXpath = '//button[@class="dropdown-item"][contains (text(), "Clips")]'
const dropdownItemChaptersXpath = '//button[@class="dropdown-item"][contains (text(), "Chapters")]'
const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/clip/9rA5BhWp`)
  },
  'Clip Page': function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Amet aliquam id diam maecenas ultricies mi eget.',
        `Jason Calacanis: TikTok should be banned, Tim Cook doesn't have enough chutzpah, and Uber will be fine - Recode Decode`
      )
      .scrollToSelector(mediaListSelectsSelector)
      .click('xpath', dropdownToggleClipsXpath)
      .click('xpath', dropdownItemChaptersXpath)
      .waitForXpathPresent(`//div[contains(text(), 'No chapters found')]`)
      .click('xpath', dropdownToggleChaptersXpath)
      .click('xpath', dropdownItemClipsXpath)
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
  },
  after: function (browser) {
    browser.end()
  }
}
