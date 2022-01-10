<<<<<<< HEAD
const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Login': function (browser) {
    browser
      .click('.navbar-secondary__dropdown .react-dropdown-select')  // Primary? Dropdown
      .click('.navbar-secondary__dropdown .react-dropdown-select-item:nth-child(2)')  // Primary Dropdown - Log in
      .waitForElementWithText('.ReactModal__Content h2', 'Log in')
      .waitForXpathPresent(`//button[@class="button-close"]`)
      .click('.button-close')      // Button Close
      .waitForXpathNotPresent(`//button[@class="button-close"]`)

      .click('.navbar-secondary__dropdown .react-dropdown-select') // Primary? Dropdown
      .click('.navbar-secondary__dropdown .react-dropdown-select-item:nth-child(2)') // Primary Dropdown - Log in
      .waitForElementWithText('.ReactModal__Content h2', 'Log in')
      .click('.button-rectangle.secondary')      // Button Rectangle Close

      .click('.navbar-secondary__dropdown .react-dropdown-select')  // Primary Dropdown
      .click('.navbar-secondary__dropdown .react-dropdown-select-item:nth-child(2)')  // Primary Dropdown - Log in
      .waitForElementWithText('button.button-link:nth-child(1) ', 'Reset Password')
      .click('button.button-link:nth-child(1)')
      .waitForElementWithText('.ReactModal__Content h2', 'Forgot Password')
      .click('.button-close')

      .click('.navbar-secondary__dropdown .react-dropdown-select')  // Primary Dropdown
      .click('.navbar-secondary__dropdown .react-dropdown-select-item:nth-child(2)')  // Primary Dropdown - Log in
      .waitForElementWithText('button.button-link:nth-child(2) ', 'Sign Up')
      .click('button.button-link:nth-child(2)')
      .waitForElementWithText('.ReactModal__Content h2', 'Sign Up')
      .click('.button-close')     


  },
  after: function (browser) {
    browser.end()
  }
}
=======
const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  Login: function (browser) {
    browser
      .click('.react-dropdown-select')
      .click('.react-dropdown-select-item:nth-child(3)')
      .waitForElementWithText('.ReactModal__Content h2', 'Log in')
      .waitForXpathPresent(`//button[@class="button-close"]`)
      .click('.button-close')
      .waitForXpathNotPresent(`//button[@class="button-close"]`)

      .click('.react-dropdown-select')
      .click('.react-dropdown-select-item:nth-child(3)')
      .waitForElementWithText('.ReactModal__Content h2', 'Log in')
      .click('.button-rectangle.secondary')

      .click('.react-dropdown-select')
      .click('.react-dropdown-select-item:nth-child(3)')
      .waitForElementWithText('button.button-link:nth-child(1) ', 'Reset Password')
      .click('button.button-link:nth-child(1)')
      .waitForElementWithText('.ReactModal__Content h2', 'Forgot Password')
      .click('.button-close')

      .click('.react-dropdown-select')
      .click('.react-dropdown-select-item:nth-child(3)')
      .waitForElementWithText('button.button-link:nth-child(2) ', 'Sign Up')
      .click('button.button-link:nth-child(2)')
      .waitForElementWithText('.ReactModal__Content h2', 'Sign Up')
      .click('.button-close')
  },
  after: function (browser) {
    browser.end()
  }
}
>>>>>>> aca26cff2202393972e23ba9efe1ce0f0b2662ab
