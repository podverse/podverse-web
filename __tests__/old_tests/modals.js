const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Modals: function (browser) {
    browser
      .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

      .click('.navbar .dropdown.nav-item:nth-child(3)')
      .click('.navbar .dropdown.nav-item:nth-child(3) .dropdown-item:nth-child(3)')
      .click('.login-modal__sign-up')
      .waitForXpathPresent(`//h3[contains(text(), 'Sign Up')]`)
      .click('.close-btn')

      .click('.navbar .dropdown.nav-item:nth-child(3)')
      .click('.navbar .dropdown.nav-item:nth-child(3) .dropdown-item:nth-child(3)')
      .click('.login-modal__forgot')
      .waitForXpathPresent(`//h3[contains(text(), 'Forgot Password')]`)
      .click('.close-btn')

      .click(`.more-dropdown-menu`)
      .click(`.media-list__right .dropdown-menu .dropdown-item`)

      .clickModalAndClose(`make-clip`, `clip`)
      .clickModalAndClose(`add-to`)
      .clickModalAndClose(`share`)
  },
  after: function (browser) {
    browser.end()
  }
}
