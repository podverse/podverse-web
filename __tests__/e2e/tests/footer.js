const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Footer': function (browser) {
    browser
      .scrollToSelector('.footer-middle')

  },
  after: function (browser) {
    browser.end()
  }
}
