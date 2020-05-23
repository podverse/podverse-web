const WEB_ORIGIN = require('../constants')

const dropdownToggleClipsXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Clips")]'
const dropdownToggleEpisodesXpath = '//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "Episodes")]'
const dropdownItemClipsXpath = '//button[@class="dropdown-item"][contains (text(), "Clips")]'
const dropdownItemEpisodesXpath = '//button[@class="dropdown-item"][contains (text(), "Episodes")]'
const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/episode/nkLmKNNwwcO`)
  },
  'Episode Page tests': function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "The Americans are coming, but will the war be over by the time they get there? Germany throws everything into a last series of stupendous attacks in the West while hoping to avoid getting burned by a fire in the East they helped fan.")]')
      .testSharedMetaTags()
      .testPageMetaTags(
        `Show 55 - Blueprint for Armageddon VI - Dan Carlin's Hardcore History`,
        `The Americans are coming, but will the war be over by the time they get there? Germany throws everything into a last series of stupendous attacks in the West while hoping to avoid getting burned by a fire in the East they helped fan.`
      )
      .scrollToSelector(mediaListSelectsSelector)
      .click('xpath', dropdownToggleClipsXpath)
      .click('xpath', dropdownItemEpisodesXpath)
      .waitForXpathPresent('//div[contains(text(), "Show 55 - Blueprint for Armageddon VI")]')
      .click('xpath', dropdownToggleEpisodesXpath)
      .click('xpath', dropdownItemClipsXpath)
      .waitForXpathPresent('//div[contains(text(), "Ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae.")]')
  },
  after: function (browser) {
    browser.end()
  }
}
