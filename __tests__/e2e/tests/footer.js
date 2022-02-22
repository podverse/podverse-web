const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Footer: function (browser) {
    browser
      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-social-link-mastodon')
      .waitForElement('.footer-social-link-github')
      .waitForElement('.footer-social-link-twitter')
      .waitForElement('.footer-social-link-discord')

      .waitForElement('.footer-link-contact')
      .click('.footer-link-contact')
      .waitForElementWithText('.text-page h2', 'E-mail')

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-about')
      .click('.footer-link-about')
      .waitForElementWithText(
        '.text-page p.bigger',
        'Podverse is an open source podcast manager for iOS, Android, and web.'
      )

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-terms')
      .click('.footer-link-terms')
      .waitForElementWithText('.text-page p', 'Podverse will never sell or share private user data.')

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-premium')
      .click('.footer-link-premium')
      .waitForElementWithText('.text-page p', 'Enjoy Podverse Premium for three months at no cost')

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-mobile-app')
      .click('.footer-link-mobile-app')
      .waitForElementWithText(
        '.text-page p.bigger',
        'Podverse is an open source podcast manager for iOS, Android, and web.'
      )

      .scrollToSelector('.footer-middle')
      .waitForElement('.footer-link-support')
      .click('.footer-link-support')
      .waitForElementWithText(
        '.text-page p',
        'Podverse creates free and open source software to expand what is possible in podcasting.'
      )
  },
  after: function (browser) {
    browser.end()
  }
}
