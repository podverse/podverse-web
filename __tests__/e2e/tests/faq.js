module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm/faq')
  },
  'FAQ Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'FAQ')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Podverse - FAQ',
        'Podverse - Frequently asked questions'
      )
  },
  after: function (browser) {
    browser.end()
  }
};
