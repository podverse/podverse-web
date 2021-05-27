const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}`)
  },
  'Settings Page': function (browser) {
    browser
      .url(`${WEB_ORIGIN}/settings`)
      .waitForElementWithText('h3', 'Settings')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Settings',
        'Customize your account settings on Podverse.'
      )

      // .waitForXpathPresent(`//button[@class="mp-player__time-jump-backward"]`)
      // .waitForXpathPresent(`//button[@class="mp-player__playback-rate"]`)
      // .click(`form .form-check:nth-child(4) .form-check-input`)
      // .click(`form .form-check:nth-child(5) .form-check-input`)
      // .waitForXpathNotPresent(`//button[@class="mp-player__time-jump-backward"]`)
      // .waitForXpathNotPresent(`//button[@class="mp-player__playback-rate"]`)
  },
  after: function (browser) {
    browser.end()
  }
}
