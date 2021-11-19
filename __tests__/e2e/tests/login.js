const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Login': function (browser) {
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
