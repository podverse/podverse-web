module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm/terms')
  },
  'Terms Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'Terms of Service')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Podverse - Terms of Service',
        'Podverse terms of service agreement.'
      )
  },
  after: function (browser) {
    browser.end()
  }
};
