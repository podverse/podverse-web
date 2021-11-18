const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Podcast': function (browser) {
    browser
      
      .click('.podcast-list-item:nth-child(1)')
      .waitForElementWithText('.podcast-page-header h1', 'The Joe Rogan Experience')
      .click('.button-circle.small.backwards')
      .waitForElementWithText('.page-header h1', 'Podcasts')
      .click('.button-circle.small.forwards')
      .waitForElementWithText('.podcast-page-header h1', 'The Joe Rogan Experience')




  },
  after: function (browser) {
    browser.end()
  }
}
