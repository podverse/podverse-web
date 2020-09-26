const { WEB_ORIGIN } = require('../constants')

const dropdownToggleClipsXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Clips")]'
const dropdownToggleEpisodesXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Episodes")]'
const dropdownItemClipsXpath = '//button[@class="dropdown-item"][contains (text(), "Clips")]'
const dropdownItemEpisodesXpath = '//button[@class="dropdown-item"][contains (text(), "Episodes")]'
const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/clip/9rA5BhWp`)
  },
  'Clip Page tests': function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Amet aliquam id diam maecenas ultricies mi eget.',
        `Jason Calacanis: TikTok should be banned, Tim Cook doesn't have enough chutzpah, and Uber will be fine - Recode Decode`
      )
      .scrollToSelector(mediaListSelectsSelector)
      .click('xpath', dropdownToggleClipsXpath)
      .click('xpath', dropdownItemEpisodesXpath)
      .waitForXpathPresent(`//div[contains(text(), '"Antisocial" author Andrew Marantz on how the far right hijacked the internet')]`)
      .click('xpath', dropdownToggleEpisodesXpath)
      .click('xpath', dropdownItemClipsXpath)
      .waitForXpathPresent('//div[contains(text(), "Viverra orci sagittis eu volutpat odio facilisis mauris sit.")]')
  },
  after: function (browser) {
    browser.end()
  }
}
