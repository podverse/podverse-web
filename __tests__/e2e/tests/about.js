module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm/about')
  },
  'About Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'About')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Podverse - About',
        'Information about the Podverse open source podcast app.'
      )
  },
  after: function (browser) {
    browser.end()
  }
};
