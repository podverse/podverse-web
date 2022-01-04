const { WEB_ORIGIN } = require('../constants')

const playButton = '//button[@class="media-info-controls__play  btn btn-secondary"]'
const fundingButton = '//a[@class="pill centered-axis-xy-wrapper no-border font-thin color-warning"][@title="Support"]'

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/episode/rrQfG_-hsQr`)
  },
  'Episode Page': function (browser) {
    browser
      .testSharedMetaTags()
      .checkCurrentMedia(`Episode 37: What's Up Doc?`, `link`)

      .click('xpath', playButton)
      .waitForXpathPresent(fundingButton)
  },
  after: function (browser) {
    browser.end()
  }
}
