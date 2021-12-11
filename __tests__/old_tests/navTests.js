const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Navigation Tests': function (browser) {
    browser
      .waitForElementWithText('button', 'My Library')

      .scrollToSelector(`.footer-middle__link[href="/about"]`, `down`)
      .click(`.footer-middle__link[href="/about"]`)
      .waitForElementWithText('h3', 'About')

      .scrollToSelector(`.footer-middle__link[href="/terms"]`, `down`)
      .click(`.footer-middle__link[href="/terms"]`)
      .waitForElementWithText('h3', 'Terms of Service')

      .scrollToSelector(`.footer-middle__link[href="/membership"]`, `down`)
      .click(`.footer-middle__link[href="/membership"]`)
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
