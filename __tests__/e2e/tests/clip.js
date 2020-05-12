const dropdownToggleClipsXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Clips")]'
const dropdownToggleEpisodesXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Episodes")]'
const dropdownItemClipsXpath = '//button[@class="dropdown-item"][contains (text(), "Clips")]'
const dropdownItemEpisodesXpath = '//button[@class="dropdown-item"][contains (text(), "Episodes")]'
const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm/clip/9rA5BhWp')
  },
  'Clip Page tests': function (browser) {
    browser
      .testSharedMetaTags()
      .testPageMetaTags(
        'Amet aliquam id diam maecenas ultricies mi eget.',
        `Jason Calacanis: TikTok should be banned, Tim Cook doesn't have enough chutzpah, and Uber will be fine - Recode Decode`
      )
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .scrollToSelector(mediaListSelectsSelector)
      .click('xpath', dropdownToggleClipsXpath)
      .click('xpath', dropdownItemEpisodesXpath)
      .waitForXpathPresent('//div[contains(text(), "Aicha Evans and Jesse Levinson: Self-driving taxis will be here in 2021")]')
      .click('xpath', dropdownToggleEpisodesXpath)
      .click('xpath', dropdownItemClipsXpath)
      .waitForXpathPresent('//div[contains(text(), "Viverra orci sagittis eu volutpat odio facilisis mauris sit.")]')
  },
  after: function (browser) {
    browser.end()
  }
};
