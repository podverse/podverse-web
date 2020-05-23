module.exports = {
  before: function (browser) {
      browser.url('https://stage.podverse.fm/')
  },
  'Modals': function (browser) {
    browser
      .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

      .click(`xpath`, `//li[@class="hide-mobile nav-item"]//a[@class="nav-link"][contains (text(), "Login")]`)
      .waitForXpathPresent(`//h3[contains(text(), 'Login')]`)
      .click('.login-modal__sign-up')
      .waitForXpathPresent(`//h3[contains(text(), 'Sign Up')]`)
      .click('.close-btn')

      .click(`xpath`, `//li[@class="hide-mobile nav-item"]//a[@class="nav-link"][contains (text(), "Login")]`)
      .waitForXpathPresent(`//h3[contains(text(), 'Login')]`)
      .click('.login-modal__forgot')
      .waitForXpathPresent(`//h3[contains(text(), 'Forgot Password')]`)
      .click('.close-btn')

      .clickModalAndClose(`queue`)
      .clickModalAndClose(`make-clip`, `clip`)
      .clickModalAndClose(`add-to`)
      .clickModalAndClose(`share`)
      .clickModalAndClose(`queue`)
  },
  after: function (browser) {
      browser.end()
  }
};
