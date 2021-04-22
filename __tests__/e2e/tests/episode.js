const { WEB_ORIGIN } = require('../constants')

const dropdownToggleClipsXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Clips")]'
const dropdownToggleChaptersXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Chapters")]'
const dropdownItemClipsXpath = '//button[@class="dropdown-item"][contains (text(), "Clips")]'
const dropdownitemChaptersXpath = '//button[@class="dropdown-item"][contains (text(), "Chapters")]'
const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/episode/nkLmKNNwwcO`)
  },
  'Episode Page': function (browser) {
    browser
      .waitForXpathPresent('//article[contains(text(), "The Americans are coming, but will the war be over by the time they get there? Germany throws everything into a last series of stupendous attacks in the West while hoping to avoid getting burned by a fire in the East they helped fan.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        `Show 55 - Blueprint for Armageddon VI - Dan Carlin's Hardcore History`,
        `The Americans are coming, but will the war be over by the time they get there Germany throws everything into a last series of stupendous attacks in the West while hoping to avoid getting burned by a fire in the East they helped fan.`
      )
      .checkCurrentMedia(`Show 55 - Blueprint for Armageddon VI`, `episode`)
      .scrollToSelector(mediaListSelectsSelector)
      .click('xpath', dropdownToggleClipsXpath)
      .click('xpath', dropdownitemChaptersXpath)
      .waitForXpathPresent('//div[contains(text(), "No chapters found")]')
      .click('xpath', dropdownToggleChaptersXpath)
      .click('xpath', dropdownItemClipsXpath)
      .waitForXpathPresent('//div[contains(text(), "No clips found")]')
  },
  after: function (browser) {
    browser.end()
  }
}
