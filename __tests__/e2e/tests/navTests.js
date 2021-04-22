const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Navigation Tests': function (browser) {
    browser
      // .waitForElementWithText('h3', 'Clips')

      .scrollToSelector(`.footer-bottom__link[href="/about"]`, `down`)
      .click(`.footer-bottom__link[href="/about"]`)
      .waitForElementWithText('h3', 'About')

      .scrollToSelector(`.footer-bottom__link[href="/terms"]`, `down`)
      .click(`.footer-bottom__link[href="/terms"]`)
      .waitForElementWithText('h3', 'Terms of Service')

      .scrollToSelector(`.footer-bottom__link[href="/membership"]`, `down`)
      .click(`.footer-bottom__link[href="/membership"]`)
      .waitForElementWithText('h3', 'Premium')

      .click(`.dropdown:nth-child(3)`)
      .click(`.dropdown-item[href="/settings"]`)
      .waitForElementWithText(`h3`, `Settings`)

      .click(`.navbar-brand`)
      .click(`.nav-link`)
      .waitForElementWithText('h3', 'Search')
  },
  after: function (browser) {
    browser.end()
  }
}
