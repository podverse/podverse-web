const WEB_ORIGIN = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Navigation Tests': function (browser) {
    browser
      .waitForElementWithText('h3', 'Clips')

      .scrollToSelector(`.footer-bottom__link[href="/about"]`, `down`)
      .click(`.footer-bottom__link[href="/about"]`)
      .waitForElementWithText('h3', 'About')

      .scrollToSelector(`.footer-bottom__link[href="/terms"]`, `down`)
      .click(`.footer-bottom__link[href="/terms"]`)
      .waitForElementWithText('h3', 'Terms of Service')

      .scrollToSelector(`.footer-bottom__link[href="/membership"]`, `down`)
      .click(`.footer-bottom__link[href="/membership"]`)
      .waitForElementWithText('h3', 'Premium')

      .clickByXpath(`//li[@class="hide-mobile nav-item"]//a[@class="nav-link"][@href="/search"]`)
      .waitForElementWithText('h3', 'Search')

      .click(`.nav-link[href="/podcasts"]`)
      .pause(1000)
      .waitForElementWithText('h3', 'Podcasts')

      .click(`.dropdown-toggle`)
      .click(`.dropdown-item[href="/settings"]`)
      .waitForElementWithText(`h3`, `Settings`)
  },
  after: function (browser) {
    browser.end()
  }
}
