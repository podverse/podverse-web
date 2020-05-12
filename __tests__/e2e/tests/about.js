module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm/about')
  },
  'About Page': function (browser) {
    browser
      .testSharedMetaTags()
      .testPageMetaTags(
        'Podverse - About',
        'Information about the Podverse open source podcast app.'
      )
      .waitForElementWithText('h3', 'About')
  },
  after: function (browser) {
    browser.end()
  }
};
