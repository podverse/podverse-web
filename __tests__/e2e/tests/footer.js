const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Footer': function (browser) {
    browser
      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-social-link-mastodon')
      .waitForElement('.footer-social-link-github')
      .waitForElement('.footer-social-link-twitter')
      .waitForElement('.footer-social-link-discord')


      .waitForElement('.footer-link-contact')
      .click('.footer-link-contact')
      
      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-about')
      .click('.footer-link-about')

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-terms')
      .click('.footer-link-terms')

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-premium')
      .click('.footer-link-premium')

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-mobile-app')
      .click('.footer-link-mobile-app')

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-support')
      .click('.footer-link-support')




      

  },
  after: function (browser) {
    browser.end()
  }
}
